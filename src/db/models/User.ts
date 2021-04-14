import mongoose from 'mongoose';
import { IUser } from '../types';

export const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    active: {
      type: Boolean,
      default: false,
      required: [true, 'Active is required'],
    },
  },
  { timestamps: true },
);

UserSchema.statics.findByLogin = async function (login: string) {
  let user = await this.findOne({ username: login });
  if (!user) {
    user = await this.findOne({ email: login });
  }
  return user;
};

UserSchema.pre('remove', function (next) {
  this.model('Message').deleteMany({ user: this._id }, {}, next);
});

const User = mongoose.model<IUser & mongoose.Document>(
  'User',
  UserSchema,
);

export default User;
