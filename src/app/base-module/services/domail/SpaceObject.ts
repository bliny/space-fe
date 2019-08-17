export class SpaceObject {
  id: string;
  position: Position;
  name: string;
  texture: string;
  type: SpaceObjectType;
}

export enum SpaceObjectType {
  MOON,
  SHIP,
  PLANET,
  SUN
}

export class Position {
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  x: number;
  y: number;
  z: number;
}
