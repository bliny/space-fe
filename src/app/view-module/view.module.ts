import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SolarSystemComponent } from "./solar-system/solar-system.component";
import { ControlModule } from "../control-module/control.module";
import { GraphicsModule } from "../graphics-module/graphics.module";
import { ObjectMarkerComponent } from './components/object-marker/object-marker.component';

@NgModule({
  imports: [CommonModule, GraphicsModule, ControlModule],
  declarations: [SolarSystemComponent, ObjectMarkerComponent],
  exports: []
})
export class ViewModule {}
