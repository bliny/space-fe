import { Resolver } from "@angular/core/testing/src/resolvers";
import { Injectable } from "@angular/core";
import { RenderingService } from "../../../services/rendering-service";
import { CameraService } from "../../../services/camera-service";
import { PlanetFactory } from "../../../services/planet/planet.factory";
import { Star, StarFactory } from "../../../services/star/star.factory";
import { ActivatedRouteSnapshot } from "@angular/router";
import { forkJoin } from "rxjs/internal/observable/forkJoin";
import { map, take, first } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import { PlanetTexture } from "../../../services/planet/planet-texture";
import { Vector3 } from "three-full";
import { getExpressionLoweringTransformFactory } from "@angular/compiler-cli/src/transformers/lower_expressions";
import { BackgroundService } from "../../../services/background/background-service";
import { ObjectLoaderService } from "../../../services/object-loader/object-loader.service";

export class SolarSystemResource {
  render;
  camera;
  sun: Star;
  earth;
  background;
  ship;

  constructor(render, camera, sun, earth, background, ship) {
    this.render = render;
    this.sun = sun;
    this.earth = earth;
    this.camera = camera;
    this.background = background;
    this.ship = ship;
  }
}

export class Planet {
  position: Position;
  size: number;
  texture: PlanetTexture;
  name: string;
  moon: Planet;
}

export class Position {
  x: number;
  y: number;
  z: number;
}

@Injectable({
  providedIn: "root"
})
export class SolarSystemResourceResolver
  implements Resolver<Observable<SolarSystemResource>> {
  constructor(
    private renderProvider: RenderingService,
    private cameraService: CameraService,
    private planetFactory: PlanetFactory,
    private starFactory: StarFactory,
    private backgroundService: BackgroundService,
    private objectLoader: ObjectLoaderService
  ) {}

  resolve(): Observable<SolarSystemResource> {
    const planet: Planet = new Planet();
    planet.position = new Vector3(550, 0, 0);
    planet.size = 30;
    planet.texture = PlanetTexture.EARTH;
    planet.name = "earth";

    const moon = new Planet();
    moon.size = 4;
    moon.texture = PlanetTexture.MOON;
    moon.name = "moon";
    planet.moon = moon;

    return forkJoin([
      this.renderProvider.getRenderer().pipe(take(1)),
      this.cameraService.getCamera().pipe(first()),
      this.starFactory.createStar().pipe(first()),
      this.planetFactory.createPlanet(planet).pipe(first()),
      this.objectLoader.loadObject("Sample_Ship", "Sample_Ship").pipe(first()),
      this.backgroundService
        .createSpaceBackground(4500, "2k_stars_milky_way")
        .pipe(first())
    ]).pipe(
      map(([renderer, camera, star, createdPlanet, ship, background]) => {
        //console.log(background);
        return new SolarSystemResource(
          renderer,
          camera,
          star,
          createdPlanet,
          background,
          ship
        );
      })
    );
  }
}
