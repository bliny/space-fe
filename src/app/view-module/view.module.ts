import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SolarSystemComponent } from "./solar-system/solar-system.component";
import { ControlModule } from "../control-module/control.module";
import { GraphicsModule } from "../graphics-module/graphics.module";
import { ObjectMarkerComponent } from "./components/object-marker/object-marker.component";
import { UserInterfaceComponent } from "./user-interface/user-interface.component";
import { ShipInterfaceComponent } from "./user-interface/ship-interface/ship-interface.component";
import { PlanetInterfaceComponent } from "./user-interface/planet-interface/planet-interface.component";
import { BattleFieldComponent } from './battle-field/battle-field.component';

@NgModule({
  imports: [CommonModule, GraphicsModule, ControlModule],
  declarations: [
    SolarSystemComponent,
    ObjectMarkerComponent,
    UserInterfaceComponent,
    ShipInterfaceComponent,
    PlanetInterfaceComponent,
    BattleFieldComponent
  ],
  exports: []
})
export class ViewModule {}
