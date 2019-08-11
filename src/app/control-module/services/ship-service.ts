import { Injectable } from "@angular/core";
import { ControlModule } from "../control.module";
import { Position, SpaceObject } from "../domail/SpaceObject";
import { PlanetInfo } from "./planet-service";

export class ShipInfo extends SpaceObject {
  speed: number;
  mtlName: string;
  objName: string;
}

@Injectable({
  providedIn: "root"
})
export class ShipService {
  ships = new Map<string, ShipInfo>();

  constructor() {}

  getShipInformation(id: string): ShipInfo {
    const testShip = new ShipInfo();
    testShip.id = "ship1";
    testShip.name = "csodaship";
    testShip.speed = 100;
    testShip.mtlName = "Sample_Ship";
    testShip.objName = "Sample_Ship";
    testShip.position = new Position(500, 0, 0);
    return testShip;
  }
}
