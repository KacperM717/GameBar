import Chat from '../db/models/chat.model';
import { IChatService } from '../types';

export const ChatService: IChatService = {
  createChat: async (
    members: string[],
    name: string,
    closed: boolean,
  ) => {
    if (members.length > 2)
      throw new Error(
        'To create a chat you need at least two participants',
      );
    const chat = await Chat.create({
      name: name || `Chat #${Math.floor(Math.random() * 1000)}`,
      members,
      closed,
    });

    return chat;
  },
  getUserChats: async (userId: string) => {
    return await Chat.find({ $in: { members: userId } });
  },
  addUserToChat: async (chatId: string, userId: string) => {
    return await Chat.findByIdAndUpdate(chatId, {
      $addToSet: { members: userId },
    });
  },
  leaveChat: async (chatId: string, userId: string) => {
    return await Chat.findByIdAndUpdate(chatId, {
      $pull: { members: userId },
    });
  },
};
