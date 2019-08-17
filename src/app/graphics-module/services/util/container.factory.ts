import {Injectable} from '@angular/core';
import {RenderingBase} from '../../domain/rendering-base';
import {SpaceObject} from '../../../base-module/services/domail/SpaceObject';
/**
 * Created by FaNaT-Laptop on 2019. 08. 17..
 */


@Injectable({
  providedIn: "root"
})
export class ContainerFactory{


  generateRenderingObjectContainer(generateFrom: any): Map<string, RenderingBase>{
    const renderingContainer = new Map<string, RenderingBase>();
    for( let key in generateFrom) {
      for( let renderingProp in generateFrom[key]){
        if(generateFrom[key][renderingProp] instanceof SpaceObject){
          renderingContainer.set(generateFrom[key][renderingProp].id, generateFrom[key]);
          break;
        }
      }
    }

    return renderingContainer;
  }
}
