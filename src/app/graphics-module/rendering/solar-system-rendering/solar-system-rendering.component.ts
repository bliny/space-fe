import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { RenderingService } from "../../services/rendering-service";
import { CameraService } from "../../services/camera-service";
import { PlanetFactory } from "../../services/planet/planet.factory";
import { Star, StarFactory } from "../../services/star/star.factory";
import { ObjectLoaderService } from "../../services/object-loader/object-loader.service";
import {
  VolumetericLightShaderService,
  VolumetericLightShaderUniform
} from "../../services/shader/volumeteric-light-shader.service";

import {
  BlendFunction,
  EffectPass,
  GodRaysEffect,
  KernelSize,
  SMAAEffect
} from "postprocessing";

import {
  ShaderPass,
  DotScreenShader,
  EffectComposer,
  Pass,
  RenderPass,
  TexturePass,
  ClearPass,
  MaskPass,
  ClearMaskPass,
  VolumetericLightShader,
  AdditiveBlendingShader,
  CopyShader,
  RGBShiftShader,
  OutlinePass,
  FXAAShader,
  Raycaster,
  Scene,
  WebGLRenderTarget,
  AmbientLight,
  PointLight,
  SphereBufferGeometry,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Mesh,
  Vector2,
  Vector3,
  OrbitControls,
  Color,
  ShaderGodRays,
  SphereGeometry,
  LinearFilter,
  RGBFormat,
  UniformsUtils,
  ShaderMaterial,
  PlaneBufferGeometry,
  PointsMaterial
} from "three-full";
import { AdditiveBlendingShaderService } from "../../services/shader/additive-blending-shader.service";
import {
  OutlineShaderPassService,
  OutlineUniform
} from "../../services/shader/outline-shader-pass";
import { TextureLoader } from "../../services/texture/texture-loader.service";
import { PlanetTexture } from "../../services/planet/planet-texture";
import { SolarSystemObject } from "./solar-system.object";
import { Easing, Tween, autoPlay } from "es6-tween";

@Component({
  selector: "solar-system-rendering",
  templateUrl: "./solar-system-rendering.component.html",
  styleUrls: ["./solar-system-rendering.component.scss"]
})
export class SolarSystemRenderingComponent implements OnInit, AfterViewInit {
  @Output()
  userClicked: EventEmitter<SolarSystemObject> = new EventEmitter();

  renderer;
  camera;
  scene: Scene;
  rayCaster = new Raycaster();
  controls;
  lightSphere;
  private sceneComposer: EffectComposer;
  outlinePass;
  selectedObjects: Array<any>;

  @ViewChild("solarSystemRendering")
  solarSystemRendering: ElementRef;

