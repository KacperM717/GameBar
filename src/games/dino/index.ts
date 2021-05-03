import { Server } from 'socket.io';
import { rectRectCollision, Vec2D } from '../utils';
import { performance } from 'perf_hooks';
import { DinoPlayer } from './player.dino';
import { DinoObstacle } from './obstacle.dino';
import { DinoWorld } from './world.dino';
import { GameRoomType, GameSocket, IGameRoom } from '../../types';

export class DinoGameRoom implements GameRoomType, IGameRoom {
  state: {
    world: {
      size: Vec2D;
    };
    players: DinoPlayer[];
    obstacles: DinoObstacle[];
  };

  loopInterval: any;
  time: number;
  obstacleTicks = 0;
  readies = new Set();
  id: string;
  players: GameSocket[];
  io: any;
  constructor(id: string, players: GameSocket[], io: Server) {
    this.id = id;
    this.players = players;
    this.io = io;
    this.time = performance.now();
    this.state = {
      world: new DinoWorld(new Vec2D(300, 100)),
      // Map sockets to their player state
      players: players.map((socket) => {
        const player = new DinoPlayer({
          _id: socket.user!._id,
          name: socket.user!.name,
          avatar: socket.user!.avatar,
        });
        socket.on('game:dino:jump', () =>
          player.jump(this.state.world.size),
        );
        return player;
      }),
      obstacles: [],
    };
  }

  // Every game tick is done here and send to players
  tick(time: number) {
    let counter = 0;
    const dt = time - this.time;
    if (this.obstacleTicks === 0 || Math.random() < 0.02)
      this.state.obstacles.push(
        new DinoObstacle(
          new Vec2D(10, 10),
          new Vec2D(290, 90),
          new Vec2D(-5, 0),
          false,
        ),
      );

    for (let i = 0; i < this.state.obstacles.length; i++) {
      const obstacle = this.state.obstacles[i];
      obstacle.update(dt);
      if (obstacle.pos.v[0] <= 0) this.state.obstacles.shift();
    }

    for (let i = 0; i < this.state.players.length; i++) {
      const player = this.state.players[i];
      if (player.end) continue;
      player.update(dt, this.state.world.size);
      this.state.obstacles.forEach((obstacle) => {
        if (this.state.obstacles.length > 0) {
          if (rectRectCollision(player, obstacle)) {
            player.end = true;
          }
        }
      });

      player.score += 5;
      counter++;
    }

    this.players.forEach((player) =>
      player.emit('game:state_update', this.state),
    );

    // None of players are still in game
    if (counter === 0) return this.close();

    this.obstacleTicks = (this.obstacleTicks + 1) % 100;
    this.time = time;
  }

  playerReady(id: string) {
    if (this.readies.has(id)) return;
    this.readies.add(id);
    if (this.readies.size === this.players.length) this.init();
  }

  // Set up players and send them their state
  init() {
    this.time = performance.now();
    this.loopInterval = setInterval(
      () => this.tick(performance.now()),
      40,
    );
  }

  playerLeave(id: string) {
    this.readies.delete(id);
    if (this.readies.size === 0) this.close();
  }

  close() {
    clearInterval(this.loopInterval);
    this.players.forEach((socket) => {
      socket.removeAllListeners('game:dino_jump');
    });
  }
}
