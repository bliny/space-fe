import { Component, OnInit } from "@angular/core";

@Component({
  selector: "solar-system-control",
  templateUrl: "./solar-system-control.component.html",
  styleUrls: ["./solar-system-control.component.scss"]
})
export class SolarSystemControlComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  test() {
    console.log("controll");
  }
}
