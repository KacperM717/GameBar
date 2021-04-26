import User from '../db/models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HOST, JWT_SECRET, PORT, SALT } from '../config';
import { AuthDTO, IAuthService, UserDTO } from '../types';
import emailer from './mail.service';
import { FriendService } from './friend.service';

// Static service - no need to implement as a class?
export const AuthService: IAuthService = {
  SignUp: async ({ name, email, password }) => {
    const existingUser = await User.findOne({
      $or: [{ name: name }, { email: email }],
    });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const activationJWT = await jwt.sign(email, JWT_SECRET);
    const authLink = `${HOST}:${PORT}/auth/activate/${activationJWT}`;

    const emailInfo = await emailer.sendVerification({
      recipients: [email],
      authLink,
    });

    if (!emailInfo)
      throw new Error(
        'Email service failed to send confirmation email',
      );

    const hashedPassword = await bcrypt.hash(password, SALT);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new Error('DB failed creating user. Please try again');
    }

    const friendlist = await FriendService.createFriendList(user);

    if (!friendlist) {
      await user.delete();
      throw new Error('DB failed creating user. Please try again');
    }

    friendlist.updateOne({
      $push: { friends: { id: user._id, role: 'friend' } },
    });

    return user as UserDTO;
  },

  LogIn: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error('User not found');

    if (!user.active)
      throw new Error('User not activated. Please check your inbox');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Password is incorrect');

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      token: jwt.sign({ email, _id: user._id }, JWT_SECRET, {
        expiresIn: '1d', // A Day
      }),
    } as AuthDTO;
  },

  Activate: async (token) => {
    const email = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ email: email });

    if (!user) throw new Error('Activation failed!');

    user.active = true;

    await user.save();
  },

  Update: async (token) => {
    const { _id } = jwt.verify(token, JWT_SECRET) as {
      email: string;
      _id: string;
    };
    const user = await User.findById(_id);
    if (!user) throw new Error('User not found');
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      token: jwt.sign({ email: user.email, _id }, JWT_SECRET, {
        expiresIn: '1d',
      }),
    } as AuthDTO;
  },
  LogOut: async () => {
    throw new Error('Not implemented... But should even be?');
  },
};
