import { Inject, Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable({
  providedIn: "root"
})
export class CameraService {
  width;
  height;
  aspect;
  view_angle = 45;
  near = 0.5;
  far = 5000;

  camera: THREE.PerspectiveCamera;

  constructor(@Inject("Window") private window: Window) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;

    this.camera = new THREE.PerspectiveCamera(
      this.view_angle,
      this.aspect,
      this.near,
      this.far
    );
    this.camera.position.x = 60;
    this.camera.position.y = 60;
    this.camera.position.z = 60;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}
