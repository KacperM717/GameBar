import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction } from 'express';
import jwt from 'express-jwt';
import { JWT_SECRET } from './config';
import logger from './middlewares/logger.middle';

import attachRoutes from './routes';
import { Req, Res } from './types';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Logger for incoming requests
app.use(logger.req);

// JWT has to know the routes?
app.use(
  jwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'user',
    getToken: function fromHeaderOrCookie(req) {
      return req.headers.authorization
        ? req.headers.authorization?.split(' ')[1]
        : req.cookies?.token;
    },
  }).unless({ path: [/\/auth\/*/] }),
);

// Attaching API Routes
attachRoutes(app);

app.get('/', (req: Req, res: Res) => {
  res.send("Dont't stop the party");
});

app.use((_err: Error, req: Req, res: Res, next: NextFunction) => {
  return res.status(500).json({ error: _err.toString() });
});

export default app;
