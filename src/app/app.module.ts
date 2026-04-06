import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import {DashboardComponent} from "./DashBoard/dashBoard.component";
import {NgChartsModule} from "ng2-charts";
import {HttpClientModule} from "@angular/common/http";
import {registerLocaleData} from "@angular/common";
import localeVi from '@angular/common/locales/vi';

registerLocaleData(localeVi);
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    NgChartsModule,
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'vi-VN' }
  ],
  bootstrap: [DashboardComponent]
})
export class AppModule { }
