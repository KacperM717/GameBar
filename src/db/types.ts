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
  friends: IUser['_id'][];
  blocked: IUser['_id'][];
}
