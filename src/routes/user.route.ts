import { Application } from 'express';
import { sanitizeQuery } from 'express-validator';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

export function UserRoute(app: Application) {
  const controller = new UserController(UserService);

  app.get('/users/', sanitizeQuery(), controller.getAllByName);
}
