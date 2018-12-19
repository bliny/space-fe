import { Injectable } from "@angular/core";
import * as THREE from "three";
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ObjectLoaderService {
  base = "./assets/";

  public loadObject(
    mtlName: string,
    objName: string
  ): Observable<THREE.Object3D> {
    return Observable.create(observable => {
      const mtlLoader = new MTLLoader();
      const objLoader = new OBJLoader();
      mtlLoader.setPath(this.base);
      mtlLoader.load(mtlName + ".mtl", materials => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load(this.base + objName + ".obj", object => {
          object.children[0].geometry.center();
          object.children[0].name = objName;
          observable.next(object.children[0]);
          observable.complete();
        });
      });
    });
  }
}
