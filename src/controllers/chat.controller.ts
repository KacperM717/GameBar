import { NextFunction } from 'express';
import { globalEmitter } from '../events';
import { IChatService, Req, Res } from '../types';

export class ChatController {
  chatService: IChatService;
  constructor(chatService: IChatService) {
    this.chatService = chatService;
  }

  postCreateChat = async (req: Req, res: Res, next: NextFunction) => {
    const name = req.body.name;
    const members = req.body.members;
    const closed = req.body.closed;
    try {
      if (!members) throw new Error('Members of chat not specified');

      const chat = await this.chatService.createChat(
        [...members, req?.user?._id],
        name,
        closed,
      );
      if (!chat)
        throw new Error('Error occured while creating chat...');
      globalEmitter.emit('CHAT_CREATED', { chat });
      return res.json({
        msg: 'Chat created successfully',
        body: chat,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserChats = async (req: Req, res: Res, next: NextFunction) => {
    const id = req?.user?._id;
    try {
      if (!id) throw new Error('Cannot fetch chats without user');
      const chats = await this.chatService.getUserChats(id);
      res.json({ msg: 'Here are your chats', body: chats });
    } catch (error) {
      next(error);
    }
  };

  getAddUser = async (req: Req, res: Res, next: NextFunction) => {
    const chatId = req.body.chatId;
    const userId = req.body.userId;

    try {
      if (!chatId) throw new Error('Chat was not specified');
      if (!userId) throw new Error('User was not specified');

      await this.chatService.addUserToChat(chatId, userId);
      globalEmitter.emit('CHAT_USER_ADDED', { chatId, userId });
      res.json({ msg: 'User added to chat' });
    } catch (error) {
      next(error);
    }
  };

  getLeaveChat = async (req: Req, res: Res, next: NextFunction) => {
    const chatId = req.body.chatId;
    const userId = req.body.userId;

    try {
      if (!chatId) throw new Error('Chat was not specified');
      if (!userId) throw new Error('User was not specified');

      await this.chatService.leaveChat(chatId, userId);
      globalEmitter.emit('CHAT_USER_LEFT', { chatId, userId });
    } catch (error) {
      next(error);
    }
  };

  getChat = async (req: Req, res: Res, next: NextFunction) => {
    const chatId = req.params.id;

    try {
      if (!chatId) throw new Error('Chat was not specified');

      await this.chatService.getChat(chatId);
    } catch (error) {
      next(error);
    }
  };

  deleteChat = async (req: Req, res: Res, next: NextFunction) => {
    const chatId = req.body.chatId;

    try {
      if (!chatId) throw new Error('Chat was not specified');

      await this.chatService.deleteChat(chatId);
      globalEmitter.emit('CHAT_DELETED', { chatId });
    } catch (error) {
      next(error);
    }
  };
}
