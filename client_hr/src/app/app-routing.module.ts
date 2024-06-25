import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeComponent } from './components/employee/employee.component';
import { VisaComponent } from './components/visa/visa.component';
import { HiringComponent } from './components/hiring/hiring.component';
import { HousingComponent } from './components/housing/housing.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './store/auth/auth.guard';
import { ApplicationComponent } from './components/application/application.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  
  {path: '', component: LoginComponent},
  {path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard]},
  {path: 'visa', component: VisaComponent, canActivate: [AuthGuard]},
  {path: 'hiring', component: HiringComponent, canActivate: [AuthGuard]},
  {path: 'housing', component: HousingComponent, canActivate: [AuthGuard]},
  {path: 'application/:employeeId', component: ApplicationComponent, canActivate: [AuthGuard]},
  {path: 'profile/:employeeId', component: ProfileComponent, canActivate: [AuthGuard]},
   // Catch-all route, redirect unmatched routes to the home page
  { path: '**', redirectTo: '' }, // Or display a 404 component

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
