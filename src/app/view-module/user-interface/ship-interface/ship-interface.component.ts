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
import {ControlService} from '../../../control-module/service/controll.service';

@Component({
  selector: "ship-interface",
  templateUrl: "./ship-interface.component.html",
  styleUrls: ["./ship-interface.component.scss"]
})
export class ShipInterfaceComponent implements OnInit, OnChanges {

  @Input()
  shipInfo: ShipInfo;

  constructor(private shipService: ShipService, private controlService: ControlService) {}

  ngOnInit() {
    console.log('ship')
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }


  focus(){
    this.controlService.setFocusObject(this.shipInfo.id);
  }
}
