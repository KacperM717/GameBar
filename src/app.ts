import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction } from 'express';
import { JWT_SECRET } from './config';
import { useJwt } from './middlewares/jwt.middle';
import logger from './middlewares/logger.middle';
import attachRoutes from './routes';
import { Req, Res } from './types';
import { models } from './db/index';

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(
  useJwt({
    secret: JWT_SECRET,
    getter: 'fromHeaderOrCookie',
    unless: [/\/auth\/*/],
    reqProperty: 'user',
  }),
);

// Logger for incoming requests
app.use(logger.req);

// Attaching API Routes
attachRoutes(app);

app.get('/', (req: Req, res: Res) => {
  res.send("Dont't stop the party");
});
app.get('/users', async (req: Req, res: Res, next: NextFunction) => {
  const name = req.query.name as string;
  if (!name) return next(new Error('Name is empty'));
  const matchedUsers = await models.User.find({
    name: { $regex: new RegExp(`.*${name.toLowerCase()}.*`, 'i') },
  }).select('_id name');
  res.json({
    message: `Found ${matchedUsers.length} users`,
    body: { users: matchedUsers },
  });
});

app.use((_err: Error, req: Req, res: Res, next: NextFunction) => {
  return res.status(500).json({ error: _err.toString() });
});

export default app;
