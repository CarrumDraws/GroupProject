import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';
import { onboardingDummyData } from '../dummyData';
import { FileService } from 'src/app/services/file.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  employeeId: number = this.route.snapshot.params['employeeId'];
  application = onboardingDummyData;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    console.log(this.application);
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
