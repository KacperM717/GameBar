import { IAuthService, Req, Res } from '../types';
import { AuthService } from '../services/auth.service';
import { NextFunction } from 'express';
import { CLIENT_HOST, HOST } from '../config';

export class AuthController {
  authService: IAuthService;
  constructor(options?: any) {
    // For testing purposes we can inject db mock here
    this.authService = options.auth;
  }

  getSignUp = (req: Req, res: Res) => {
    res.json({ msg: 'You are signing up' });
  };

  postSignUp = async (req: Req, res: Res, next: NextFunction) => {
    const signUpData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    try {
      await this.authService.SignUp(signUpData);
      res.status(200).json({
        msg: 'Account created successfully. Please Check your inbox',
      });
    } catch (error) {
      next(error);
    }
  };

  getLogIn = (req: Req, res: Res) => {
    res.json({ msg: 'You are logging in' });
  };

  postLogIn = async (req: Req, res: Res, next: NextFunction) => {
    const logInData = {
      email: req.body.email,
      password: req.body.password,
    };
    try {
      const authDTO = await this.authService.LogIn(logInData);
      res.cookie('token', authDTO.token, {
        maxAge: 86_400_000,
        sameSite: 'lax',
        domain: HOST.replace(/^https?:\/\//, ''),
        httpOnly: true,
      });
      res.status(200).json({
        msg: 'Logged successfully',
        body: authDTO,
      });
    } catch (error) {
      next(error);
    }
  };

  getLogOut = (req: Req, res: Res) => {
    res.cookie('token', '', {
      maxAge: -1,
      sameSite: 'lax',
      domain: HOST.replace(/^https?:\/\//, ''),
      httpOnly: true,
    });
    res
      .status(200)
      .json({ msg: "Oh farewell... Hope it won't last long" });
  };

  postLogOut = (req: Req, res: Res) => {
    res.cookie('token', '', {
      maxAge: -1,
      sameSite: 'lax',
      domain: HOST.replace(/^https?:\/\//, ''),
      httpOnly: true,
    });
    res
      .status(200)
      .json({ msg: "Oh farewell... Hope it won't last long" });
  };

  getActivate = async (req: Req, res: Res, next: NextFunction) => {
    const token = req.params.token;

    try {
      if (!token) throw new Error('Token was not provided');

      await this.authService.Activate(token);

      res.redirect(CLIENT_HOST);
    } catch (error) {
      next(error);
    }
  };

  getToken = async (req: Req, res: Res, next: NextFunction) => {
    const token = req.cookies.token;
    try {
      if (!token) throw new Error('Token was not provided');
      const authDTO = await this.authService.Update(token);
      res.cookie('token', authDTO.token, {
        maxAge: 86_400_000,
        sameSite: 'lax',
        domain: HOST.replace(/^https?:\/\//, ''),
        httpOnly: true,
      });
      res.status(200).json({
        msg: 'Token refreshed successfully',
        body: authDTO,
      });
    } catch (error) {
      next(error);
    }
  };
}

// Default Controller
const authController = new AuthController({ auth: AuthService });

export default authController;
