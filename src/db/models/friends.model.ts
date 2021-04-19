import mongoose from 'mongoose';
import { IFriends } from '../../types';

export const FriendsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pending: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Friends = mongoose.model<IFriends & mongoose.Document>(
  'Friend',
  FriendsSchema,
);

export default Friends;
