import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//component
import { EmployeeComponent } from './components/employee/employee.component';
import { VisaComponent } from './components/visa/visa.component';
import { HiringComponent } from './components/hiring/hiring.component';
import { HousingComponent } from './components/housing/housing.component';
import { LoginComponent } from './components/login/login.component';
import { ApplicationComponent } from './components/application/application.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
//NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';

//Material UI
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule} from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule} from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ProfileComponent } from './components/profile/profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import { FileComponent } from './components/file/file.component';
import { ImageDialogComponent } from './components/image-dialog/image-dialog.component';
import { FilterComponent } from './components/filter/filter.component';
import { FileDialogComponent } from './components/file-dialog/file-dialog.component';
import { FileFeedbackDialogComponent } from './components/file-feedback-dialog/file-feedback-dialog.component';
import { MatIconModule } from '@angular/material/icon';


import { PdfDialogComponent } from './components/pdf-dialog/pdf-dialog.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { PdfService } from './services/pdf.service';
import { SafeUrlPipe } from './pipe/safe-url.pipe';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    StoreModule.forRoot({ auth: AuthReducer}),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],

  declarations: [
    AppComponent,
    EmployeeComponent,
    VisaComponent,
    HiringComponent,
    HousingComponent,
    LoginComponent,
    ApplicationComponent,
    FeedbackComponent,
    ProfileComponent,
    FileComponent,
    ImageDialogComponent,
    FilterComponent,
    FileDialogComponent,
    FileFeedbackDialogComponent,
    PdfDialogComponent,
    PdfViewerComponent,
    SafeUrlPipe
  ],

  providers: [PdfService],
  bootstrap: [AppComponent]
})
export class AppModule { }
