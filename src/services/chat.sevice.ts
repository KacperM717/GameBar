import Chat from '../db/models/chat.model';
import { IChatService, ChatDTO, ChatDoc } from '../types';

export const ChatService: IChatService = {
  createChat: async (
    members: string[],
    name: string,
    closed: boolean,
  ) => {
    const chat = await Chat.create({
      name: name || `Chat #${Math.floor(Math.random() * 1000)}`,
      members,
      closed,
    });
    const populated = await populateChat(chat);
    return populated as ChatDTO;
  },
  getUserChats: async (userId: string) => {
    const chats = await Chat.find({
      members: userId,
    });
    const populatedChats = [];
    for await (const chat of chats) {
      const populatedChat = await populateChat(chat);
      populatedChats.push(populatedChat);
    }
    return populatedChats as ChatDTO[];
  },
  addUserToChat: async (chatId: string, userId: string) => {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, closed: false },
      { $addToSet: { members: userId } },
      { new: true },
    );
    if (!chat) throw new Error('Cannot add user to this chat.');
    const popChat = await populateChat(chat);
    return popChat;
  },
  leaveChat: async (chatId: string, userId: string) => {
    return await Chat.findByIdAndUpdate(chatId, {
      $pull: { members: userId },
    });
  },
  getChat: async (chatId: string) => {
    const chat = (await Chat.findById(chatId)) as ChatDoc;
    return (await populateChat(chat)) as ChatDTO;
  },
  deleteChat: async (chatId: string) => {
    return await Chat.findByIdAndDelete(chatId);
  },
};

function populateChat(chat: ChatDoc) {
  return chat
    .populate({
      path: 'members',
      select: '_id name avatar',
    })
    .populate({
      path: 'messages.author',
      select: '_id name avatar',
    })
    .execPopulate();
}
