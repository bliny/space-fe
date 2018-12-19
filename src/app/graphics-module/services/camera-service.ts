import { Inject, Injectable } from "@angular/core";
import { RenderingService, RenderingSize } from "./rendering-service";
import { PerspectiveCamera, OrbitControls, Vector3 } from "three-full";
import { Observable } from "rxjs/internal/Observable";
import { observable } from "rxjs/internal-compatibility";
import { TweeningService } from "./tweening/TweeningService";

@Injectable({
  providedIn: "root"
})
export class CameraService {
  aspect;
  view_angle = 75;
  near = 0.1;
  far = 20000;

  camera: PerspectiveCamera;
  controls: OrbitControls;

  isMoving = false;

  constructor(private tweening: TweeningService) {
    this.aspect = window.innerWidth / window.innerHeight;

    this.camera = new PerspectiveCamera(
      this.view_angle,
      this.aspect,
      this.near,
      this.far
    );
    this.camera.position.x = 500;
    this.camera.position.y = 500;
    this.camera.position.z = 600;
  }

  public getCamera(): Observable<PerspectiveCamera> {
    return Observable.create(obs => {
      console.log("camera");
      obs.next(this.camera);
      // obs.complete();
    });
  }

  public createControls(
    camera: PerspectiveCamera,
    domControlListenerElement: any
  ) {
    this.controls = new OrbitControls(this.camera, domControlListenerElement);
    this.controls.enabled = true;
    this.controls.maxDistance = 1500;
    this.controls.minDistance = 0;
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.minDistance = 0;
    this.controls.enableZoom = true; // Set to false to disable zooming
    this.controls.zoomSpeed = 1.0;
    this.controls.enablePan = true; // Set to false to disable panning (ie vertical and horizontal translations)
    this.controls.enableDamping = true; // Set to false to disable damping (ie inertia)
    this.controls.dampingFactor = 0.25;
  }

  moveCameraToObject(object) {
    const targetCameraPosition = new Vector3(
      object.position.x,
      object.position.y + 30,
      object.position.z + 30
    );
    this.tweening
      .moveObjectTo(this.camera.position, targetCameraPosition, 1000)
      .start();
    this.tweening
      .moveObjectTo(this.controls.target, object.position, 1000)
      .start();
  }

  update() {
    if (this.controls) {
      this.controls.update();
    }
  }
}
