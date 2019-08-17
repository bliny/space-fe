import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from "@angular/core";
import { MarkerInfo } from "../components/object-marker/marker-info";
import { SolarSystemResource } from "../../graphics-module/resolvers/solar-system-resource-resolver";
import { ActivatedRoute } from "@angular/router";
import { UserInterfaceService } from "../user-interface/user-interface.service";

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

  testMarkerInfo: MarkerInfo;

  constructor(
    private route: ActivatedRoute,
    private userInterfaceService: UserInterfaceService
  ) {
    this.testMarkerInfo = new MarkerInfo();
    this.testMarkerInfo.height = 20;
    this.testMarkerInfo.width = 20;
    // this.testMarkerInfo.positionX = 200;
    //this.testMarkerInfo.positionY = 200;
  }

  ngOnInit() {}

  test(event) {
    console.log("yee");
    event.stopPropagation();
  }


}
