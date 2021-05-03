import { UserSocket } from '../types';
import { DinoGameRoom } from './dino';
import { Game, IGameRoom } from './game_room';
import { TyperingoGameRoom } from './typeringo';

export type GameSocket = UserSocket & { gameRoom?: IGameRoom };

export const games: { [key: string]: Game } = {
  dino: {
    id: 'dino',
    queue: [],
    rules: {
      playersPerRoom: 2,
    },
    RoomMaker: DinoGameRoom,
    rooms: {},
  },
  typeringo: {
    id: 'typeringo',
    queue: [],
    rules: {
      playersPerRoom: 2,
    },
    RoomMaker: TyperingoGameRoom,
    rooms: {},
  },
};
