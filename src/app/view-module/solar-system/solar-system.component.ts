import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from "@angular/core";
import { SolarSystemObject } from "../../graphics-module/rendering/solar-system-rendering/solar-system.object";

@Component({
  selector: "solar-system-view",
  templateUrl: "./solar-system.component.html",
  styleUrls: ["./solar-system.component.scss"]
})
export class SolarSystemComponent implements OnInit {
  @ViewChild("button1")
  button: ElementRef;
  positionX = 0;
  positionY = 0;

  constructor() {}

  ngOnInit() {}

  test(event) {
    console.log("yee");
    event.stopPropagation();
  }

  clickEvent(event: SolarSystemObject) {
    console.log(event);
    this.positionX = event.clickPositionX;
    this.positionY = event.clickPositionY;
  }
}
