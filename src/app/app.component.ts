import { Component, Inject, OnInit, Renderer2, ViewChild } from "@angular/core";
import * as THREE from "three";
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  @ViewChild("webGL")
  webGL;

  constructor() {}

  public ngOnInit() {}
}
