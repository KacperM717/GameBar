import { Server } from 'socket.io';
import { GameSocket } from '.';
import { UserSocket } from '../types';

export interface IGameRoom {
  id: string;
  players: UserSocket[];
  state: any;
  io: Server;

  playerReady(id: string): void;
  playerLeave(id: string): void;
  tick(time?: number): void;
  close(): void;
  init(): void;
}

export type UserQueueType =
  | { state: 'looking'; socket: GameSocket }
  | { state: 'playing'; socket: GameSocket }
  | { state: 'passerby'; socket: GameSocket };
export type GameRoomType = {
  id: string;
  players: GameSocket[];
  state: any;
  io: Server;
  tick: (time: number) => void;
  close: () => void;
  playerReady: (id: string) => void;
  playerLeave: (id: string) => void;
  init: () => void;
};
export type Game = {
  id: string;
  queue: UserQueueType[];
  rules: { playersPerRoom: number };
  rooms: { [key: string]: GameRoomType };
  RoomMaker: any;
};
