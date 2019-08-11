import { Injectable, OnInit } from "@angular/core";
import { TextureLoader } from "../texture/texture-loader.service";
import { Observable } from "rxjs/internal/Observable";
import * as THREE from "three";
import { Background } from "../../../control-module/services/solar-system.service";

@Injectable({
  providedIn: "root"
})
export class BackgroundService implements OnInit {
  base = "background/";

  constructor(private textureLoader: TextureLoader) {}

  ngOnInit(): void {}

  createSpaceBackground(background: Background) {
    return Observable.create(observ => {
      this.textureLoader
        .loadTexture(this.base + background.texture + ".jpg")
        .subscribe(texture => {
          const backgroundGeometry = new THREE.SphereBufferGeometry(
            background.size,
            40,
            40
          );
          const backgroundMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            emissiveMap: texture,
            emissiveIntensity: 1.3,
            emissive: new THREE.Color("white"),
            side: THREE.BackSide
            // specularMap: texture.clone(),
            // shininess: 30,
            // specular: new THREE.Color("white")
          });

          const backgroundMesh = new THREE.Mesh(
            backgroundGeometry,
            backgroundMaterial
          );
          backgroundMesh.name = "background";

          // backgroundMesh.position.y = 440;
          observ.next(backgroundMesh);
          observ.complete();
        });
    });
  }
}
