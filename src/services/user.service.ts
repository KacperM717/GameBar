import User from '../db/models/user.model';
import { IUserService } from '../types';

export const UserService: IUserService = {
  findAllByName: async (name: string) => {
    const users = await User.find({
      name: {
        $regex: new RegExp(`.*${name}.*`, 'i'),
      },
    }).select('_id name email');

    return users;
  },
  findAllWithIds: async (ids: string[]) => {
    return await User.find({ _id: { $in: ids } }).select({
      _id: true,
      name: true,
      email: true,
    });
  },
};