  constructor(
    private renderingService: RenderingService,
    private cameraService: CameraService,
    private planetFactory: PlanetFactory,
    private outlinePassService: OutlineShaderPassService,
    private textureLoader: TextureLoader
  ) {
    this.camera = cameraService.getCamera();
    this.renderingService.getRenderer().subscribe(renderer => {
      if (renderer) {
        this.renderer = renderer;

        this.sceneComposer = new EffectComposer(renderer);
        this.scene = new Scene();

        this.textureLoader
          .loadTexture("ny.jpg")
          .subscribe(x => (this.scene.background = x));

        this.selectedObjects = new Array<any>();

        const outlineUniform = new OutlineUniform();
        outlineUniform.edgeStrength = 6;
        outlineUniform.edgeGlow = 1;
        outlineUniform.edgeThickness = 3;
        outlineUniform.pulsePeriod = 2;
        outlineUniform.visibleEdgeColor = "#ff2424";
        outlineUniform.selectedObjectArray = this.selectedObjects;

        this.outlinePass = outlinePassService.createOutlineShaderPass(
          this.scene,
          this.camera,
          window.innerWidth,
          window.innerHeight,
          outlineUniform
        );

        for (let i = 0; i < 6; i++) {
          const earth = this.planetFactory.createPlanet(
            PlanetTexture.EARTH,
            1,
            new Vector3(i * 2 + 2, i * 2 + 2, 0),
            "earth"
          );
          this.scene.add(earth);
        }

        const ambientLight = new AmbientLight(0x2c3e50);
        this.scene.add(ambientLight);

        const geometrySun = new SphereBufferGeometry(1, 16, 16);
        const sunMaterial = new PointsMaterial({
          size: 0.05,
          sizeAttenuation: true,
          color: 0xf20000,
          alphaTest: 0,
          transparent: true,
          fog: false
        });

        this.lightSphere = new Mesh(geometrySun, sunMaterial);
        this.scene.add(this.lightSphere);

        const planet = new Mesh(
          new SphereBufferGeometry(1, 1, 1),
          new MeshPhongMaterial({ color: 0xe74c3c })
        );
        planet.position.z = 2;
        this.scene.add(planet);

        const planet2 = new Mesh(
          new SphereBufferGeometry(1, 32, 32),
          new MeshPhongMaterial({ color: 0xe74c3c })
        );
        planet2.position.z = 4;

        const planet3 = new Mesh(
          new SphereBufferGeometry(1, 32, 32),
          new MeshPhongMaterial({ color: 0xe74c3c })
        );
        planet3.position.z = 6;

        this.scene.add(planet2);
        this.scene.add(planet3);

        console.log("asdasd");
      }
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

  async ngOnInit() {
    this.animate();
  }

  postProcessed = false;
  @HostListener("mousedown", ["$event"])
  onMousedown(event) {
    if (this.postProcessed) {
      const mouse = new Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.rayCaster.setFromCamera(mouse, this.camera);

      const intersects = this.rayCaster.intersectObjects(this.scene.children);

      if (intersects.length > 0) {
        this.outlinePass.selectedObjects.length = 0;
        this.outlinePass.selectedObjects.push(intersects[0].object);

        autoPlay(true);
        /*



          console.log(startPost);
        const tween = new Tween(startPost)
          .to(endPost, 5000)
          .on('update',({x,y}) => {
            console.log(x);
        })
          .easing( Easing.Sinusoidal.EaseInOut)

        tween.start();
*/
        const startPost = {
          x: this.camera.position.x,
          y: this.camera.position.y,
          z: this.camera.position.z
        };

        const endPost = {
          x: intersects[0].object.position.x - 5,
          y: intersects[0].object.position.y - 5,
          z: intersects[0].object.position.z - 5
        };

        this.controls.target = intersects[0].object.position.clone();
        this.camera.lookAt(intersects[0].object.position);
        let coords = { x: 0, y: 0 };
        let tween = new Tween(startPost)
          .to(endPost, 500)
          .on("update", ({ x, y, z }) => {
            this.camera.position.set(x, y, z);
          })
          .start();

        const startPost2 = {
          x: this.controls.target.x,
          y: this.controls.target.y,
          z: this.controls.target.z
        };

        const endPost2 = {
          x: intersects[0].object.position.x,
          y: intersects[0].object.position.y,
          z: intersects[0].object.position.z
        };
        let tween2 = new Tween(startPost2)
          .to(endPost2, 500)
          .on("update", ({ x, y, z }) => {
            this.controls.target.set(x, y, z);
          })
          .start();
      }

      const solarSystemObject = new SolarSystemObject();
      solarSystemObject.clickPositionX = event.clientX;
      solarSystemObject.clickPositionY = event.clientY;
      this.userClicked.emit(solarSystemObject);
    }
    if (!this.postProcessed) {
      this.postProcess();
      this.postProcessed = true;
    }
  }

  updateCam() {}

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
    if (this.postProcessed) {
      this.sceneComposer.render();
    }
    if (this.controls) {
      this.controls.update();
    }
  }

  private postProcess() {
    const godRaysEffect = new GodRaysEffect(
      this.scene,
      this.camera,
      this.lightSphere,
      {
        resolutionScale: 1.0,
        kernelSize: KernelSize.SMALL,
        density: 0.96,
        decay: 0.93,
        weight: 0.4,
        exposure: 0.6,
        samples: 60,
        clampMax: 1.0
      }
    );

    godRaysEffect.dithering = false;

    const effectPass = new EffectPass(this.camera, godRaysEffect);
    effectPass.renderToScreen = true;
    effectPass.clear = false;

    const renderPass = new RenderPass(this.scene, this.camera);

    this.sceneComposer.addPass(renderPass);
    this.sceneComposer.addPass(this.outlinePass);
    this.sceneComposer.addPass(effectPass);
  }
}
