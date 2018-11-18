import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SolarSystemControlComponent } from "./solar-system-control/solar-system-control.component";

@NgModule({
  imports: [CommonModule],
  declarations: [SolarSystemControlComponent],
  exports: [SolarSystemControlComponent]
})
export class ControlModule {}
