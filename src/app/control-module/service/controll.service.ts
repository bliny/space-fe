import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/index';
import {GameObject} from '../../graphics-module/rendering/solar-system-rendering/solar-system.object';
/**
 * Created by FaNaT-Laptop on 2019. 08. 17..
 */

@Injectable({
  providedIn: "root"
})
export class ControlService{

  clickedOnObjectSubject = new BehaviorSubject<GameObject>(null);
  moveObject = new BehaviorSubject<string>(null);
  focusObject = new BehaviorSubject<string>(null);

  setClickedOnGameObject(gameObject: GameObject){
    this.clickedOnObjectSubject.next(gameObject);
  }

  setMoveObject(objectId: string ){
    this.moveObject.next(objectId);
  }

  setFocusObject(objectId: string ){
    this.focusObject.next(objectId);
  }

  $subscribeClickedOnGameObject(): Observable<GameObject>{
    return this.clickedOnObjectSubject.asObservable();
  }

  $subscribeMoveObject(): Observable<string>{
    return this.moveObject.asObservable();
  }

  $subscribeFocusObject(): Observable<string>{
    return this.focusObject.asObservable();
  }



}
