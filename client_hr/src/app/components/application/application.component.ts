import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';
import { FileService } from 'src/app/services/file.service';
import { OnboardingService } from 'src/app/services/onboarding.service';
import { ApplicationDetail } from 'src/app/interface/applicationDetail';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FlashMessageService } from 'src/app/services/flash-message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {
  @ViewChild('pdfViewer') pdfViewer!: PdfViewerComponent;

  employeeId: number = this.route.snapshot.params['employeeId'];
  application$: Observable<ApplicationDetail | null>;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fileService: FileService,
    private onboardingService: OnboardingService,
    private router: Router,
    private flashMessageService: FlashMessageService ,
    private http: HttpClient
  ) {
    this.application$ = this.onboardingService.getApplicationById(this.employeeId).pipe(
      tap((response: ApplicationDetail)=>{ console.log(response.status)}),
      map((data: ApplicationDetail | null) => {
        if (data === null) {
          this.router.navigate(['/employee']);
        }
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching application details', error);
        this.flashMessageService.warn("Invalid Employee ID")
        this.router.navigate(['/employee']);
        return of(null);
      })
    );
  }

  ngOnInit(): void {}

  viewFile(fileKey: string): void {
    this.fileService.getFileUrl(fileKey).pipe(
      map((response: any) => {
        window.open(response.url);
      })
    ).subscribe();
  }

  approved(){
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    
    // Make API call using HttpClient
    this.http.put(`${environment.serverUrl}/onboarding/${this.employeeId}`, { feedback: "", action: "Approved"}, { headers })
      .subscribe( ( _ : any) => { this.flashMessageService.info('Application has been approved!'); });
  }

  openFeedbackDialog(employeeId: number): void {
    const dialogRef = this.dialog.open(FeedbackComponent, {
      width: '400px',
      data : {employeeId: employeeId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The feedback dialog was closed');
    });
  }

  viewLicense(fileId: string){

    this.fileService.getFileUrl(fileId).subscribe(next => {
      let license = next;
      license.fileType = 'license'
      this.pdfViewer.open(license);
    })

  }

}