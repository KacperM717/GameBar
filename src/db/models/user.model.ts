import mongoose from 'mongoose';
import { IUser } from '../../types';

export const UserSchema = new mongoose.Schema(
  {
    name: {
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

UserSchema.pre('save', function () {});

UserSchema.static(
  'findExisting',
  async function (name: string, email: string) {
    return await this.findOne({
      $or: [{ name: name }, { email: email }],
    });
  },
);

const User = mongoose.model<IUser & mongoose.Document>(
  'User',
  UserSchema,
);

export default User;
