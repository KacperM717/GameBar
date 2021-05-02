import { Vec2D } from '../utils';

export class DinoObstacle {
  size: Vec2D;
  pos: Vec2D;
  vel: Vec2D;
  crazy: boolean;
  constructor(size: Vec2D, pos: Vec2D, vel: Vec2D, crazy: boolean) {
    this.size = size;
    this.pos = pos;
    this.vel = vel;
    this.crazy = crazy;
  }

  update(dt: number) {
    if (this.crazy)
      this.vel.v[1] *= Math.round(Math.random() * 2) - 1;
    this.pos.add(this.vel);
  }
}
