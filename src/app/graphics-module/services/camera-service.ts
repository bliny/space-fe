import { Inject, Injectable } from "@angular/core";
import * as THREE from "three";
import { RenderingService, RenderingSize } from "./rendering-service";

@Injectable({
  providedIn: "root"
})
export class CameraService {
  aspect;
  view_angle = 75;
  near = 0.1;
  far = 1000;

  camera: THREE.PerspectiveCamera;

  constructor(private renderingService: RenderingService) {
    renderingService.getRenderingSize().subscribe((size: RenderingSize) => {
      this.aspect = size.width / size.height;

      this.camera = new THREE.PerspectiveCamera(
        this.view_angle,
        this.aspect,
        this.near,
        this.far
      );
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = 6;
    });
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}
