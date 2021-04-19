import { NextFunction } from 'express';
import { Req, Res } from '../types';

export const isNotAuth = (req: Req, res: Res, next: NextFunction) => {
  if (req.user)
    return res.status(401).send('User is already signed in');
  next();
};

export const isAuth = (req: Req, res: Res, next: NextFunction) => {
  if (!req.user) return res.status(401).send('Permission rejected');
  next();
};
