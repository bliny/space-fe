import { Injectable } from "@angular/core";
import { ObjectLoaderService } from "../object-loader/object-loader.service";
import { ShipInfo } from "../../../base-module/services/ship-service";
import { first, map } from "rxjs/operators";

import {Object3D, Mesh} from "three";

import { Observable } from "rxjs/index";
import { RenderingInfo} from '../../domain/rendering-base';
import {RenderedShip} from './rendering-ship';


@Injectable({
  providedIn: "root"
})
export class ShipFactory {
  constructor(private objectLoader: ObjectLoaderService) {}

  createShip(ship: ShipInfo): Observable<RenderedShip> {
    return this.objectLoader.loadObject(ship.mtlName, ship.objName).pipe(
      map(loadedObject => {
        loadedObject.position.x = ship.position.x;
        loadedObject.scale.set(5, 5, 5);
        loadedObject.name = ship.id;
        const renderedShip = new RenderedShip();
        const renderingInfo = new RenderingInfo();
        renderingInfo.renderingObject = loadedObject;
        renderedShip.objectInfo = ship;
        renderedShip.renderingInfo = renderingInfo;
        return renderedShip;
      })
    );
  }
}
