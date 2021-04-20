import { Application } from 'express';
import { FriendService } from '../services/friend.service';
import { FriendController } from '../controllers/friend.controller';

export function FriendRoute(app: Application) {
  const controller = new FriendController(FriendService);

  app.post('/friend/add', controller.postAdd);
  app.post('/friend/accept', controller.postAccept);
  app.post('/friend/block', controller.postBlock);
  app.post('/friend/remove', controller.postRemove);
  app.get('/friend/list', controller.getFriendList);
}
