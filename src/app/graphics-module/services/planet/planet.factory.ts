import { createPlatform, Injectable } from "@angular/core";
import * as THREE from "three";
import { PlanetTexture } from "./planet-texture";
import { TextureLoader } from "../texture/texture-loader.service";

@Injectable({
  providedIn: "root"
})
export class PlanetFactory {
  segments = 32;
  rings = 32;

  base = "planets/";
  baseTexture = "/base.jpg";
  bumpTexture = "/bump.jpg";
  atmoTexture = "/atmo.png";
  specularTexture = "/specular.jpg";

  constructor(private textureLoader: TextureLoader) {}

  createPlanet(
    texture: PlanetTexture,
    planetSize: number,
    position: THREE.Vector3,
    name: string
  ): THREE.Mesh {
    const planetTexturePath = this.base + texture;

    const planetMaterial = new THREE.MeshPhongMaterial({
      map: this.textureLoader.loadTexture(planetTexturePath + this.baseTexture),
      bumpMap: this.textureLoader.loadTexture(
        planetTexturePath + this.bumpTexture
      ),
      bumpScale: 0.3,
      specularMap: this.textureLoader.loadTexture(
        planetTexturePath + this.specularTexture
      ),
      shininess: 5,
      specular: new THREE.Color("grey")
    });

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(planetSize, this.segments, this.rings),
      planetMaterial
    );

    planet.name = name;

    /*const cloudMesh = new THREE.Mesh(
      new THREE.SphereGeometry(planetSize, this.segments, this.rings),
      new THREE.MeshPhongMaterial({
        map: this.textureLoader.loadTexture('ny.jpg'),
        // side: THREE.DoubleSide,
        //opacity: 0.5,
        //transparent: true,
        //depthWrite: false
      }));
*/
    //planet.add(cloudMesh);

    planet.position.x = position.x;
    planet.position.y = position.y;
    planet.position.z = position.z;

    return planet;
  }
}
