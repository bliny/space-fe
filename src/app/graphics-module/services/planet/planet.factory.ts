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
  bumpTexture = "/bump.png";
  atmoTexture = "/atmo.png";
  specularTexture = "/specular.png";

  constructor(private textureLoader: TextureLoader) {}

  createPlanet(
    texture: PlanetTexture,
    planetSize: number,
    position: THREE.Vector3,
    name: string
  ): THREE.Mesh {
    const planetTexturePath = this.base + texture;

    const planetMaterial = new THREE.MeshPhongMaterial({
      bumpScale: 0.2,
      shininess: 5,
      specular: new THREE.Color("grey")
    });

    this.textureLoader
      .loadTexture(planetTexturePath + this.baseTexture)
      .subscribe(x => (planetMaterial.map = x));
    this.textureLoader
      .loadTexture(planetTexturePath + this.bumpTexture)
      .subscribe(x => (planetMaterial.bumpMap = x));
    this.textureLoader
      .loadTexture(planetTexturePath + this.specularTexture)
      .subscribe(x => (planetMaterial.specularMap = x));

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(planetSize, this.segments, this.rings),
      planetMaterial
    );

    planet.name = name;

    const cloudMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      opacity: 0.8,
      transparent: true,
      depthWrite: false
    });

    const cloudMesh = new THREE.Mesh(
      new THREE.SphereGeometry(
        planetSize + planetSize * 0.02,
        this.segments,
        this.rings
      ),
      cloudMaterial
    );

    this.textureLoader
      .loadTexture(planetTexturePath + this.atmoTexture)
      .subscribe(x => (cloudMaterial.map = x));

    planet.add(cloudMesh);

    planet.position.x = position.x;
    planet.position.y = position.y;
    planet.position.z = position.z;

    return planet;
  }
}
