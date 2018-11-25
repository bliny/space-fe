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
import { Star, StarFactory } from "../../services/star/star.factory";
import { ObjectLoaderService } from "../../services/object-loader/object-loader.service"
import {
  VolumetericLightShaderService,
  VolumetericLightShaderUniform
} from '../../services/shader/volumeteric-light-shader.service';

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
  OrbitControls,
  ShaderGodRays,
  LinearFilter,RGBFormat, UniformsUtils, ShaderMaterial,PlaneBufferGeometry,PointsMaterial
} from "three-full";
import {AdditiveBlendingShaderService} from '../../services/shader/additive-blending-shader.service';
import {OutlineShaderPassService, OutlineUniform} from '../../services/shader/outline-shader-pass';
import {TextureLoader} from '../../services/texture/texture-loader.service';



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


  renderer;
  camera;
  scene: Scene;

  rayCaster = new Raycaster();
  star: Star;
  plane;

  blur;

  controls

  // ubersun
  DEFAULT_LAYER = 0;
  OCCLUSION_LAYER = 1;

  lightSphere;
  occlusionRenderTarget

  private occlusionComposer: EffectComposer;
  private sceneComposer: EffectComposer;

  outlinePass;
  selectedObjects: Array<any>;



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
    private outlinePassService: OutlineShaderPassService,
    private textureLoader: TextureLoader,
  ) {
    this.camera = cameraService.getCamera();
    this.renderingService.getRenderer().subscribe(renderer => {
      this.renderer = renderer;
      this.occlusionRenderTarget = new WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight
      );
      this.occlusionComposer = new EffectComposer(
        renderer,
        this.occlusionRenderTarget
      );
      this.sceneComposer = new EffectComposer(renderer);
      this.sceneComposer.renderTarget1.stencilBuffer = true;
      this.sceneComposer.renderTarget2.stencilBuffer = true;
      this.scene = new Scene();

      this.scene.background = this.textureLoader.loadTexture('ny.jpg');

      this.selectedObjects = new Array<any>();

      const outlineUniform = new OutlineUniform();
      outlineUniform.edgeStrength = 6;
      outlineUniform.edgeGlow = 1;
      outlineUniform.edgeThickness =3 ;
      outlineUniform.pulsePeriod = 2;
      outlineUniform.visibleEdgeColor = '#ff2424';
      outlineUniform.selectedObjectArray = this.selectedObjects;

      this.outlinePass = outlinePassService.createOutlineShaderPass(this.scene, this.camera, window.innerWidth,
        window.innerHeight, outlineUniform );
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
    //this.scene.add(new THREE.AxesHelper(500));

    const ambientLight = new AmbientLight(0x2c3e50);
    this.scene.add(ambientLight);

    const pointLight: any = new PointLight(0xffddaa);
    //pointLight.position.set(40, 0, 0);
    this.scene.add(pointLight);

    const geometrySun = new SphereBufferGeometry(1, 16, 16);
    const materialSun = new MeshBasicMaterial({ color: 0xf20000 });

    const sunMaterial = new PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      color: 0xf20000,
      alphaTest: 0,
      transparent: true,
      fog: false
    });

    this.lightSphere = new Mesh(geometrySun, sunMaterial);
    //this.lightSphere.position.set(40, 0, 0);
    //this.lightSphere.layers.set(this.OCCLUSION_LAYER);
    this.scene.add(this.lightSphere);


    const planet = new Mesh(
      new SphereBufferGeometry(1, 1,1),
      new MeshPhongMaterial( { color: 0xe74c3c }),
    );

    planet.position.z = 2;
    this.scene.add(planet);


    const planet3 = new Mesh(
      new SphereBufferGeometry(1, 1,1),
      new MeshPhongMaterial( { color: 0xe74c3c }),
    );

    planet3.position.z = 20;
    planet3.position.x = 4;
    this.scene.add(planet3);

    const occPlanet = new Mesh(
      new SphereBufferGeometry(1, 1,1),
      new MeshPhongMaterial( { color: 0x000000 }),
    );

    occPlanet.position.z = 2;
    //occPlanet.layers.set(this.OCCLUSION_LAYER);
    //this.scene.add(occPlanet);


    this.animate();
  }

  postProcessed = false;
  @HostListener("mousedown", ["$event"])
  onMousedown(event) {

    if(this.postProcessed) {
      const mouse = new Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.rayCaster.setFromCamera(mouse, this.camera);

      const intersects = this.rayCaster.intersectObjects(this.scene.children);

      if(intersects.length > 0) {
        this.outlinePass.selectedObjects.length = 0;
        this.outlinePass.selectedObjects.push(intersects[0].object);

        console.log(intersects[0]);
        console.log(this.outlinePass);
      }
    }


    if(!this.postProcessed) {

      this.postProcess();
      this.postProcessed = true;

    }






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

     // this.camera.layers.set(this.OCCLUSION_LAYER);
    //  this.renderer.setClearColor(0x000000);
      //this.occlusionComposer.render();


      //this.camera.layers.set(this.DEFAULT_LAYER);
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

    //this.godrayPost();

    const godRaysEffect = new GodRaysEffect(this.scene, this.camera, this.lightSphere, {
      resolutionScale: 1.0,
      kernelSize: KernelSize.SMALL,
      density: 0.96,
      decay: 0.93,
      weight: 0.4,
      exposure: 0.6,
      samples: 60,
      clampMax: 1.0,
    });

    godRaysEffect.dithering = false;

    godRaysEffect.blendFunction  = BlendFunction.NEGATION;
    //console.log(godRaysEffect.blendMode);


    const uniform = new VolumetericLightShaderUniform();
    uniform.samples = 50;
    uniform.exposure = 0.18;
    uniform.decay = 0.95;
    uniform.density = 0.8;
    uniform.weight = 0.4;
    uniform.lightPosition = this.lightSphere.position;

    // add the volumeteric shader pass that will automatically be applied
    // to texture created by the scene render

  /*  this.occlusionComposer.addPass(new RenderPass(this.scene, this.camera));
    const pass1 = this.volumeLight.createShader(uniform);
    pass1.needsSwap = false;
    this.occlusionComposer.addPass(pass1);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.occlusionComposer.addPass(renderPass);

*/
    console.log(this.occlusionComposer);






    const additiveShader = this.additiveBlending.createShader(this.occlusionComposer.renderTarget1.texture);
    additiveShader.uniforms.tAdd.value = this.occlusionComposer.renderTarget1.texture;





    //this.sceneComposer.addPass(new RenderPass(this.scene, this.camera));


    additiveShader.renderToScreen=true;




    const effectFXAA = new ShaderPass( FXAAShader );
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    effectFXAA.renderToScreen = true;



   // this.sceneComposer.addPass(renderPass2);
   // this.sceneComposer.addPass(godRaysEffect);
   // this.sceneComposer.addPass( this.outlinePass);


    const effectPass = new EffectPass(this.camera,godRaysEffect);
    effectPass.renderToScreen = true;
    effectPass.clear = false;
    this.outlinePass.renderToScreen=false;

    //this.sceneComposer.addPass(this.outlinePass);


    const renderPass2= new RenderPass(this.scene, this.camera);
    //renderPass2.clear = true;
    renderPass2.renderToScreen=false;



    //this.sceneComposer.addPass(renderPass2);
    this.sceneComposer.addPass(renderPass2);
    this.sceneComposer.addPass(this.outlinePass);
    this.sceneComposer.addPass( effectPass );


    //this.sceneComposer.addPass( effectFXAA );

    //this.sceneComposer.addPass(renderPass2);
    console.log(this.camera);
  }





  private godrayPost() {

    const pars = { minFilter: LinearFilter, magFilter: LinearFilter, format: RGBFormat };
    const rtTextureColors = new WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
    const rtTextureDepth = new WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
    const rtTextureDepthMask = new WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );


    const w = window.innerWidth / 4.0;
    const h = window.innerHeight / 4.0;
    const rtTextureGodRays1 = new WebGLRenderTarget( w, h, pars );
    const rtTextureGodRays2 = new WebGLRenderTarget( w, h, pars );

    const godraysMaskShader = ShaderGodRays[ "godrays_depthMask" ];
    const godrayMaskUniforms = UniformsUtils.clone( godraysMaskShader.uniforms );
    const materialGodraysDepthMask = new ShaderMaterial( {
      uniforms: godrayMaskUniforms,
      vertexShader: godraysMaskShader.vertexShader,
      fragmentShader: godraysMaskShader.fragmentShader
    } );
    const godraysGenShader = ShaderGodRays[ "godrays_generate" ];
    const godrayGenUniforms = UniformsUtils.clone( godraysGenShader.uniforms );
    const materialGodraysGenerate = new ShaderMaterial( {
      uniforms: godrayGenUniforms,
      vertexShader: godraysGenShader.vertexShader,
      fragmentShader: godraysGenShader.fragmentShader
    } );
    const godraysCombineShader = ShaderGodRays[ "godrays_combine" ];
    const godrayCombineUniforms = UniformsUtils.clone( godraysCombineShader.uniforms );
    const materialGodraysCombine = new ShaderMaterial( {
      uniforms: godrayCombineUniforms,
      vertexShader: godraysCombineShader.vertexShader,
      fragmentShader: godraysCombineShader.fragmentShader
    } );
    const godraysFakeSunShader = ShaderGodRays[ "godrays_fake_sun" ];
    const godraysFakeSunUniforms = UniformsUtils.clone( godraysFakeSunShader.uniforms );
    const materialGodraysFakeSun = new ShaderMaterial( {
      uniforms: godraysFakeSunUniforms,
      vertexShader: godraysFakeSunShader.vertexShader,
      fragmentShader: godraysFakeSunShader.fragmentShader
    } );
    godraysFakeSunUniforms.bgColor.value.setHex( 0x000511 );
    godraysFakeSunUniforms.sunColor.value.setHex( 0xffee00 );
    godrayCombineUniforms.fGodRayIntensity.value = 0.75;
    const quad = new Mesh(
      new PlaneBufferGeometry( window.innerWidth, window.innerHeight ),
      materialGodraysGenerate
    );
    quad.position.z = - 9900;
    this.scene.add( quad );

  }
}
