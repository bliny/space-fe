import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import {CameraService} from "../../services/camera-service";
import * as THREE from "three";
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
  PointsMaterial,
  AxesHelper,
  PlaneGeometry,
  DoubleSide
} from "three-full";
import {
  OutlineShaderPassService,
  OutlineUniform
} from "../../services/shader/outline-shader-pass";
import {TextureLoader} from "../../services/texture/texture-loader.service";
import {PlanetTexture} from "../../services/planet/planet-texture";
import {GameObject} from "./solar-system.object";
import {Easing, Tween, autoPlay} from "es6-tween";
import {ActivatedRoute} from "@angular/router";
import {SolarSystemResource} from "../../resolvers/solar-system-resource-resolver";
import {ContainerFactory} from '../../services/util/container.factory';
import {RenderingBase} from '../../domain/rendering-base';
import {ControlService} from '../../../control-module/service/controll.service';
import {RenderedPlanet} from '../../services/planet/rendered-planet';
import {RenderedShip} from '../../services/ship/rendering-ship';

@Component({
  selector: "solar-system-rendering",
  templateUrl: "./solar-system-rendering.component.html",
  styleUrls: ["./solar-system-rendering.component.scss"]
})
export class SolarSystemRenderingComponent implements OnInit, AfterViewInit {

  objectContainer: Map<string, RenderingBase>;

  renderer;
  camera;
  scene: Scene;
  rayCaster = new Raycaster();
  lightSphere;
  private sceneComposer: EffectComposer;
  outlinePass;
  selectedObjects = new Array<any>();

  earth: RenderedPlanet;
  ship: RenderedShip;

  @ViewChild("solarSystemRendering")
  solarSystemRendering: ElementRef;

  constructor(private outlinePassService: OutlineShaderPassService,
              private route: ActivatedRoute,
              private cameraService: CameraService,
              private containerFactory: ContainerFactory,
              private controlService: ControlService) {
  }

  ngAfterViewInit() {
    this.controlService.$subscribeFocusObject().subscribe((objectId: string) => {
      const objectToFocusOn = this.objectContainer.get(objectId);
      if(objectToFocusOn){
        console.log(objectToFocusOn);
        if(objectToFocusOn.renderingInfo.renderingMesh) {
          this.cameraService.moveCameraToObject(objectToFocusOn.renderingInfo.renderingMesh);
        }else{
          this.cameraService.moveCameraToObject(objectToFocusOn.renderingInfo.renderingObject);
        }
      }
    })
  }

  ngOnInit() {
    this.route.data.subscribe(
      (data: { solarSystemResources: SolarSystemResource }) => {
        const solarSystemResources = data.solarSystemResources;
        this.renderer = solarSystemResources.render;
        this.camera = solarSystemResources.camera;

        this.scene = new Scene();

        const outlineUniform = new OutlineUniform();
        outlineUniform.edgeStrength = 6;
        outlineUniform.edgeGlow = 1;
        outlineUniform.edgeThickness = 3;
        outlineUniform.pulsePeriod = 2;
        outlineUniform.visibleEdgeColor = "#ff2424";
        outlineUniform.selectedObjectArray = this.selectedObjects;

        this.outlinePass = this.outlinePassService.createOutlineShaderPass(
          this.scene,
          this.camera,
          window.innerWidth,
          window.innerHeight,
          outlineUniform
        );

        const axesHelper = new AxesHelper(400);

        this.cameraService.createControls(
          this.camera,
          this.solarSystemRendering.nativeElement
        );

        this.scene.add(solarSystemResources.background);
        this.earth = solarSystemResources.earth;
        this.lightSphere = solarSystemResources.sun.renderingInfo.renderingObject;
        // this.scene.add(this.lightSphere);
        //
        this.scene.add(solarSystemResources.sun.renderingInfo.ambientLight);

        this.scene.add(solarSystemResources.earth.renderingInfo.renderingMesh);
        this.scene.add(solarSystemResources.sun.renderingInfo.light);

        this.ship = solarSystemResources.ship;

        this.scene.add(solarSystemResources.ship.renderingInfo.renderingObject);

        const plane111 = new THREE.Mesh(
          new THREE.CircleBufferGeometry(1000, 15),
          new THREE.MeshBasicMaterial({
            color: 0x248f24,
            alphaTest: 0,
            visible: false,
            side: THREE.DoubleSide
          })
        );
        plane111.rotation.x = 1.5707963268;
        plane111.name = "floor";
        //plane111.visible = false;
        this.scene.add(plane111);

        //this.scene.add( axesHelper );

        this.objectContainer = this.containerFactory.generateRenderingObjectContainer(solarSystemResources);
        console.log(this.objectContainer);

        this.postProcess();

        this.animate();
      }
    );
  }

  postProcessed = false;

  @HostListener("mousedown", ["$event"])
    onMousedown(event) {
      console.log('yolo')
      const mouse = new Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.rayCaster.setFromCamera(mouse, this.camera);

      const intersects = this.rayCaster.intersectObjects(this.scene.children);

      //this.outlinePass.selectedObjects.length = 0;
      if (
        intersects.length > 0 && intersects[0].object.name !== 'floor' && intersects[0].object.name !== 'background'

      ) {

        this.outlinePass.setSelection([intersects[0].object]);

        const solarSystemObject = new GameObject();
        solarSystemObject.clickPositionX = event.clientX;
        solarSystemObject.clickPositionY = event.clientY;
        solarSystemObject.selectedObject = this.objectContainer.get(intersects[0].object.name).objectInfo;
        this.controlService.setClickedOnGameObject(solarSystemObject);

        //this.outlinePass.selectedObjects.push(intersects[0].object);
        //this.cameraService.moveCameraToObject(intersects[0].object);
      }


    //this.userClicked.emit(solarSystemObject);
  }

  updateCam() {
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
    this.sceneComposer.render();
    this.cameraService.update();

    const time = Date.now() * 0.0005;
    /* this.earth.children[0].position.x = Math.cos( time * 10 ) * 5;
     this.earth.children[0].position.y = Math.cos( time * 7 ) * 3;
     this.earth.children[0].position.z = Math.cos( time * 8 ) * 4;*/
    //this.earth.children[0].translate(0, Math.cos(  7 ) * 3, 0)
    this.earth.animate(time);
  }

  private postProcess() {
    this.sceneComposer = new EffectComposer(this.renderer);
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

    const effectPass = new EffectPass(
      this.camera,
      godRaysEffect,
      this.outlinePass
    );
    //const outlinePass = new EffectPass(this.camera, this.outlinePass);
    effectPass.renderToScreen = true;
    effectPass.clear = false;
    //outlinePass.renderToScreen = true;
    //outlinePass.clear = false;

    const renderPass = new RenderPass(this.scene, this.camera);

    this.sceneComposer.addPass(renderPass);

    this.sceneComposer.addPass(effectPass);
    //this.sceneComposer.addPass(outlinePass);
  }
}
