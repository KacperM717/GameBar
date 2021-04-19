import { check, validationResult } from 'express-validator';
import { Req, Res } from '../types';
import { NextFunction } from 'express';

const validate = (req: Req, res: Res, next: NextFunction) => {
  const errors = validationResult(req)
    .array()
    .map(({ msg, param, location }) => ({ msg, param, location }));
  if (errors.length > 0) return res.status(400).json(errors);
  next();
};

export const isLogInValid = () => [
  check('email', 'Email address is incorrect')
    .isEmail()
    .normalizeEmail()
    .trim(),
  check('password', 'Password is incorrect').isLength({
    min: 8,
    max: 100,
  }),
  validate,
];

export const isSignUpValid = () => [
  check('name', 'Name may consist only letters and numbers')
    .escape()
    .isAlphanumeric()
    .trim(),
  check('email', 'Must be valid email address')
    .isEmail()
    .normalizeEmail()
    .trim(),
  check(
    'password',
    'Password must contain at least 8 characters',
  ).isLength({ min: 8, max: 100 }),
  validate,
];

export default validate;
