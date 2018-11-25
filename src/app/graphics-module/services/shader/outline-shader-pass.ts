import {Injectable} from '@angular/core';
import {OutlinePass, Vector2} from "three-full";


export class OutlineUniform{
  edgeStrength : number;
  edgeGlow :number;
  edgeThickness : number;
  pulsePeriod : number;
  visibleEdgeColor : string;
  selectedObjectArray: Array<any>;
}

@Injectable({
  providedIn: "root"
})
export class OutlineShaderPassService{


  constructor(){}



  createOutlineShaderPass(scene, camera, width, height, outlineUniform: OutlineUniform): OutlinePass{
    const outlinePass = new OutlinePass( new Vector2( width, height ), scene, camera );
    outlinePass.edgeStrength = outlineUniform.edgeStrength;
    outlinePass.edgeGlow = outlineUniform.edgeGlow;
    outlinePass.edgeThickness = outlineUniform.edgeThickness;
    outlinePass.pulsePeriod = outlineUniform.pulsePeriod;
    outlinePass.selectedObjectArray = outlineUniform.selectedObjectArray;
    outlinePass.visibleEdgeColor.set(outlineUniform.visibleEdgeColor);
    outlinePass.hiddenEdgeColor.set(outlineUniform.visibleEdgeColor);
    return outlinePass
  }
}
