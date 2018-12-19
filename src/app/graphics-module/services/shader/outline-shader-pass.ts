import { Injectable } from "@angular/core";
import { OutlineEffect } from "postprocessing";

export class OutlineUniform {
  edgeStrength: number;
  edgeGlow: number;
  edgeThickness: number;
  pulsePeriod: number;
  visibleEdgeColor: string;
  selectedObjectArray: Array<any>;
}

@Injectable({
  providedIn: "root"
})
export class OutlineShaderPassService {
  constructor() {}

  createOutlineShaderPass(
    scene,
    camera,
    width,
    height,
    outlineUniform: OutlineUniform
  ): OutlineEffect {
    const outlinePass = new OutlineEffect(scene, camera, {
      edgeStrength: 6,
      pulseSpeed: 0.0,
      visibleEdgeColor: "#ff2424",
      hiddenEdgeColor: 0x22090a,
      blur: false,
      xRay: true
    });
    /* outlinePass.edgeStrength = outlineUniform.edgeStrength;
    outlinePass.edgeGlow = outlineUniform.edgeGlow;
    outlinePass.edgeThickness = outlineUniform.edgeThickness;
    outlinePass.pulsePeriod = outlineUniform.pulsePeriod;
    outlinePass.selectedObjectArray = outlineUniform.selectedObjectArray;
    outlinePass.visibleEdgeColor.set(outlineUniform.visibleEdgeColor);
    outlinePass.hiddenEdgeColor.set(outlineUniform.visibleEdgeColor);
    */
    return outlinePass;
  }
}
