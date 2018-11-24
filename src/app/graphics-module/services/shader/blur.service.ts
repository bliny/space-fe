import { Injectable } from "@angular/core";
import { ShaderLoaderService } from "./shader-loader.service";
import { RenderingService } from "../rendering-service";
import * as THREE from "three";
import { CameraService } from "../camera-service";

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
  CopyShader,
  RGBShiftShader
} from "three-full";

@Injectable({
  providedIn: "root"
})
export class BlurService {
/*  private width: number;
  private height: number;
  private renderer: THREE.WebGLRenderer;
  private blurComposer: EffectComposer;
  private sceneComposer: EffectComposer;

  private horizontalBlurShader: string;
  private verticalBlurShader: string;
  private vertexShader: string;

  constructor(
    private shaderLoader: ShaderLoaderService,
    private renderingService: RenderingService,
    private cameraService: CameraService
  ) {
    renderingService.getRenderer().subscribe(renderer => {
      this.renderer = renderer;
      const renderTargetParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        stencilBufer: true
      };
      const blurRenderTarget = new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight,
        renderTargetParameters
      );
      this.blurComposer = new EffectComposer(renderer, blurRenderTarget);
      this.sceneComposer = new EffectComposer(renderer);
    });

    renderingService.getRenderingSize().subscribe(size => {
      this.width = size.width;
      this.height = size.height;
    });

    shaderLoader.loadShader("verticalBlurFragment").subscribe(verticalBlur => {
      this.verticalBlurShader = verticalBlur;
    });
    shaderLoader
      .loadShader("horizontalBlurFragment")
      .subscribe(horizontalBlur => {
        this.horizontalBlurShader = horizontalBlur;
      });
    shaderLoader.loadShader("simpleVertex").subscribe(simpleVertex => {
      this.vertexShader = simpleVertex;
    });
  }

  public blurObject(scene) {
    this.blurComposer.renderTarget2.texture.format = THREE.RGBAFormat;
    this.blurComposer.renderTarget1.texture.format = THREE.RGBAFormat;

    // Create a couple blur passes to blur the regular scene output. Note that each one of these objects will have a horizontal blur pass and a vertical blur pass.
    const blur1Passes = this.createBlurShaderPasses(this.width, this.height, 4);
    const blur2Passes = this.createBlurShaderPasses(
      this.width / 2,
      this.height / 2,
      2
    );

    const blurPass = new RenderPass(scene, this.cameraService.getCamera());
    blurPass.clear = true;
    blurPass.clearAlpha = 0.0;

    this.blurComposer.addPass(blurPass);
    this.blurComposer.addPass(blur1Passes.horizontalPass);
    this.blurComposer.addPass(blur1Passes.verticalPass);
    this.blurComposer.addPass(blur2Passes.horizontalPass);
    this.blurComposer.addPass(blur2Passes.verticalPass);

    blur2Passes.verticalPass.renderToScreen = true;

    return this.blurComposer;
  }

  createBlurShaderPasses(
    horizontal: number,
    vertical: number,
    bluriness: number
  ) {
    console.log(this.verticalBlurShader);
    const threeHorizontalBlur = {
      uniforms: {
        tDiffuse: { type: "t", value: null },
        h: { type: "f", value: bluriness / horizontal }
      },
      vertexShader: this.vertexShader,
      fragmentShader: this.horizontalBlurShader
    };

    const threeVerticalBlur = {
      uniforms: {
        tDiffuse: { type: "t", value: null },
        v: { type: "f", value: bluriness / vertical }
      },
      vertexShader: this.vertexShader,
      fragmentShader: this.verticalBlurShader
    };

    const horizontalBlurShaderPass = new ShaderPass(threeHorizontalBlur);
    const verticalBlurShaderPass = new ShaderPass(threeVerticalBlur);

    return {
      horizontalPass: horizontalBlurShaderPass,
      verticalPass: verticalBlurShaderPass
    };
  }

  */
}
