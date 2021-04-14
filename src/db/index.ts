import { Db } from 'mongodb';
import mongoose from 'mongoose';
import { DB_URI } from '../util/secrets';
import Chat from './models/Chat';
import Friends from './models/Friends';
import Message from './models/Message';
import User from './models/User';

export const models = {
  User,
  Friends,
  Message,
  Chat,
};

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  return connection.connection.db;
};
