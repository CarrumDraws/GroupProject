import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeComponent } from './components/employee/employee.component';
import { VisaComponent } from './components/visa/visa.component';
import { HiringComponent } from './components/hiring/hiring.component';
import { HousingComponent } from './components/housing/housing.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  
  {path: '', component: LoginComponent},
  {path: 'employee', component: EmployeeComponent},
  {path: 'visa', component: VisaComponent},
  {path: 'hiring', component: HiringComponent},
  {path: 'housing', component: HousingComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
