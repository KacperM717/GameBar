import Chat from '../db/models/chat.model';
import Message from '../db/models/message.model';
import { ChatDTO, UserSocket } from '../types';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

export const attachChat = (socket: UserSocket, io: Server) => {
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

  return socket;
};
