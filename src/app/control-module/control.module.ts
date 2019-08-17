import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SolarSystemControlComponent } from "./solar-system-control/solar-system-control.component";
import {GraphicsModule} from '../graphics-module/graphics.module';

@NgModule({
  imports: [CommonModule, GraphicsModule],
  declarations: [SolarSystemControlComponent],
  exports: [SolarSystemControlComponent]
})
export class ControlModule {}
