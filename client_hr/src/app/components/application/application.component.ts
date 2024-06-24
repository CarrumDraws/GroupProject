import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  employeeId: number = this.route.snapshot.params['employeeId'];

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

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
