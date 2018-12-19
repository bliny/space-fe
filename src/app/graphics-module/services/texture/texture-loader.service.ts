import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Observable } from "rxjs/internal/Observable";
import { observable } from "rxjs/internal-compatibility";
import { forkJoin } from "rxjs/internal/observable/forkJoin";
@Injectable({
  providedIn: "root"
})
export class TextureLoader {
  base = "./assets/";

  loader: THREE.TextureLoader;

  constructor() {
    THREE.Cache.enabled = true;
    this.loader = new THREE.TextureLoader();
  }

  loadTextures(...paths: Array<string>) {
    const loadBatch = paths.map(path => {
      return this.loadTexture(path);
    });
    return forkJoin(loadBatch);
  }

  loadTexture(path: string): Observable<THREE.Texture> {
    return new Observable<THREE.Texture>(textureObserver => {
      this.loader.load(
        this.base + path,
        loadedTexture => {
          textureObserver.next(loadedTexture);
          textureObserver.complete();
        },
        error => {
          textureObserver.error(error);
          textureObserver.complete();
        }
      );
    });
  }
}
