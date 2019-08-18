import {StarInfo} from '../../../base-module/services/star.service';
import {RenderingBase, RenderingInfo} from '../../domain/rendering-base';
/**
 * Created by FaNaT-Laptop on 2019. 08. 18..
 */

export class RenderingStar implements RenderingBase {
  renderingInfo: RenderingInfo;
  objectInfo: StarInfo;


  animate(time: number) {
  }
}
