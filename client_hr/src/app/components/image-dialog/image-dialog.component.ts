import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FeedbackComponent } from '../feedback/feedback.component';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string },
    private dialogRef: MatDialogRef<ImageDialogComponent>,
    private dialog: MatDialog
  ) {}

  test(){
    console.log('test');
  }

  openFeedbackDialog(): void {
    const feedbackDialogRef = this.dialog.open(FeedbackComponent, {
      width: '400px'
    });

    feedbackDialogRef.afterClosed().subscribe(result => {
      console.log('The feedback dialog was closed');
    });
  }
}