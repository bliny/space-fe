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
import { ObjectLoaderService } from "../../services/object-loader/object-loader.service";
import { ShaderLoaderService } from "../../services/shader/shader-loader.service";
import { BlurService } from "../../services/shader/blur.service";
import {
  VolumetericLightShaderService,
  VolumetericLightShaderUniform
} from '../../services/shader/volumeteric-light-shader.service';

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
  RGBShiftShader
} from "three-full";
import {AdditiveBlendingShaderService} from '../../services/shader/additive-blending-shader.service';



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
  plane;

  blur;

  // ubersun
  DEFAULT_LAYER = 0;
  OCCLUSION_LAYER = 1;

  lightSphere;
  occlusionRenderTarget

  private occlusionComposer: EffectComposer;
  private sceneComposer: EffectComposer;



  @ViewChild("solarSystemRendering")
  solarSystemRendering: ElementRef;

  constructor(
    private renderingService: RenderingService,
    private cameraService: CameraService,
    private planetFactory: PlanetFactory,
    private startFactory: StarFactory,
    private objectLoader: ObjectLoaderService,
    private additiveBlending: AdditiveBlendingShaderService,
    private volumeLight: VolumetericLightShaderService,
  ) {
    this.camera = cameraService.getCamera();
    this.renderingService.getRenderer().subscribe(renderer => {
      this.renderer = renderer;
      this.occlusionRenderTarget = new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight
      );
      this.occlusionComposer = new EffectComposer(
        renderer,
        this.occlusionRenderTarget
      );
      this.sceneComposer = new EffectComposer(renderer);
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
 /*   this.earth = this.planetFactory.createPlanet(
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

    //this.star = this.startFactory.createStar();

    this.scene.add(this.star.light);
    this.scene.add(this.star.object);

    this.scene.add(this.moon);

    const ambientLight = new THREE.AmbientLight(0xdc8874, 0.05);
    this.scene.add(ambientLight);

    this.scene.add(this.earth);

    const geometry = new THREE.PlaneGeometry(1000, 1000);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide
    });
    this.plane = new THREE.Mesh(geometry, material);

    this.plane.rotation.x = 1.57;

    this.scene.add(this.plane);
*/
    this.scene.add(new THREE.AxesHelper(500));

    const ambientLight = new THREE.AmbientLight(0x2c3e50);
    this.scene.add(ambientLight);

    const pointLight: any = new THREE.PointLight(0xffffff);
    //pointLight.position.set(40, 0, 0);
    //this.scene.add(pointLight);

    const geometrySun = new THREE.SphereBufferGeometry(1, 16, 16);
    const materialSun = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this.lightSphere = new THREE.Mesh(geometrySun, materialSun);
    //this.lightSphere.position.set(40, 0, 0);
    this.lightSphere.layers.set(this.OCCLUSION_LAYER);
    this.scene.add(this.lightSphere);


    const planet = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 1,1),
      new THREE.MeshPhongMaterial( { color: 0xe74c3c }),
    );

    planet.position.z = 2;
    this.scene.add(planet);

    const occPlanet = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 1,1),
      new THREE.MeshPhongMaterial( { color: 0x000000 }),
    );

    occPlanet.position.z = 2;
    occPlanet.layers.set(this.OCCLUSION_LAYER);
    this.scene.add(occPlanet);


    this.animate();
  }

  postProcessed = false;
  @HostListener("mousedown", ["$event"])
  onMousedown(event) {
    if(!this.postProcessed) {

      this.postProcess();
      this.postProcessed = true;

    }

   /* const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.rayCaster.setFromCamera(mouse, this.camera);

    const intersects = this.rayCaster.intersectObjects(this.scene.children);

    //intersects[0].point;
    this.earth.position.x = intersects[0].point.x;
    this.earth.position.y = intersects[0].point.y;
    this.earth.position.z = intersects[0].point.z;

    console.log(intersects[0]);
    */
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
    //this.earth.rotation.y += 0.001;

    //this.plane.rotation.x += 0.01;
    // console.log(this.plane.rotation.x);
    if(this.postProcessed) {

      this.camera.layers.set(this.OCCLUSION_LAYER);
      //this.renderer.setClearColor(0x000000);
      this.occlusionComposer.render();


      this.camera.layers.set(this.DEFAULT_LAYER);
      //this.renderer.setClearColor(0x090611);
      this.sceneComposer.render();


    }
    if (this.blur) {
      //this.blur.render();
    }
    if (this.renderer) {
      //this.renderer.render(this.scene, this.camera);
    }
    if (this.controls) {
      //console.log('sdasd')
      this.controls.update();
    }
  }

  private postProcess() {
    // create the occlusion render target and composer
    // to increase performance we only render the effect at 1/2 the screen size
    // add a scene render pass
    this.occlusionComposer.addPass(new RenderPass(this.scene, this.camera));
    // add the volumeteric shader pass that will automatically be applied
    // to texture created by the scene render
    const uniform = new VolumetericLightShaderUniform();
    uniform.samples = 50;
    uniform.exposure = 0.18;
    uniform.decay = 0.95;
    uniform.density = 0.8;
    uniform.weight = 0.4;
    uniform.lightPosition = this.lightSphere.position;

    const pass1 = this.volumeLight.createShader(uniform);
    // since only one shader is used the front and back buffers do not need to be swapped
    // after the shader does its work.
    pass1.needsSwap = false;
    this.occlusionComposer.addPass(pass1);
    const anyukad = new RenderPass(this.scene, this.camera);
    anyukad.renderToScreen=true;
    this.occlusionComposer.addPass(anyukad);
    console.log(this.occlusionComposer);


    // a second composer and render pass for the lit scene
    this.sceneComposer.addPass(new RenderPass(this.scene, this.camera));
    // an additive blending pass that takes as a uniform
    // the resulting texture from the volumetric light shader
    const pass2 = this.additiveBlending.createShader(this.occlusionComposer.renderTarget1.texture);
    pass2.uniforms.tAdd.value = this.occlusionComposer.renderTarget1.texture;
    this.sceneComposer.addPass(pass2);
    pass2.renderToScreen = true;

    console.log(this.camera);
  }
}
