import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SolarSystemComponent } from "./solar-system/solar-system.component";
import { ControlModule } from "../control-module/control.module";
import { GraphicsModule } from "../graphics-module/graphics.module";

@NgModule({
  imports: [CommonModule, GraphicsModule, ControlModule],
  declarations: [SolarSystemComponent],
  exports: []
})
export class ViewModule {}
