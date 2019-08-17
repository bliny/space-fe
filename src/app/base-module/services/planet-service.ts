import { Injectable } from "@angular/core";
import { ControlModule } from "../../control-module/control.module";
import { Position, SpaceObject, SpaceObjectType } from "./domail/SpaceObject";
import { PlanetTexture } from "../../graphics-module/services/planet/planet-texture";

export class PlanetInfo extends SpaceObject {
  size: number;
  moon: PlanetInfo;
}

@Injectable({
  providedIn: "root"
})
export class PlanetService {
  planets = new Map<string, PlanetInfo>();

  constructor() {
    const planet1: PlanetInfo = new PlanetInfo();
    planet1.id = "planet1";
    planet1.position = new Position(550, 0, 0);
    planet1.size = 30;
    planet1.texture = PlanetTexture.EARTH;
    planet1.name = "earth";
    planet1.type = SpaceObjectType.PLANET;

    const moon = new PlanetInfo();
    moon.size = 4;
    moon.texture = PlanetTexture.MOON;
    moon.name = "moon";
    moon.type = SpaceObjectType.MOON;
    planet1.moon = moon;

    this.planets.set("planet1", planet1);
  }

  getPlanetInformation(id: string): PlanetInfo {
    return this.planets.get(id);
  }
}
