import { Component, HostListener, OnInit } from "@angular/core";

@Component({
  selector: "solar-system-view",
  templateUrl: "./solar-system.component.html",
  styleUrls: ["./solar-system.component.scss"]
})
export class SolarSystemComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  test(event) {
    console.log("yee");
    event.stopPropagation();
  }
}
