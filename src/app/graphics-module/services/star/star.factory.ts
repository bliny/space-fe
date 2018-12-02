import { createPlatform, Injectable } from "@angular/core";
import * as THREE from "three";
import { TextureLoader } from "../texture/texture-loader.service";
import { PlanetFactory } from "../planet/planet.factory";
import { PlanetTexture } from "../planet/planet-texture";

export class Star {
  object: THREE.Mesh;
  light: THREE.PointLight;
  ambientLight: THREE.AmbientLight;

  constructor(object: THREE.Mesh, light: THREE.PointLight, ambientLight: THREE.AmbientLight) {
    this.object = object;
    this.light = light;
    this.ambientLight = ambientLight;
  }
}

@Injectable({
  providedIn: "root"
})
export class StarFactory {
  segments = 32;
  rings = 32;

  base = "planets/";
  baseTexture = "/base.jpg";
  bumpTexture = "/bump.jpg";
  atmoTexture = "/atmo.png";
  specularTexture = "/specular.jpg";

  constructor(
    private textureLoader: TextureLoader,
    private planetFactory: PlanetFactory
  ) {}

  createStar(): Star {
    const shadowLight: any = new THREE.PointLight(0xffffff, 2, 800);
    shadowLight.position.set(40, 40, 300);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 50;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;


    const ambientLight = new THREE.AmbientLight(0x2c3e50);

    const geometrySun = new THREE.SphereBufferGeometry(1, 16, 16);
    const sunMaterial = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      color: 0xf20000,
      alphaTest: 0,
      transparent: true,
      fog: false
    });

    const lightSphere = new THREE.Mesh(geometrySun, sunMaterial);

    return new Star(lightSphere, shadowLight, ambientLight);
  }
}
