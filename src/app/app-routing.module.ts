import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SolarSystemComponent } from "./view-module/solar-system/solar-system.component";
import { RenderingBaseComponent } from "./graphics-module/rendering/rendering-base/rendering-base.component";
import { SolarSystemRenderingComponent } from "./graphics-module/rendering/solar-system-rendering/solar-system-rendering.component";
import { SolarSystemResourceResolver } from "./graphics-module/rendering/solar-system-rendering/resolver/solar-system-resource-resolver";

const routes: Routes = [
  {
    path: "",
    component: SolarSystemComponent,
    resolve: { data: SolarSystemResourceResolver }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
