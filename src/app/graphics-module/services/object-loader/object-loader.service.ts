import { Injectable } from "@angular/core";
import * as THREE from "three";
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";

@Injectable()
export class ObjectLoaderService {
  public loadObject() {
    const mtlLoader = new MTLLoader();

    const objLoader = new OBJLoader();

    mtlLoader.setPath("./assets/");
    mtlLoader.load("Sample_Ship.mtl", materials => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load(
        "./assets/Sample_Ship.obj",
        object => {
          object.position.z = -10;
          object.position.y = 1;
          return new Promise(object);
        },
        error => {
          Promise.reject(error);
        }
      );
    });
  }
}
