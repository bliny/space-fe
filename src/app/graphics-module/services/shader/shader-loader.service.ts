import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import {flatMap} from 'tslint/lib/utils';

export class GLSLShader{
  vertexShader: string;
  fragmentShader: string;


  constructor(vertexShader: string, fragmentShader: string) {
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
  }
}

@Injectable({
  providedIn: "root"
})
export class ShaderLoaderService {
  base = "./assets/shaders/";

  constructor(private http: HttpClient) {}

  public loadShaders(vertexShaderName: string, fragmentShaderName: string): Observable<GLSLShader> {
    return new Observable<GLSLShader>( observable => {
      this.loadShader(vertexShaderName).subscribe(vertexShader => {
        this.loadShader(fragmentShaderName).subscribe( fragmentShader =>{
          const shaders = new GLSLShader(vertexShader, fragmentShader);
          observable.next(shaders);
          observable.complete();
        }, error => {
          observable.error(error);
        })
      }, error => {
        observable.error(error);
      });
    });
  }

  private loadShader(shaderName): Observable<string>{
    //TODO add cache
    return this.http.get(this.base + shaderName + ".glsl", {
      responseType: "text"
    });
  }
}
