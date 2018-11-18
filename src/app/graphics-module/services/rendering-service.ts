import { ElementRef, Inject, Injectable } from "@angular/core";
import * as THREE from "three";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class RenderingService {
  private readonly renderer: BehaviorSubject<THREE.WebGLRenderer>;

  width;
  height;

  constructor(@Inject("Window") private window: Window) {
    this.renderer = new BehaviorSubject<THREE.WebGLRenderer>(null);

    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  public init(canvasRef: ElementRef) {
    console.log(canvasRef);
    const newRenderer = new THREE.WebGLRenderer({
      canvas: canvasRef.nativeElement,
      antialias: true
    });
    newRenderer.setSize(this.width, this.height);
    newRenderer.shadowMap.enabled = true;
    //canvasRef.nativeElement.appendChild( newRenderer.domElement );
    this.renderer.next(newRenderer);
  }

  resize() {}

  getRenderer(): Observable<THREE.WebGLRenderer> {
    return this.renderer.asObservable();
  }
}
