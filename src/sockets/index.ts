import http from 'http';
import { Server } from 'socket.io';
import { UserSocket } from '../types';
import { CLIENT_HOST } from '../config';
import { globalEmitter } from '../events';
import { attachAuth } from './auth.socket';
import { attachChat } from './chat.socket';
import { attachFriend } from './friend.socket';
import { attachVideo } from './video.socket';

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

  const connected: string[] = [];

  io.on('connection', (socket: UserSocket) => {
    attachAuth(socket, connected);
    attachFriend(socket, connected);
    attachChat(socket, io);
    attachVideo(socket);
  });
  return io;
};
