import mongoose from 'mongoose';
import { IMessage } from '../../types';

export const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Message = mongoose.model<IMessage & mongoose.Document>(
  'Message',
  MessageSchema,
);

export default Message;
