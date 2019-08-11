import { Injectable } from "@angular/core";
import { ObjectLoaderService } from "../object-loader/object-loader.service";
import { ShipInfo } from "../../../control-module/services/ship-service";
import { first, map } from "rxjs/operators";

import * as THREE from "three";
import { Observable } from "rxjs/index";

@Injectable({
  providedIn: "root"
})
export class ShipFactory {
  constructor(private objectLoader: ObjectLoaderService) {}

  createShip(ship: ShipInfo): Observable<THREE.Object3D> {
    return this.objectLoader.loadObject(ship.mtlName, ship.objName).pipe(
      map(loadedObject => {
        loadedObject.position.x = ship.position.x;
        loadedObject.scale.set(5, 5, 5);
        return loadedObject;
      })
    );
  }
}
