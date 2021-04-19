import { check, validationResult } from 'express-validator';
import { Req, Res } from '../types';
import { NextFunction } from 'express';

const validate = (req: Req, res: Res, next: NextFunction) => {
  const errors = validationResult(req).array();
  if (errors.length > 0)
    return res.status(400).json({ error: errors[0] });
  next();
};

export const isLogInValid = () => [
  check('email', 'Must be valid email address')
    .isEmail()
    .normalizeEmail()
    .trim(),
  check('password', 'Password must containt at least 8 characters')
    .notEmpty()
    .isLength({ min: 8, max: 100 }),
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
  check('password', 'Password must contain at least 8 characters')
    .notEmpty()
    .isLength({ min: 8, max: 100 }),
  validate,
];

export default validate;
