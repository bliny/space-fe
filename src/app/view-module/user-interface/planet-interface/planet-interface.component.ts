import {Component, Input, OnInit} from "@angular/core";
import {PlanetInfo, PlanetService} from "../../../base-module/services/planet-service";
import {ControlService} from '../../../control-module/service/controll.service';

@Component({
  selector: "planet-interface",
  templateUrl: "./planet-interface.component.html",
  styleUrls: ["./planet-interface.component.scss"]
})
export class PlanetInterfaceComponent implements OnInit {

  @Input()
  planetInfo: PlanetInfo;


  constructor(private planetService: PlanetService, private controlService: ControlService) {}

  ngOnInit() {
    console.log('planet')
  }

  focus(){
    this.controlService.focusObject.next(this.planetInfo.id);
  }
}
