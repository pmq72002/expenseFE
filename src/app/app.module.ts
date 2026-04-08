import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import {DashboardComponent} from "./DashBoard/dashBoard.component";
import {NgChartsModule} from "ng2-charts";
import {HttpClientModule} from "@angular/common/http";
import {registerLocaleData} from "@angular/common";
import localeVi from '@angular/common/locales/vi';
import {RouterModule, Routes} from "@angular/router";
import {BudgetComponent} from "./Budget/budget.component";
import {FormsModule} from "@angular/forms";
import {AppComponent} from "./app.component";

registerLocaleData(localeVi);

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'budget', component: BudgetComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BudgetComponent
  ],
  imports: [
    BrowserModule,
    NgChartsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'vi-VN' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
