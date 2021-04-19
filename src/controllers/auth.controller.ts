import { IAuthService, Req, Res } from '../types';
import { AuthService } from '../services/auth.service';
import { NextFunction } from 'express';

export class AuthController {
  authService: IAuthService;
  constructor(options?: any) {
    // For testing purposes we can inject db mock here
    this.authService = options.auth;
  }

  getSignUp = (req: Req, res: Res) => {
    res.json({ message: 'You are signing up' });
  };

  postSignUp = async (req: Req, res: Res, next: NextFunction) => {
    const signUpData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    try {
      const user = await this.authService.SignUp(signUpData);
      res.json({
        message: 'Account created successfully',
        body: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  getLogIn = (req: Req, res: Res) => {
    res.json({ message: 'You are logging in' });
  };

  postLogIn = async (req: Req, res: Res, next: NextFunction) => {
    const logInData = {
      email: req.body.email,
      password: req.body.password,
    };
    try {
      const { _id, token } = await this.authService.LogIn(logInData);
      res.cookie('token', token, { httpOnly: true });
      res.set('Authorization', `Bearer: ${token}`);
      res.json({
        message: 'Logged successfully',
        body: { _id, token },
      });
    } catch (error) {
      next(error);
    }
  };

  getLogOut = (req: Req, res: Res) => {
    res.json({ message: 'You are going away :( ' });
  };

  postLogOut = (req: Req, res: Res) => {
    res.json({ deleteToken: true });
  };

  getActivate = async (req: Req, res: Res, next: NextFunction) => {
    const token = req.params.token;

    try {
      if (!token) throw new Error('Token was not provided');

      await this.authService.Activate(token);

      res.json({
        message: 'User account activated. Please proceed to login',
      });
    } catch (error) {
      next(error);
    }
  };
}

// Default Controller
const authController = new AuthController({ auth: AuthService });

export default authController;
