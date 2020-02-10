import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlanetFactory } from "./services/planet/planet.factory";
import { TextureLoader } from "./services/texture/texture-loader.service";
import { SolarSystemRenderingComponent } from "./rendering/solar-system-rendering/solar-system-rendering.component";
import { RenderingService } from "./services/rendering-service";
import { RenderingBaseComponent } from "./rendering/rendering-base/rendering-base.component";
import { StarFactory } from "./services/star/star.factory";
import { ObjectLoaderService } from "./services/object-loader/object-loader.service";
import { HttpClientModule } from "@angular/common/http";
import {AdditiveBlendingShaderService} from './services/shader/additive-blending-shader.service';
import {VolumetericLightShaderService} from './services/shader/volumeteric-light-shader.service';
import { BattleFieldRenderingComponent } from './rendering/battle-field-rendering/battle-field-rendering.component';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [SolarSystemRenderingComponent, RenderingBaseComponent, BattleFieldRenderingComponent],
  exports: [SolarSystemRenderingComponent, RenderingBaseComponent, BattleFieldRenderingComponent],
  providers: [{ provide: "Window", useValue: window }, AdditiveBlendingShaderService, VolumetericLightShaderService]
  //
  //{width: '1300px', height:'1300px'}
})
export class GraphicsModule {}
