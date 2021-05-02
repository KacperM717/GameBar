export class Vec2D {
  v: number[];
  constructor(x: number, y: number) {
    this.v = [x, y];
  }

  add(vec: Vec2D) {
    this.v[0] += vec.v[0];
    this.v[1] += vec.v[1];
  }

  mult(vec: Vec2D) {
    this.v[0] *= vec.v[0];
    this.v[1] *= vec.v[1];
  }

  multByVal(val: number) {
    this.v[0] *= val;
    this.v[1] *= val;
  }
}

export type Rect = {
  pos: Vec2D;
  size: Vec2D;
};

export function rectRectCollision(r1: Rect, r2: Rect) {
  return (
    r1.pos.v[0] < r2.pos.v[0] + r2.size.v[0] &&
    r1.pos.v[0] + r1.size.v[0] > r2.pos.v[0] &&
    r1.pos.v[1] < r2.pos.v[1] + r2.size.v[1] &&
    r1.pos.v[1] + r1.size.v[1] > r2.pos.v[1]
  );
}
