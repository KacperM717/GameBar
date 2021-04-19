import { Request, Response } from 'express';

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
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
}

export interface IMessage extends ITimestamp {
  _id: string;
  text: string;
  author: string;
  reactions?: any;
}

export interface IChat {
  _id: string;
  name: string;
  members: IUser['_id'][];
  messages: IMessage[];
}

export interface IFriends {
  _id: string;
  pending: IUser['_id'][];
  friends: IUser['_id'][];
  blocked: IUser['_id'][];
}

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
export type UserDTO = Pick<IUser, '_id' | 'email' | 'name'>;
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
