import { Db } from 'mongodb';
import mongoose from 'mongoose';
import { DB_URI } from '../config';
import Chat from './models/chat.model';
import Friends from './models/friends.model';
import Message from './models/message.model';
import User from './models/user.model';

export const models = {
  User,
  Friends,
  Message,
  Chat,
};

export const connectDB = async (): Promise<Db> => {
  const connection = await mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  return connection.connection.db;
};
