import mongoose from 'mongoose';
import { IFriends } from '../../types';

export const FriendsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  friends: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: String,
    },
  ],
});

const Friends = mongoose.model<IFriends & mongoose.Document>(
  'Friend',
  FriendsSchema,
);

export default Friends;
