import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { ViewModule } from "./view-module/view.module";
import { GraphicsModule } from "./graphics-module/graphics.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, ViewModule, GraphicsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
