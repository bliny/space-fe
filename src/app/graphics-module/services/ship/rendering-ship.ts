import {RenderingBase, RenderingInfo} from '../../domain/rendering-base';
import {ShipInfo} from '../../../base-module/services/ship-service';


export class RenderedShip implements RenderingBase {
  objectInfo: ShipInfo;
  renderingInfo: RenderingInfo;


  animate(time: number) {
  }
}
