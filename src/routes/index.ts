import { AuthRoute } from './auth.route';
import { Application } from 'express';
import { FriendRoute } from './friend.route';

export const routes = {
  auth: AuthRoute,
  friend: FriendRoute,
};

export default function attachRoutes(app: Application) {
  Object.values(routes).forEach((route) => route(app));
}
