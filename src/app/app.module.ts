import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { ViewModule } from "./view-module/view.module";
import { GraphicsModule } from "./graphics-module/graphics.module";
import {ControlModule} from './control-module/control.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ViewModule, GraphicsModule, ControlModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
