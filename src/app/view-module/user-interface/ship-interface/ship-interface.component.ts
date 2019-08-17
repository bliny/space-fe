import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";
import {
  ShipInfo,
  ShipService
} from "../../../base-module/services/ship-service";

@Component({
  selector: "ship-interface",
  templateUrl: "./ship-interface.component.html",
  styleUrls: ["./ship-interface.component.scss"]
})
export class ShipInterfaceComponent implements OnInit, OnChanges {

  shipInfo: ShipInfo;

  constructor(private shipService: ShipService) {}

  ngOnInit() {
    console.log('ship')
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
