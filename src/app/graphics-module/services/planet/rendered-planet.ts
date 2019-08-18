import {PlanetInfo} from '../../../base-module/services/planet-service';
import {RenderingBase, RenderingInfo} from '../../domain/rendering-base';
import {Vector3} from "three";

/**
 * Created by FaNaT-Laptop on 2019. 08. 18..
 */

export class RenderedPlanet implements RenderingBase {
  renderingInfo: RenderingInfo;
  objectInfo: PlanetInfo;


  animate(time: number) {
    this.renderingInfo.renderingMesh.rotation.y += 0.005;

    const post = this.renderingInfo.renderingMesh.position.clone();

    this.renderingInfo.renderingMesh.position.x=0;
    this.renderingInfo.renderingMesh.position.y=0;
    this.renderingInfo.renderingMesh.position.z=0;

    this.renderingInfo.renderingMesh.rotation.y = 0.18;

    this.renderingInfo.renderingMesh.position.add(post);
    console.log(post);

    if(this.objectInfo.moon) {
      this.renderingInfo.renderingMesh.children[0].rotation.y += 0.008;

      this.renderingInfo.renderingMesh.children[1].rotation.y += 0.1;

    }
  }
}
