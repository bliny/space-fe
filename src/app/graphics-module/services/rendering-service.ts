import { ElementRef, Inject, Injectable } from "@angular/core";
import * as THREE from "three";
import { BehaviorSubject, Observable } from "rxjs";

export class RenderingSize {
  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

@Injectable({
  providedIn: "root"
})
export class RenderingService {
  private readonly renderer: BehaviorSubject<THREE.WebGLRenderer>;
  private readonly renderingSize: BehaviorSubject<RenderingSize>;

  constructor(@Inject("Window") private window: Window) {
    this.renderer = new BehaviorSubject<THREE.WebGLRenderer>(null);
    this.renderingSize = new BehaviorSubject<RenderingSize>(
      new RenderingSize(window.innerWidth, window.innerHeight)
    );
  }

  public init(canvasRef: ElementRef) {
    const newRenderer = new THREE.WebGLRenderer({
      canvas: canvasRef.nativeElement,
      antialias: true,
      logarithmicDepthBuffer: true,
      alpha: true
    });
    newRenderer.setSize(
      this.renderingSize.getValue().width,
      this.renderingSize.getValue().height
    );
    newRenderer.shadowMap.enabled = true;
    newRenderer.autoClear = false;
    newRenderer.setClearColor(0x000000, 1.0);
    //canvasRef.nativeElement.appendChild( newRenderer.domElement );
    this.renderer.next(newRenderer);
  }

  resize() {}

  getRenderer(): Observable<THREE.WebGLRenderer> {
    return this.renderer.asObservable();
  }

  getRenderingSize(): Observable<RenderingSize> {
    return this.renderingSize.asObservable();
  }
}
