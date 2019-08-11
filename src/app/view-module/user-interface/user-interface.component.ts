import { Component, OnInit } from "@angular/core";
import { UserInterfaceService } from "./user-interface.service";
import { SolarSystemObject } from "../../graphics-module/rendering/solar-system-rendering/solar-system.object";
import { SpaceObjectType } from "../../control-module/domail/SpaceObject";

@Component({
  selector: "user-interface",
  templateUrl: "./user-interface.component.html",
  styleUrls: ["./user-interface.component.scss"]
})
export class UserInterfaceComponent implements OnInit {
  selectedObject: SolarSystemObject;

  constructor(private userInterfaceService: UserInterfaceService) {}

  ngOnInit() {
    this.userInterfaceService
      .$subscribeObjectSelection()
      .subscribe(selecteObject => (this.selectedObject = selecteObject));
  }

  isShipSelected() {
    return (
      this.selectedObject && this.selectedObject.type === SpaceObjectType.SHIP
    );
  }
}
