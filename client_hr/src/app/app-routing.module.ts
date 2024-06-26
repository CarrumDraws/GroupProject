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
import { FileComponent } from './components/file/file.component';
import { HouseProfileComponent } from './components/house-profile/house-profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CommentComponent } from './components/comment/comment.component';

const routes: Routes = [
  
  {path: '', component: LoginComponent},
  {path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard]},
  {path: 'visa', component: VisaComponent, canActivate: [AuthGuard]},
  {path: 'hiring', component: HiringComponent, canActivate: [AuthGuard]},
  {path: 'housing', component: HousingComponent, canActivate: [AuthGuard]},
  {path: 'application/:employeeId', component: ApplicationComponent, canActivate: [AuthGuard]},
  {path: 'profile/:employeeId', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'file', component: FileComponent, canActivate: [AuthGuard] },
  {path: 'housing/:houseId', component: HouseProfileComponent, canActivate: [AuthGuard]},
  {path: 'comment/:reportId', component: CommentComponent , canActivate: [AuthGuard]},
   // Catch-all route, redirect unmatched routes to the home page
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
