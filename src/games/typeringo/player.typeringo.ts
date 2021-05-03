import { SocketData } from '../../types';

export class TyperingoPlayer {
  message: string;
  score: number;
  active: boolean;
  user: Pick<SocketData, '_id' | 'name' | 'avatar'>;
  constructor(user: Pick<SocketData, '_id' | 'name' | 'avatar'>) {
    this.user = user;
    this.message = '';
    this.score = 0;
    this.active = true;
  }
}
