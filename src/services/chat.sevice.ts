import Chat from '../db/models/chat.model';
import { IChatService, ChatDTO } from '../types';

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
    const chats = (await Chat.find({
      members: userId,
    }).populate({
      path: 'members',
      select: '_id name',
    })) as ChatDTO[];
    return chats;
  },
  addUserToChat: async (chatId: string, userId: string) => {
    return await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: { members: userId },
      },
      { new: true },
    );
  },
  leaveChat: async (chatId: string, userId: string) => {
    return await Chat.findByIdAndUpdate(chatId, {
      $pull: { members: userId },
    });
  },
  getChat: async (chatId: string) => {
    return (await Chat.findById(chatId).populate({
      path: 'members',
      select: '_id name',
    })) as ChatDTO;
  },
  deleteChat: async (chatId: string) => {
    return await Chat.findByIdAndDelete(chatId);
  },
};
