import { ViewModule } from "../view.module";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { SolarSystemObject } from "../../graphics-module/rendering/solar-system-rendering/solar-system.object";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: "root"
})
export class UserInterfaceService {
  selectedObjectInRenderer = new BehaviorSubject<SolarSystemObject>(null);

  constructor() {}

  setSelectedObjectInRenderer(object: SolarSystemObject) {
    this.selectedObjectInRenderer.next(object);
  }

  $subscribeObjectSelection(): Observable<SolarSystemObject> {
    return this.selectedObjectInRenderer.asObservable();
  }
}
