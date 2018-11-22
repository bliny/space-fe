import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable({
  providedIn: "root"
})
export class TextureLoader {
  base = "./assets/";

  loadTexture(path: string): THREE.Texture {
    return THREE.ImageUtils.loadTexture(this.base + path);
  }
}
