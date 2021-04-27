import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Socket } from 'socket.io';

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
}

export interface MessageDoc extends IMessage, mongoose.Document {}

export interface IChat {
  name: string;
  members: UserDoc['_id'][];
  messages: MessageDoc[];
  closed: boolean;
}

export interface ChatDoc extends IChat, mongoose.Document {}

export type FriendRoles = 'pending' | 'friend' | 'blocked';
export type Friend = { id: UserDoc['_id']; role: FriendRoles };
export interface IFriends {
  friends: Friend[];
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
export type MessageDTO = Partial<MessageDoc>;
export type UserDTO = Pick<UserDoc, '_id' | 'name'>;
export type TokenDTO = {
  _id: string;
  token: string;
};
export type AuthDTO = UserDTO & TokenDTO;
export type FriendDTO = {
  _id: string;
  name: string;
  role: FriendRoles;
};
export type ChatDTO = {
  _id: string;
  members: UserDTO[];
  messages: MessageDTO[];
  name: string;
  closed: boolean;
};

// Services
export interface IAuthService {
  SignUp: (data: IUserSignUp) => Promise<UserDTO>;
  LogIn: (data: IUserLogIn) => Promise<AuthDTO>;
  LogOut: () => void;
  Activate: (token: string) => void;
  Update: (token: string) => Promise<AuthDTO>;
}

export interface IFriendService {
  SendRequest: (
    userId: string,
    targetId: string,
  ) => Promise<FriendDTO>;
  AcceptRequest: (
    userId: string,
    targetId: string,
  ) => Promise<FriendDTO[]>;
  Block: (userId: string, targetId: string) => Promise<FriendDTO>;
  RemoveFriend: (userId: string, targetId: string) => void;
  createFriendList: (user: UserDoc) => Promise<FriendsDoc>;
  getFriendList: (userId: string) => Promise<FriendDTO[]>;
}

export interface IUserService {
  findAllByName: (name: string) => Promise<UserDTO[]>;
  findAllWithIds: (ids: string[]) => Promise<UserDTO[]>;
}

export interface IChatService {
  createChat: (
    members: string[],
    name: string,
    closed: boolean,
  ) => Promise<ChatDoc>;
  deleteChat: (chatId: string) => void;
  getUserChats: (userId: string) => Promise<ChatDTO[]>;
  addUserToChat: (chatId: string, userId: string) => void;
  leaveChat: (chatId: string, userId: string) => void;
  getChat: (chatId: string) => Promise<ChatDTO>;
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

export interface IUserController {
  userService: IUserService;
  getAllByName: any;
  postAllWithIds: any;
}

// Socket Types
export type SocketData = {
  name: string;
  token: string;
  _id: string;
  chats: ChatDTO[];
  friends: FriendDTO[];
};

export interface UserSocket extends Socket {
  user?: SocketData;
}

export type WSRes<B> = {
  ok: boolean;
  msg: string;
  body?: B;
};

// Global Emitter
export type ChatEventName =
  | 'CHAT_CREATED'
  | 'CHAT_USER_ADDED'
  | 'CHAT_USER_LEFT';
export type FriendEventName =
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPTED'
  | 'FRIEND_BLOCKED'
  | 'FRIEND_REMOVED';
export type GlobalEventName = ChatEventName & FriendEventName;
