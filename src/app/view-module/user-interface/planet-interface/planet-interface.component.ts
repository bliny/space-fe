import { Component, OnInit } from "@angular/core";
import { PlanetService } from "../../../control-module/services/planet-service";

@Component({
  selector: "planet-interface",
  templateUrl: "./planet-interface.component.html",
  styleUrls: ["./planet-interface.component.scss"]
})
export class PlanetInterfaceComponent implements OnInit {
  constructor(private planetService: PlanetService) {}

  ngOnInit() {}
}
