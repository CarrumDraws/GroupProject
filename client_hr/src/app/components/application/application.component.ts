// import { Component, Input, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Router } from '@angular/router';
// import { FeedbackComponent } from '../feedback/feedback.component';
// import { MatDialog } from '@angular/material/dialog';
// import { onboardingDummyData } from '../dummyData';
// import { FileService } from 'src/app/services/file.service';
// import { Observable, map } from 'rxjs';
// import { OnboardingService } from 'src/app/services/onboarding.service';
// import { ApplicationDetail } from 'src/app/interface/applicationDetail';

// @Component({
//   selector: 'app-application',
//   templateUrl: './application.component.html',
//   styleUrls: ['./application.component.css']
// })
// export class ApplicationComponent implements OnInit {

//   employeeId: number = this.route.snapshot.params['employeeId'];
//   application: ApplicationDetail | null = null; 

//   constructor(
//     private route: ActivatedRoute,
//     public dialog: MatDialog,
//     private fileService: FileService,
//     private onboardingService: OnboardingService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     this.onboardingService.getApplicationById(this.employeeId).subscribe({
//       next: (data) => {
//         if(data == null){
//           this.router.navigate(['/employee']);
//         }
//         this.application = data;
//       },
//       error: (error) => {
//         console.error('Error fetching application details', error);
//       }
//     });
//   }


//   viewFile(fileKey: string): void {
//     this.fileService.getFileUrl(fileKey).pipe(
//       map((response: any) => {
//         window.open(response.url);
//       })
//     ).subscribe();
//   }

//   openFeedbackDialog(): void {
//     const dialogRef = this.dialog.open(FeedbackComponent, {
//       width: '400px'
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The feedback dialog was closed');
//     });
//   }

// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';
import { FileService } from 'src/app/services/file.service';
import { OnboardingService } from 'src/app/services/onboarding.service';
import { ApplicationDetail } from 'src/app/interface/applicationDetail';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FlashMessageService } from 'src/app/services/flash-message.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  employeeId: number = this.route.snapshot.params['employeeId'];
  application$: Observable<ApplicationDetail | null>;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fileService: FileService,
    private onboardingService: OnboardingService,
    private router: Router,
    private flashMessageService: FlashMessageService 
  ) {
    this.application$ = this.onboardingService.getApplicationById(this.employeeId).pipe(
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

  openFeedbackDialog(): void {
    const dialogRef = this.dialog.open(FeedbackComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The feedback dialog was closed');
    });
  }

}