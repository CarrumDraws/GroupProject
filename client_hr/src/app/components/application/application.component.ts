import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';
import { onboardingDummyData } from '../dummyData';
import { FileService } from 'src/app/services/file.service';
import { Observable, map } from 'rxjs';
import { OnboardingService } from 'src/app/services/onboarding.service';
import { ApplicationDetail } from 'src/app/interface/applicationDetail';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  employeeId: number = this.route.snapshot.params['employeeId'];
  application: ApplicationDetail | null = null; 

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fileService: FileService,
    private onboardingService: OnboardingService
  ) { }

  ngOnInit(): void {
    this.onboardingService.getApplicationById(this.employeeId).subscribe({
      next: (data) => {
        this.application = data;
      },
      error: (error) => {
        console.error('Error fetching application details', error);
      }
    });
  }


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
