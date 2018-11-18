import { Component, Inject, OnInit, Renderer2, ViewChild } from "@angular/core";
import * as THREE from "three";
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  VIEW_ANGLE = 45;
  ASPECT = this.WIDTH / this.HEIGHT;
  NEAR = 0.5;
  FAR = 600000;

  RADIUS = 30;
  SEGMENTS = 32;
  RINGS = 32;

  startTime: any = Date.now();

  title = "base-app";

  @ViewChild("webGL")
  webGL;

  camera;
  scene;
  renderer;
  geometry;
  material;
  earth;
  uniforms;
  cloudMesh;
  moon;

  constructor(
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document
  ) {}

  scroll(event) {}

  public ngOnInit() {}

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedMilliseconds = Date.now() - this.startTime;
    const elapsedSeconds = elapsedMilliseconds / 1000;
    // this.earth.rotation.x += 0.001;

    this.earth.rotation.y += 0.001;
    //this.cloudMesh.rotation.x += 0.001;
    this.cloudMesh.rotation.y += 0.0005;
    this.uniforms.time.value = 2 * elapsedSeconds;
    this.renderer.render(this.scene, this.camera);
  }
}
