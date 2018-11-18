import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SolarSystemComponent } from "./view-module/solar-system/solar-system.component";

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
