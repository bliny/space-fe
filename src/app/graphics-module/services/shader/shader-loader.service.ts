import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: "root"
})
export class ShaderLoaderService {
  base = "./assets/shaders/";

  constructor(private http: HttpClient) {}

  public loadShader(shaderName: string): Observable<string> {
    return this.http.get(this.base + shaderName + ".glsl", {
      responseType: "text"
    });
  }
}
