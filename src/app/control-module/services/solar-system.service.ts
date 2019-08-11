import { Injectable } from "@angular/core";
import { ShipInfo, ShipService } from "./ship-service";
import { PlanetInfo, PlanetService } from "./planet-service";
import { Observable } from "rxjs/internal/Observable";
import { PlanetTexture } from "../../graphics-module/services/planet/planet-texture";
import { SpaceObjectType } from "../domail/SpaceObject";
import { StarInfo, StarService } from "./star.service";

export class SolarSystemInfo {
  planets: Array<PlanetInfo>;
  ships: Array<ShipInfo>;
  stars: Array<StarInfo>;
  background: Background;
}

export class Background {
  size: number;
  texture: string;
}

@Injectable({
  providedIn: "root"
})
export class SolarSystemService {
  constructor(
    private planetService: PlanetService,
    private shipService: ShipService,
    private starService: StarService
  ) {}

  $getSolarSystemInformation(id: string): Observable<SolarSystemInfo> {
    const solarSystemInfo = new SolarSystemInfo();
    const background = new Background();
    background.size = 4500;
    background.texture = "2k_stars_milky_way";

    solarSystemInfo.planets = [
      this.planetService.getPlanetInformation("planet1")
    ];
    solarSystemInfo.stars = [this.starService.getStarInformation("star1")];
    solarSystemInfo.ships = [this.shipService.getShipInformation("ship1")];

    solarSystemInfo.background = background;

    return Observable.create(ob => ob.next(solarSystemInfo));
  }
}
