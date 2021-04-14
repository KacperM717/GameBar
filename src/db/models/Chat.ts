import mongoose from 'mongoose';
import { IChat } from '../types.js';
import { MessageSchema } from './Message';

export const ChatSchema = new mongoose.Schema({
  name: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [MessageSchema],
});

const Chat = mongoose.model<IChat & mongoose.Document>(
  'Chat',
  ChatSchema,
);

export default Chat;
