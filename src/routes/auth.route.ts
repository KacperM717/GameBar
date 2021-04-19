import AuthController from '../controllers/auth.controller';
import { Application } from 'express';
import {
  isSignUpValid,
  isLogInValid,
} from '../middlewares/validation.middle';

export function AuthRoute(app: Application) {
  const controller = AuthController;
  // Middlewares for all subroutes

  // Sign Up Route
  // app.use('/auth/signup', isNotAuth);
  app.get('/auth/signup', controller.getSignUp);
  app.post('/auth/signup', isSignUpValid(), controller.postSignUp);

  // Log In Route
  // app.use('/auth/login', isNotAuth);
  app.get('/auth/login', controller.getLogIn);
  app.post('/auth/login', isLogInValid(), controller.postLogIn);

  // Activate User Route
  app.get('/auth/activate/:token', controller.getActivate);

  // Log Out Route
  app.get('/auth/logout', controller.getLogOut);
  app.post('/auth/logout', controller.postLogOut);
}
