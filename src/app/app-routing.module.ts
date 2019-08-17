import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SolarSystemComponent } from "./view-module/solar-system/solar-system.component";
import { SolarSystemResourceResolver } from "./graphics-module/resolvers/solar-system-resource-resolver";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'solar-system/1',
    pathMatch: 'full'
  },
  {
    path: 'solar-system/:id',
    component: SolarSystemComponent,
    resolve: { solarSystemResources: SolarSystemResourceResolver }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
