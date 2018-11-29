import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SolarSystemComponent } from "./view-module/solar-system/solar-system.component";
import { RenderingBaseComponent } from "./graphics-module/rendering/rendering-base/rendering-base.component";
import { SolarSystemRenderingComponent } from "./graphics-module/rendering/solar-system-rendering/solar-system-rendering.component";

const routes: Routes = [
  {
    path: "",
    component: SolarSystemComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
