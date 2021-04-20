import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Express Types
export interface Req extends Request {
  user?: { _id?: string; email?: string };
}
export interface Res extends Response {}
export interface Err extends Error {
  status: number;
}

// Mongoose Types
export interface ITimestamp {
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends ITimestamp {
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

export interface UserDoc extends IUser, mongoose.Document {}

export interface IMessage extends ITimestamp {
  text: string;
  author: string;
  reactions?: any;
}

export interface MessageDoc extends IMessage, mongoose.Document {}

export interface IChat {
  name: string;
  members: UserDoc['_id'][];
  messages: MessageDoc[];
}

export interface ChatDoc extends IChat, mongoose.Document {}

export interface IFriends {
  pending: UserDoc['_id'][];
  friends: UserDoc['_id'][];
  blocked: UserDoc['_id'][];
}

export interface FriendsDoc extends IFriends, mongoose.Document {}

// Email Types
export interface IEmailData {
  sender?: string;
  recipients: string[];
}

export interface IAuthEmailData extends IEmailData {
  authLink: string;
}

// export interface IUserSession {
//   _id: string;
//   exp?: number;
// }

// Client
export interface IUserSignUp {
  name: string;
  email: string;
  password: string;
}
export interface IUserLogIn {
  email: string;
  password: string;
}

// DTOs
export type UserDTO = Pick<UserDoc, '_id' | 'email' | 'name'>;
export type TokenDTO = {
  _id: string;
  token: string;
};

// Services
export interface IAuthService {
  SignUp: (data: IUserSignUp) => Promise<UserDTO>;
  LogIn: (data: IUserLogIn) => Promise<TokenDTO>;
  LogOut: () => void;
  Activate: (token: string) => void;
}

export interface IFriendService {
  SendRequest: (userId: string, targetId: string) => void;
  AcceptRequest: (userId: string, targetId: string) => void;
  Block: (userId: string, targetId: string) => void;
  RemoveFriend: (userId: string, targetId: string) => void;
  createFriendList: (user: UserDoc) => Promise<FriendsDoc>;
  getFriendList: (userId: string) => Promise<FriendsDoc>;
}

// Controllers
export interface IFriendController {
  friendService: IFriendService;
  postAdd: any;
  postAccept: any;
  postBlock: any;
  postRemove: any;
  getFriendList: any;
}
