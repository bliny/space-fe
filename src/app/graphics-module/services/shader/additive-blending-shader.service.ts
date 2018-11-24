import {Inject} from '@angular/core';
import {GLSLShader, ShaderLoaderService} from './shader-loader.service';
import {
  ShaderPass,
} from "three-full";

@Inject({
  providedIn: "root"
})
export class AdditiveBlendingShaderService{

  additiveBlendingShaders: GLSLShader;

  constructor(shaderLoader: ShaderLoaderService){
    shaderLoader.loadShaders('simpleVertex' , 'AdditiveBlendingFragmentShader').subscribe( shaders =>{
      this.additiveBlendingShaders = shaders;
    });
  }

  createShader(renderTargetTexture): ShaderPass{
    console.log(renderTargetTexture);
    console.log(this.additiveBlendingShaders);
    const shader = {
      uniforms: {
        tDiffuse: { type: "sampler2D", value: null },
        tAdd: { type: "sampler2D ", value: renderTargetTexture }
      },
      vertexShader: this.additiveBlendingShaders.vertexShader,
      fragmentShader: this.additiveBlendingShaders.fragmentShader,
    };
    return new ShaderPass(shader);
  }

}
