import { Injectable} from "@angular/core";
import * as THREE from "three";
import {TextureLoader} from "../texture/texture-loader.service";
import {Observable} from "rxjs/internal/Observable";
import {StarInfo} from "../../../base-module/services/star.service";
import {RenderingInfo} from '../../domain/rendering-base';
import {RenderingStar} from './rendering-star';



@Injectable({
  providedIn: "root"
})
export class StarFactory {
  segments = 32;
  rings = 32;

  base = "planets/";
  baseTexture = "/base.jpg";
  bumpTexture = "/bump.jpg";
  atmoTexture = "/atmo.png";
  specularTexture = "/specular.jpg";

  constructor(private textureLoader: TextureLoader) {
  }

  createStar(starInfo: StarInfo): Observable<RenderingStar> {
    return Observable.create(obs => {
      this.textureLoader.loadTexture(starInfo.texture).subscribe(texture => {
        const shadowLight: any = new THREE.PointLight(0xffffff, 2, 800);
        shadowLight.position.set(
          starInfo.position.x,
          starInfo.position.y,
          starInfo.position.z
        );
        shadowLight.castShadow = true;
        shadowLight.shadow.camera.left = -400;
        shadowLight.shadow.camera.right = 400;
        shadowLight.shadow.camera.top = 400;
        shadowLight.shadow.camera.bottom = -400;
        shadowLight.shadow.camera.near = 50;
        shadowLight.shadow.camera.far = 1000;
        shadowLight.shadow.mapSize.width = 2048;
        shadowLight.shadow.mapSize.height = 2048;

        const ambientLight = new THREE.AmbientLight(0x2c3e50);

        const geometrySun = new THREE.SphereBufferGeometry(
          starInfo.size,
          32,
          32
        );
        const sunMaterial = new THREE.PointsMaterial({
          //size: 0.05,
          //map: texture,
          sizeAttenuation: true,
          color: 0xfdb813,
          alphaTest: 0,
          transparent: true,
          fog: false
        });
        /*
         const planetMaterial = new THREE.MeshPhongMaterial({
         map: loadedTextures.base,
         bumpMap: loadedTextures.bump,
         bumpScale: 0.8,
         specularMap: loadedTextures.spec,
         shininess: 5,
         specular: new THREE.Color("grey")
         });
         */
        const lightSphere = new THREE.Mesh(geometrySun, sunMaterial);
        lightSphere.name = starInfo.id;

        const star = new RenderingStar();
        star.renderingInfo = new RenderingInfo();
        star.renderingInfo.renderingObject = lightSphere;
        star.renderingInfo.light = shadowLight;
        star.renderingInfo.ambientLight = ambientLight;
        star.objectInfo = starInfo;
        obs.next(star);
        // obs.complete();
      });
    });
  }
}
