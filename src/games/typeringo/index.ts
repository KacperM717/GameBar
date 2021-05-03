import { Server } from 'socket.io';
import { GameSocket } from '..';
import { IGameRoom } from '../game_room';
import { TyperingoPlayer } from './player.typeringo';

export class TyperingoGameRoom implements IGameRoom {
  id: string;
  players: GameSocket[];
  io: Server;
  timer: number;
  readies: Set<string>;
  winner: boolean;
  state: {
    message: string;
    players: TyperingoPlayer[];
  };

  alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  messageMin = 3;
  messageMax = 10 - this.messageMin;

  constructor(id: string, players: GameSocket[], io: Server) {
    this.id = id;
    this.players = players;
    this.io = io;
    this.timer = Date.now();
    this.readies = new Set();
    this.winner = false;
    this.state = {
      players: players.map((socket) => {
        const userData = {
          _id: socket.user!._id,
          name: socket.user!.name,
          avatar: socket.user!.avatar,
        };
        const player = new TyperingoPlayer(userData);
        socket.on('game:typeringo:message', (message: string) => {
          if (this.winner) return;
          player.message = message;
          if (message === this.state.message) {
            this.winner = true;
            player.score += this.state.message.length * 50;
            io.to(this.id).emit(
              'game:typeringo:winner',
              player.user,
              Date.now() - this.timer,
            );

            // Here init next turn
            setTimeout(() => this.tick(), 2000);
          }
          socket
            .to(this.id)
            .emit(
              'game:typeringo:user_message',
              player.user._id,
              message,
            );
        });
        return player;
      }),
      message: '',
    };
  }

  tick() {
    this.winner = false;
    const l = Math.random() * this.messageMax + this.messageMin;
    const alphabetLength = this.alphabet.length;
    let message = '';
    for (let i = 0; i < l; i++) {
      message += this.alphabet[
        Math.floor(Math.random() * alphabetLength)
      ];
    }
    this.state.message = message;
    for (const player of this.state.players) {
      player.message = '';
    }
    this.io.to(this.id).emit('game:typeringo:tick', this.state);
    this.timer = Date.now();
  }

  playerReady(id: string) {
    if (this.readies.has(id)) return;
    this.readies.add(id);
    if (this.readies.size === this.players.length) this.init();
  }

  playerLeave(id: string) {
    if (!this.readies.has(id)) return;
    this.readies.delete(id);
    if (this.readies.size === this.players.length) {
      this.close();
    }
  }

  init() {
    this.tick();
  }

  close() {
    for (const player of this.players) {
      player.emit('game:typeringo:end', this.id);
      player.removeAllListeners('game:typeringo:message');
    }
  }
}
