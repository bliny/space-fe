import { Injectable } from "@angular/core";
import { RenderingService } from "../services/rendering-service";
import { CameraService } from "../services/camera-service";
import {PlanetFactory} from "../services/planet/planet.factory";
import { StarFactory} from "../services/star/star.factory";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { forkJoin } from "rxjs/internal/observable/forkJoin";
import { map, take, first, mergeMap } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import { Vector3 } from "three-full";
import { BackgroundService } from "../services/background/background-service";
import {
  SolarSystemInfo,
  SolarSystemService
} from "../../base-module/services/solar-system.service";
import { ShipFactory} from "../services/ship/ship.factory";
import {RenderingStar} from '../services/star/rendering-star';
import {RenderedPlanet} from '../services/planet/rendered-planet';
import {RenderedShip} from '../services/ship/rendering-ship';

export class SolarSystemResource {
  render;
  camera;
  sun: RenderingStar;
  earth: RenderedPlanet;
  background;
  ship: RenderedShip;

  constructor(render, camera, sun:RenderingStar, earth: RenderedPlanet, background, ship: RenderedShip) {
    this.render = render;
    this.sun = sun;
    this.earth = earth;
    this.camera = camera;
    this.background = background;
    this.ship = ship;
  }
}

@Injectable({
  providedIn: "root"
})
export class SolarSystemResourceResolver
  implements Resolve<Observable<SolarSystemResource>> {
  constructor(
    private solarSystemService: SolarSystemService,
    private renderProvider: RenderingService,
    private cameraService: CameraService,
    private planetFactory: PlanetFactory,
    private starFactory: StarFactory,
    private backgroundService: BackgroundService,
    private shipFactory: ShipFactory
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SolarSystemResource> {
    const solarSystemId = route.paramMap.get("id");

    return this.solarSystemService
      .$getSolarSystemInformation(solarSystemId)
      .pipe(
        mergeMap((solarSystem: SolarSystemInfo) => {
          return forkJoin([
            this.renderProvider.getRenderer().pipe(take(1)),
            this.cameraService.getCamera().pipe(first()),
            this.starFactory.createStar(solarSystem.stars[0]).pipe(first()),
            this.planetFactory
              .createPlanet(solarSystem.planets[0])
              .pipe(first()),
            this.shipFactory.createShip(solarSystem.ships[0]).pipe(first()),
            this.backgroundService
              .createSpaceBackground(solarSystem.background)
              .pipe(first())
          ]).pipe(
            map(([renderer, camera, star, createdPlanet , ship, background]) => {
              const o = new SolarSystemResource(
                renderer,
                camera,
                star,
                createdPlanet,
                background,
                ship
              );
              return o;
            })
          );
        }),
        first()
      );
  }
}
