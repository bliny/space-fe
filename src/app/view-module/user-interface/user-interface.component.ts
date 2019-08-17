import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {UserInterfaceService} from "./user-interface.service";
import {SpaceObjectType} from "../../base-module/services/domail/SpaceObject";
import {GameObject} from '../../graphics-module/rendering/solar-system-rendering/solar-system.object';
import {ControlService} from '../../control-module/service/controll.service';


@Component({
  selector: "user-interface",
  templateUrl: "./user-interface.component.html",
  styleUrls: ["./user-interface.component.scss"]
})
export class UserInterfaceComponent implements OnInit {

  gameObject: GameObject;

  constructor(private controlService: ControlService,
  private changeDetectod: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.controlService
      .$subscribeClickedOnGameObject()
      .subscribe((selecteObject: GameObject) => {
        this.gameObject = selecteObject;
        console.log(selecteObject);
        this.changeDetectod.detectChanges();
      });

  }

  isPlanetSelected(): boolean {
    //console.log(this.gameObject && this.gameObject.selectedObject.type === SpaceObjectType.PLANET);
    return this.gameObject && this.gameObject.selectedObject.type === SpaceObjectType.PLANET;
  }

  isShipSelected(): boolean {
    return this.gameObject && this.gameObject.selectedObject.type === SpaceObjectType.SHIP;
  }

}
