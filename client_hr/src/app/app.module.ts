import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { VisaComponent } from './components/visa/visa.component';
import { HiringComponent } from './components/hiring/hiring.component';
import { HousingComponent } from './components/housing/housing.component';
import { LoginComponent } from './components/login/login.component';

//Material UI
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatButtonModule
  ],

  declarations: [
    AppComponent,
    EmployeeComponent,
    VisaComponent,
    HiringComponent,
    HousingComponent,
    LoginComponent
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
