import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";
import { SolarSystemObject } from "../../../graphics-module/rendering/solar-system-rendering/solar-system.object";
import {
  ShipInfo,
  ShipService
} from "../../../control-module/services/ship-service";

@Component({
  selector: "ship-interface",
  templateUrl: "./ship-interface.component.html",
  styleUrls: ["./ship-interface.component.scss"]
})
export class ShipInterfaceComponent implements OnInit, OnChanges {
  @Input()
  selectedShip: SolarSystemObject;

  shipInfo: ShipInfo;

  constructor(private shipService: ShipService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
