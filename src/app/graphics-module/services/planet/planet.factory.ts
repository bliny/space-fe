import { createPlatform, Injectable } from "@angular/core";
import * as THREE from "three";
import { PlanetTexture } from "./planet-texture";
import { TextureLoader } from "../texture/texture-loader.service";
import { Observable } from "rxjs/internal/Observable";
import { forkJoin } from "rxjs/internal/observable/forkJoin";
import { map } from "rxjs/operators";
import { Planet } from "../../rendering/solar-system-rendering/resolver/solar-system-resource-resolver";

class TexturesForPlanets {
  base;
  bump;
  spec;
  atmo;
  moon;

  constructor(base, bump, spec, atmo, moon) {
    this.base = base;
    this.bump = bump;
    this.spec = spec;
    this.atmo = atmo;
    this.moon = moon;
  }
}

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

  createPlanet(planetInfo: Planet): Observable<THREE.Mesh> {
    const planetTexturePath = this.base + planetInfo.texture;
    return forkJoin([
      this.textureLoader.loadTexture(planetTexturePath + this.baseTexture),
      this.textureLoader.loadTexture(planetTexturePath + this.bumpTexture),
      this.textureLoader.loadTexture(planetTexturePath + this.specularTexture),
      this.textureLoader.loadTexture(planetTexturePath + this.atmoTexture),
      this.textureLoader.loadTexture(
        this.base + planetInfo.moon.texture + this.baseTexture
      )
    ]).pipe(
      map(([base, bump, spec, atmo, moon]) => {
        const loadedTextures = new TexturesForPlanets(
          base,
          bump,
          spec,
          atmo,
          moon
        );
        return this.createPlanetWithLoadedTextures(loadedTextures, planetInfo);
      })
    );
  }

  private createPlanetWithLoadedTextures(
    loadedTextures: TexturesForPlanets,
    planetInfo: Planet
  ): THREE.Mesh {
    const planetMaterial = new THREE.MeshPhongMaterial({
      map: loadedTextures.base,
      bumpMap: loadedTextures.bump,
      bumpScale: 0.8,
      specularMap: loadedTextures.spec,
      shininess: 5,
      specular: new THREE.Color("grey")
    });

    const planet = new THREE.Mesh(
      new THREE.SphereBufferGeometry(
        planetInfo.size,
        this.segments,
        this.rings
      ),
      planetMaterial
    );
    const cloudMesh = this.createCloudLayer(planetInfo, loadedTextures);
    if (planetInfo.moon) {
      planet.add(this.createMoon(planetInfo, loadedTextures.moon));
    }
    planet.add(cloudMesh);
    planet.position.x = planetInfo.position.x;
    planet.position.y = planetInfo.position.y;
    planet.position.z = planetInfo.position.z;

    planet.name = name;

    return planet;
  }

  private createCloudLayer(
    planetInfo: Planet,
    loadedTextures: TexturesForPlanets
  ) {
    const cloudGeometry = new THREE.SphereBufferGeometry(
      planetInfo.size + planetInfo.size * 0.02,
      this.segments,
      this.rings
    );
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: loadedTextures.atmo,
      // side: THREE.DoubleSide,
      opacity: 0.8,
      transparent: true
    });

    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    return cloudMesh;
  }

  private createMoon(planetInfo: Planet, moonTexture) {
    const moonPivot = new THREE.Object3D();
    const moonGeometry = new THREE.SphereBufferGeometry(
      planetInfo.moon.size,
      this.segments,
      this.rings
    );
    const moonMaterial = new THREE.MeshPhongMaterial({
      map: moonTexture
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    moon.position.x = planetInfo.size + planetInfo.moon.size * 6;
    moon.position.y = planetInfo.position.y;
    moon.position.z = planetInfo.position.z;
    moon.name = "moon";
    moon.castSha;
    moonPivot.add(moon);
    return moonPivot;
  }
}
