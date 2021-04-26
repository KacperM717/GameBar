import { Application } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { ChatService } from '../services/chat.sevice';

export function ChatRoute(app: Application) {
  const controller = new ChatController(ChatService);
  app.post('/chats/create', controller.postCreateChat);
  app.get('/chats/', controller.getUserChats);
  app.get('/chats/add', controller.getAddUser);
  app.get('/chats/leave', controller.getLeaveChat);
  // app.post('/chats/delete', controller.deleteChat);
}
