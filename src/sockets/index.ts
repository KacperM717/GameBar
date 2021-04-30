import http from 'http';
import { Server } from 'socket.io';
import {
  ChatDTO,
  FriendDTO,
  TokenDTO,
  UserSocket,
  WSRes,
} from '../types';
import { CLIENT_HOST, JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';
import { globalEmitter } from '../events';
import Chat from '../db/models/chat.model';
import Message from '../db/models/message.model';
import mongoose from 'mongoose';

export const initSocketIO = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    serveClient: false,
    cors: {
      origin: [CLIENT_HOST],
      methods: ['GET', 'POST'],
      allowedHeaders: '*',
      credentials: true,
    },
  });

  // Friend HTTP Listeners

  globalEmitter.on('FRIEND_REQUEST', ({ user, targetId }) => {
    io.to(targetId).emit('friend:request', user);
  });
  globalEmitter.on('FRIEND_ACCEPTED', ({ user, target }) => {
    io.to(target._id.toString()).emit('friend:accepted', user);
    io.to(user._id.toString()).emit('friend:accepted', target);
  });
  globalEmitter.on('FRIEND_BLOCKED', ({ userId, target }) => {
    io.to(userId).emit('friend:blocked', target);
    io.to(target._id.toString()).emit('friend:blocking', userId);
  });
  globalEmitter.on('FRIEND_REMOVED', ({ userId, targetId }) => {
    io.to(userId.toString()).emit('friend:removed', targetId);
    io.to(targetId.toString()).emit('friend:removing', userId);
  });

  // Chat HTTP Listeners
  globalEmitter.on('CHAT_CREATED', ({ chat }) => {
    const mappedMems = chat.members.map(({ _id }: { _id: any }) =>
      _id.toString(),
    );
    io.to(mappedMems).emit('chat:add', chat._id);
  });
  globalEmitter.on('CHAT_USER_ADDED', ({ chat, userId }) => {
    console.log('CHATID', chat._id, 'USERID', userId);
    io.to(userId).emit('chat:add', chat._id);
  });
  globalEmitter.on('CHAT_USER_LEFT', ({ chatId, userId }) => {
    io.to(chatId).emit('chat:user_left', { chatId, userId });
  });
  globalEmitter.on('CHAT_DELETED', ({ chatId }) => {
    io.to(chatId).emit('chat:deleted', chatId);
  });

  let connected: string[] = [];

  io.on('connection', (socket: UserSocket) => {
    socket.user = {
      name: '',
      avatar: '',
      _id: '',
      token: '',
      friends: [],
      chats: [],
    };
    // Auth Events
    socket.on(
      'login',
      (
        {
          _id,
          token,
          name,
          avatar,
        }: TokenDTO & { name: string; avatar: string },
        res: (a: WSRes<void>) => void,
      ) => {
        if (!_id || !token)
          return res({ ok: false, msg: 'Credentials not provided' });
        const { _id: id } = jwt.verify(token, JWT_SECRET) as {
          email: string;
          _id: string;
        };
        if (_id !== id)
          return res({ ok: false, msg: 'Credentials do not match' });
        // Pass to user object
        socket.user!.name = name;
        socket.user!.avatar = avatar;
        socket.user!._id = _id;
        socket.user!.token = token;
        socket.join(socket.user!._id);
        connected.push(_id);
        res({ ok: true, msg: 'WS auth established' });
      },
    );
    socket.on('logout', () => {
      if (!socket.user) return;
      for (const { _id } of socket.user.chats) {
        socket.to(_id).emit('chat:user_offline', socket.user!._id);
      }
      const verifiedFriends = socket.user.friends
        .filter((friend) => friend.role === 'friend')
        .map((friend) => friend._id);
      if (verifiedFriends.length > 0)
        socket
          .to(verifiedFriends)
          .emit('friend:offline', socket.user._id);
      socket.leave(socket.user._id);
      connected = connected.filter((id) => id !== socket.user!._id);
      socket.user._id = '';
    });
    socket.on('disconnect', () => {
      if (!socket.user?._id) return;
      for (const { _id } of socket.user.chats) {
        socket.to(_id).emit('chat:user_offline', socket.user!._id);
      }
      const verifiedFriends = socket.user.friends
        .filter((friend) => friend.role === 'friend')
        .map((friend) => friend._id);
      if (verifiedFriends.length > 0)
        socket
          .to(verifiedFriends)
          .emit('friend:offline', socket.user._id);
      socket.leave(socket.user._id);
      connected = connected.filter((id) => id !== socket.user!._id);
      socket.user = undefined;
    });

    // Friends Events
    socket.on('friend:init', (friends: FriendDTO[]) => {
      socket.user!.friends = friends;
      const verifiedFriends = socket
        .user!.friends.filter((friend) => friend.role === 'friend')
        .map((friend) => friend._id);
      if (verifiedFriends.length > 0)
        socket
          .to(verifiedFriends)
          .emit('friend:online', [socket.user!._id]);
      const onlineFriends = connected.filter((id) =>
        verifiedFriends.includes(id),
      );
      socket.emit('friend:online', onlineFriends);
    });

    // Chats Events
    socket.on('chat:init', (chats: ChatDTO[]) => {
      socket.user!.chats = chats;
      if (chats.length > 0)
        socket.join(socket.user!.chats.map((chat) => chat._id));
    });
    socket.on('chat:added', (chat) => {
      const chatId = chat._id.toString();
      socket.user!.chats.push(chat);
      socket.to(chatId).emit('chat:user_joined', {
        chatId,
        user: {
          _id: socket.user!._id,
          name: socket.user!.name,
          avatar: socket.user!.avatar,
        },
      });
      socket.join(chatId);
    });
    socket.on('chat:send', async ({ chatId, msg }) => {
      try {
        const message = await Message.create({
          text: msg.toString(),
          author: mongoose.Types.ObjectId(socket.user!._id),
        });
        await Chat.findByIdAndUpdate(chatId, {
          $push: { messages: message },
        });
        const populatedMessage = await message
          .populate({
            path: 'author',
            select: '_id name avatar',
          })
          .execPopulate();
        io.to(chatId).emit('chat:receive', {
          chatId,
          message: populatedMessage,
        });
      } catch (error) {
        socket.emit('chat:message_error', { chatId, error });
      }
    });
    socket.on('chat:leaving', (chatId) => {
      socket.leave(chatId);
      if (socket.user) {
        socket.user.chats = socket.user.chats.filter(
          (chat) => chat._id !== chatId,
        );
      }
    });
    // Event emitted when user wants to call others
    socket.on('video:call', (friendId) => {
      // Call user
      console.log(`${socket.user?._id} is calling ${friendId}`);
      socket.to(friendId).emit('video:calling', socket.user?._id);
    });
    // Event emitted when user rejects calling
    socket.on('video:reject', (friendId) => {
      socket.to(friendId).emit('video:rejected', socket.user?._id);
    });
    socket.on('video:accept', (friendId, peerId) => {
      socket.to(friendId).emit('video:accepted', peerId);
    });
  });
  return io;
};
