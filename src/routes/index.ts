import { AuthRoute } from './auth.route';
import { Application } from 'express';
import { FriendRoute } from './friend.route';
import { UserRoute } from './user.route';
import { ChatRoute } from './chat.route';

export const routes = {
  auth: AuthRoute,
  friend: FriendRoute,
  user: UserRoute,
  chat: ChatRoute,
};

export default function attachRoutes(app: Application) {
  Object.values(routes).forEach((route) => route(app));
}
