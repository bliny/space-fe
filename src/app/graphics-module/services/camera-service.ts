import { Inject, Injectable } from "@angular/core";
import { RenderingService, RenderingSize } from "./rendering-service";
import {
  PerspectiveCamera,
  OrbitControls
} from "three-full";

@Injectable({
  providedIn: "root"
})
export class CameraService {
  aspect;
  view_angle = 75;
  near = 0.1;
  far = 1000;

  camera: PerspectiveCamera;

  constructor(private renderingService: RenderingService) {
    renderingService.getRenderingSize().subscribe((size: RenderingSize) => {
      this.aspect = size.width / size.height;

      this.camera = new PerspectiveCamera(
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

  public getCamera(): PerspectiveCamera {
    return this.camera;
  }

  public createControls(camera:PerspectiveCamera, domControlListenerElement:any):OrbitControls {
    const controls = new OrbitControls(this.camera, domControlListenerElement);
    controls.enabled = true;
    controls.maxDistance = 1500;
    controls.minDistance = 0;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.minDistance = 0;
    controls.maxDistance = Infinity;
    controls.enableZoom = true; // Set to false to disable zooming
    controls.zoomSpeed = 1.0;
    controls.enablePan = true; // Set to false to disable panning (ie vertical and horizontal translations)
    controls.enableDamping = true; // Set to false to disable damping (ie inertia)
    controls.dampingFactor = 0.25;
    return controls;
  }
}
