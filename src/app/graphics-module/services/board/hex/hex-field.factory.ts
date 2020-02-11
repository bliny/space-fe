import {Injectable} from '@angular/core';
import {HexTile} from './hex-tile';
import * as THREE from "three-full";
/**
 * Created by FaNaT-Laptop on 2020. 02. 11..
 */


@Injectable({
  providedIn: "root"
})
export class HexFieldFactory {

  constructor() {
  }

  generateHexField(startPosition: THREE.Vector3, tileSize: number, mapSize: number): any[] {
    const objectsToAddToScene = [];
    let {x, y, z} = startPosition;
    z = z + 0;
    for (let j = 0; j < mapSize; j++) {

      for (let i = 0; i < mapSize; i++) {
        const center = new THREE.Vector3(x, y, z);
        const hexField = new HexTile(center, tileSize, j + "-" + i);

        objectsToAddToScene.push(hexField.hexMesh);
        objectsToAddToScene.push(hexField.wireframe);
        x += (tileSize * 1.732);
      }
      y += tileSize * 1.5;
      if (j % 2 === 0) {
        x = -1 * (tileSize * 0.866)
      } else {
        x = 0;
      }
    }
    return objectsToAddToScene;
  }

}
