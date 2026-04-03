import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import {DashboardComponent} from "./DashBoard/dashBoard.component";
import {NgChartsModule} from "ng2-charts";

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class AppModule { }
