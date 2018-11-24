import {Inject} from '@angular/core';
import {GLSLShader, ShaderLoaderService} from './shader-loader.service';
import {
  ShaderPass,
} from "three-full";
import {CameraService} from '../camera-service';
import {Vector3, Vector2} from "three";


export class VolumetericLightShaderUniform{
  lightPosition: Vector3;
  exposure: number;
  decay: number;
  density: number;
  weight: number;
  samples: number;
}

@Inject({
  providedIn: "root"
})
export class VolumetericLightShaderService {

  shaders: GLSLShader;
  camera;

  constructor(shaderLoader: ShaderLoaderService, cameraService: CameraService){
    shaderLoader.loadShaders('simpleVertex' , 'VolumetericLightFragmentShader').subscribe( shaders =>{
      this.shaders = shaders;
    });
    this.camera = cameraService.getCamera();
  }

  createShader(uniform: VolumetericLightShaderUniform): ShaderPass{
    const shaderInfo = {
      uniforms: {
        tDiffuse: { type: "sampler2D", value: null },
        lightPosition23: { type: "vec2", value: new Vector2(0.5, 0.5) },
        exposure: { type: "float", value: uniform.exposure },
        decay: { type: "float", value:uniform.decay },
        density: { type: "float", value: uniform.density },
        weight: { type: "float", value: uniform.weight },
        samples: { type: "int", value: uniform.samples },
      },
      vertexShader: this.shaders.vertexShader,
      fragmentShader: this.shaders.fragmentShader,
    };

    const shaderP =new ShaderPass(shaderInfo);
    console.log(shaderP);
    return shaderP;
  }

  private calculatePos(lightPosition: Vector3) {
    console.log(lightPosition);
    const newVector = new Vector3();
    newVector.copy (lightPosition);
    console.log(newVector);
    const vector = newVector.project(this.camera);
    console.log(this.camera);
    console.log(vector);
    const x = ( vector.x + 1 ) / 2;
    const y = ( vector.y + 1 ) / 2;
    console.log(x);
    console.log(y);
    return {x: 0.5, y: 0.5};
  }
}
