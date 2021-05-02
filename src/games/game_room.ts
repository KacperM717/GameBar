import { Server } from 'socket.io';
import { GameSocket } from '.';
import { UserSocket } from '../types';

export abstract class GameRoom {
  id: string;
  players: UserSocket[];
  abstract state: any;
  constructor(id: string, players: UserSocket[], io: Server) {
    this.id = id;
    this.players = players;
  }

  abstract playerReady(id: string): void;
  abstract playerLeave(id: string): void;
  abstract tick(time: number): void;
  abstract close(): void;
  abstract init(): void;
}

export type UserQueueType =
  | { state: 'looking'; socket: GameSocket }
  | { state: 'playing'; socket: GameSocket }
  | { state: 'passerby'; socket: GameSocket };
export type GameRoomType = {
  id: string;
  players: GameSocket[];
  state: any;
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
