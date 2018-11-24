
export interface Uniform{
  tDiffuse: number;
}

export class ShaderModel{
  uniform: Uniform;
  vertexShader: string;
  fragmentShader: string;
}
