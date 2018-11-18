import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlanetFactory } from "./services/planet/planet.factory";
import { TextureLoader } from "./services/texture/texture-loader.service";
import { SolarSystemRenderingComponent } from "./rendering/solar-system-rendering/solar-system-rendering.component";
import { RenderingService } from "./services/rendering-service";
import { RenderingBaseComponent } from "./rendering/rendering-base/rendering-base.component";
import { StarFactory } from "./services/star/star.factory";

@NgModule({
  imports: [CommonModule],
  declarations: [SolarSystemRenderingComponent, RenderingBaseComponent],
  exports: [SolarSystemRenderingComponent, RenderingBaseComponent],
  providers: [
    { provide: "Window", useValue: window },
    PlanetFactory,
    TextureLoader,
    StarFactory
  ]
  //
  //{width: '1300px', height:'1300px'}
})
export class GraphicsModule {}
