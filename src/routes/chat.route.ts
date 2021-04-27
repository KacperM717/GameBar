import { Application } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { ChatService } from '../services/chat.sevice';

export function ChatRoute(app: Application) {
  const controller = new ChatController(ChatService);
  app.post('/chat/create', controller.postCreateChat);
  app.get('/chat/', controller.getUserChats);
  app.get('/chat/add', controller.getAddUser);
  app.get('/chat/leave', controller.getLeaveChat);
  app.delete('/chat/', controller.deleteChat);
  app.get('/chat/:id/', controller.getChat);
}
