import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: "root"
})
export class UserInterfaceService {
  //selectedObjectInRenderer = new BehaviorSubject<SolarSystemObject>(null);

  constructor() {}

  /*
  setSelectedObjectInRenderer(object: Object) {
    this.selectedObjectInRenderer.next(object);
  }

  $subscribeObjectSelection(): Observable<SolarSystemObject> {
    return this.selectedObjectInRenderer.asObservable();
  }
  */
}
