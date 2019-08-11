import { Injectable } from "@angular/core";
import { PlanetTexture } from "../../graphics-module/services/planet/planet-texture";
import { Position, SpaceObject, SpaceObjectType } from "../domail/SpaceObject";

export class StarInfo extends SpaceObject {
  size: number;
}

@Injectable({
  providedIn: "root"
})
export class StarService {
  planets = new Map<string, StarInfo>();

  constructor() {
    const star1: StarInfo = new StarInfo();

    star1.id = "star1";
    star1.position = new Position(40, 40, 300);
    star1.size = 150;
    star1.texture = "stars/sun/base.jpg";
    star1.name = "sun";
    star1.type = SpaceObjectType.SUN;

    this.planets.set("star1", star1);
  }

  getStarInformation(id: string): StarInfo {
    return this.planets.get(id);
  }
}
