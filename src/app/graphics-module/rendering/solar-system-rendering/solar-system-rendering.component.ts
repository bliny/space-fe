import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener, Input,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { RenderingService } from "../../services/rendering-service";
import { CameraService } from "../../services/camera-service";
import { PlanetFactory } from "../../services/planet/planet.factory";
import SpriteText from 'three-spritetext';
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
import {MarkerInfo} from '../../../view-module/components/object-marker/marker-info';

@Component({
  selector: "solar-system-rendering",
  templateUrl: "./solar-system-rendering.component.html",
  styleUrls: ["./solar-system-rendering.component.scss"]
})
export class SolarSystemRenderingComponent implements OnInit, AfterViewInit {
  @Output()
  userClicked: EventEmitter<SolarSystemObject> = new EventEmitter();
  @Input()
  markerInfo: MarkerInfo;


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
    private starFactory: StarFactory,
    private textureLoader: TextureLoader
  ) {
    this.camera = cameraService.getCamera();

  }

  ngAfterViewInit() {
    this.controls =this.cameraService.createControls(this.camera,this.solarSystemRendering.nativeElement);
  }

  ngOnInit() {
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

        const star = this.starFactory.createStar();

        this.lightSphere = star.object;

        this.scene.add(this.lightSphere);
        this.scene.add(star.ambientLight);


        console.log("asdasd");
      }
    });



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
