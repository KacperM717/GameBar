import { AuthRoute } from './auth.route';
import { Application } from 'express';

export const routes = {
  auth: AuthRoute,
};

export default function attachRoutes(app: Application) {
  Object.values(routes).forEach((route) => route(app));
}
