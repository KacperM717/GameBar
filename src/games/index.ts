import { UserSocket } from '../types';
import { DinoGameRoom } from './dino';
import { Game, GameRoom } from './game_room';

export type GameSocket = UserSocket & { gameRoom?: GameRoom };

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
};
