import { Game } from '../types';
import { DinoGameRoom } from './dino';
import { TyperingoGameRoom } from './typeringo';

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
