import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from "@angular/core";
import { RenderingService } from "../../services/rendering-service";
import { CameraService } from "../../services/camera-service";
import { PlanetFactory } from "../../services/planet/planet.factory";
import * as THREE from "three";
import { PlanetTexture } from "../../services/planet/planet-texture";
import MapControls from "three-map-controls";
import OrbitControls from "orbit-controls-es6";
import { Star, StarFactory } from "../../services/star/star.factory";

@Component({
  selector: "solar-system-rendering",
  templateUrl: "./solar-system-rendering.component.html",
  styleUrls: ["./solar-system-rendering.component.scss"]
})
export class SolarSystemRenderingComponent implements OnInit, AfterViewInit {
  geometry;
  material;
  uniforms;
  cloudMesh;
  moon;

  renderer: THREE.WebGLRenderer;
  camera;
  scene: THREE.Scene;
  earth: THREE.Mesh;
  controls;
  rayCaster = new THREE.Raycaster();
  star: Star;

  @ViewChild("solarSystemRendering")
  solarSystemRendering: ElementRef;

  constructor(
    private renderingService: RenderingService,
    private cameraService: CameraService,
    private planetFactory: PlanetFactory,
    private startFactory: StarFactory
  ) {
    this.camera = cameraService.getCamera();
    this.renderingService.getRenderer().subscribe(renderer => {
      this.renderer = renderer;
    });
  }

  ngAfterViewInit() {
    this.controls = new OrbitControls(
      this.camera,
      this.solarSystemRendering.nativeElement
    );
    this.controls.enabled = true;
    this.controls.maxDistance = 1500;
    this.controls.minDistance = 0;
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI;

    // How far you can dolly in and out ( PerspectiveCamera only )
    this.controls.minDistance = 0;
    this.controls.maxDistance = Infinity;

    this.controls.enableZoom = true; // Set to false to disable zooming
    this.controls.zoomSpeed = 1.0;

    this.controls.enablePan = true; // Set to false to disable panning (ie vertical and horizontal translations)

    this.controls.enableDamping = true; // Set to false to disable damping (ie inertia)
    this.controls.dampingFactor = 0.25;
    //this.controls.autoRotate=true;
  }

  ngOnInit() {
    this.scene = new THREE.Scene();
    this.earth = this.planetFactory.createPlanet(
      PlanetTexture.EARTH,
      30,
      new THREE.Vector3(0, 0, 0),
      "earth"
    );

    this.moon = this.planetFactory.createPlanet(
      PlanetTexture.MOON,
      10,
      new THREE.Vector3(4, 4, 100),
      "moon"
    );
    this.scene.add(this.earth);

    this.earth.castShadow = true;
    this.earth.receiveShadow = true;

    this.moon.castShadow = true;
    this.moon.receiveShadow = true;

    this.star = this.startFactory.createStar();

    this.scene.add(this.star.light);
    this.scene.add(this.star.object);

    this.scene.add(this.moon);

    const ambientLight = new THREE.AmbientLight(0xdc8874, 0.05);
    this.scene.add(ambientLight);

    this.scene.add(this.earth);

    this.animate();
  }

  @HostListener("mousedown", ["$event"])
  onMousedown(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.rayCaster.setFromCamera(mouse, this.camera);

    const intersects = this.rayCaster.intersectObjects(this.scene.children);

    console.log(intersects[0]);
  }

  /*
  @HostListener('mouseup')
  onMouseup() {
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
  }



  @HostListener('mousewheel', ['$event'])
  onMousewheel(event) {
    this.camera.position.z += event.deltaY/10;
  }

  @HostListener('change', ['$event'])
  onChangEvent(event) {
    console.log(event);
  }
*/

  animate() {
    requestAnimationFrame(() => this.animate());
    // this.earth.rotation.x += 0.001;
    this.earth.rotation.y += 0.001;

    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
    if (this.controls) {
      //console.log('sdasd')
      this.controls.update();
    }
  }
}
