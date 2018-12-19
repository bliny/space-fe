import { ElementRef, Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { WebGLRenderer } from "three-full";

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
  private readonly renderer: BehaviorSubject<WebGLRenderer>;
  private readonly renderingSize: BehaviorSubject<RenderingSize>;

  constructor(@Inject("Window") private window: Window) {
    this.renderer = new BehaviorSubject<WebGLRenderer>(null);
    this.renderingSize = new BehaviorSubject<RenderingSize>(
      new RenderingSize(window.innerWidth, window.innerHeight)
    );
  }

  public init(canvasRef: ElementRef) {
    const newRenderer = new WebGLRenderer({
      canvas: canvasRef.nativeElement,
      antialias: true,
      logarithmicDepthBuffer: true
      //alpha: true
    });
    newRenderer.setSize(
      this.renderingSize.getValue().width,
      this.renderingSize.getValue().height
    );
    newRenderer.shadowMap.enabled = true;
    newRenderer.autoClear = false;
    newRenderer.setClearColor(0x000000);
    //canvasRef.nativeElement.appendChild( newRenderer.domElement );
    this.renderer.next(newRenderer);
  }

  resize() {}

  getRenderer(): Observable<WebGLRenderer> {
    console.log(this.renderer.getValue());
    return this.renderer.asObservable();
  }

  getRenderingSize(): Observable<RenderingSize> {
    return this.renderingSize.asObservable();
  }
}
