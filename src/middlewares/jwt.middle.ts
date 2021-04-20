import { Request } from 'express';
import jwt from 'express-jwt';

type TokenGetters = {
  fromHeaderOrCookie: (req: Request) => string | null;
};

const tokenGetters: TokenGetters = {
  fromHeaderOrCookie: (req: Request) => {
    console.log(req.headers.authorization);
    console.log(req.cookies);
    return req.headers.authorization
      ? req.headers.authorization?.split(' ')[1]
      : req.cookies?.token;
  },
};

interface IJWTOptions {
  secret: string;
  getter: keyof typeof tokenGetters;
  unless: RegExp[];
  reqProperty: string;
}

export const useJwt = ({
  secret,
  getter,
  unless,
  reqProperty,
}: IJWTOptions) =>
  jwt({
    secret,
    algorithms: ['HS256'],
    requestProperty: reqProperty ?? 'user',
    getToken: tokenGetters[getter],
  }).unless({ path: unless });
