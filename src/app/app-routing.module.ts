import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SolarSystemComponent } from "./view-module/solar-system/solar-system.component";
import { SolarSystemResourceResolver } from "./graphics-module/resolvers/solar-system-resource-resolver";
import {BattleFieldComponent} from './view-module/battle-field/battle-field.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'battle-field/1',
    pathMatch: 'full'
  },
  {
    path: 'battle-field/:id',
    component: BattleFieldComponent,
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
