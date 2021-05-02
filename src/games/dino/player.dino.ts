import { SocketData } from '../../types';
import { Vec2D } from '../utils';

export class DinoPlayer {
  G = 0.015;
  user: Pick<SocketData, '_id' | 'name' | 'avatar'>;
  size: Vec2D;
  pos: Vec2D;
  vel: Vec2D;
  acc: Vec2D;
  score: number;
  end: boolean;
  ready: boolean;
  constructor(user: Pick<SocketData, '_id' | 'name' | 'avatar'>) {
    this.user = user;
    this.size = new Vec2D(30, 30);
    this.pos = new Vec2D(30, 5);
    this.vel = new Vec2D(0, 0);
    this.acc = new Vec2D(0, 0);
    this.score = 0;
    this.end = false;
    this.ready = false;
  }

  jump(world: Vec2D) {
    if (this.pos.v[1] + this.size.v[1] >= world.v[1] - 5) {
      this.vel.add(new Vec2D(0, -10));
    }
  }

  crouch() {}

  update(dt: number, world: Vec2D) {
    const gravity = new Vec2D(0, this.G * dt);
    this.acc = new Vec2D(0, 0);
    this.acc.add(gravity);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (this.pos.v[1] + this.size.v[1] >= world.v[1]) {
      if (this.vel.v[1] > 0) this.vel.v[1] = 0;
      this.pos.v[1] = world.v[1] - this.size.v[1];
    }
  }
}
