import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from "@angular/core";
import { RenderingService } from "../../services/rendering-service";

@Component({
  selector: "rendering-base",
  templateUrl: "./rendering-base.component.html",
  styleUrls: ["./rendering-base.component.scss"]
})
export class RenderingBaseComponent implements OnInit, AfterViewInit {
  @ViewChild("webGl")
  webGL: ElementRef;

  constructor(private renderingService: RenderingService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.renderingService.init(this.webGL);
    // this returns null
  }
}
