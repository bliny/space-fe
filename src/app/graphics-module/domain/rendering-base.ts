import {Object3D, Mesh, PointLight, AmbientLight} from "three";
import {SpaceObject} from '../../base-module/services/domail/SpaceObject';

export interface RenderingBase{
  objectInfo: SpaceObject;
  renderingInfo: RenderingInfo;
}

export class RenderingInfo{
  renderingObject: Object3D;
  renderingMesh: Mesh;
  light: PointLight;
  ambientLight: AmbientLight;
}
