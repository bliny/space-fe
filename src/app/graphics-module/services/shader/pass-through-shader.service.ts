import {Inject} from '@angular/core';
import {GLSLShader, ShaderLoaderService} from './shader-loader.service';
import {
  ShaderPass,
} from "three-full";

@Inject({
  providedIn: "root"
})
export class PassThroughShaderService{

  shaders: GLSLShader;

  constructor(shaderLoader: ShaderLoaderService){
    shaderLoader.loadShaders('simpleVertex' , 'PassThroughShaderFragmentShader').subscribe( shaders =>{
      this.shaders = shaders;
    });
  }

  createShader(): ShaderPass{
    const shaderInfo = {
      uniforms: {
        tDiffuse: { type: "sampler2D", value: null },
      },
      vertexShader: this.shaders.vertexShader,
      fragmentShader: this.shaders.fragmentShader,
    };
    return new ShaderPass(shaderInfo);
  }

}
