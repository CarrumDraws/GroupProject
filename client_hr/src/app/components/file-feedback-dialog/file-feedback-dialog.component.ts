import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlashMessageService } from 'src/app/services/flash-message.service';
import { environment } from 'src/environments/environment';
import { File } from 'src/app/interface/file';

@Component({
  selector: 'app-file-feedback-dialog',
  templateUrl: './file-feedback-dialog.component.html',
  styleUrls: ['./file-feedback-dialog.component.css']
})
export class FileFeedbackDialogComponent{

  feedbackText: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { file: File },
    public dialogRef: MatDialogRef<FileFeedbackDialogComponent>,
    private http: HttpClient,
    private flashMessageSerivce: FlashMessageService
  ) {}
  closeDialog(): void {
    this.dialogRef.close();
  }

  submitFileFeedback(): void{

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    // Make API call using HttpClient
    this.http.patch(`${environment.serverUrl}/opt/${this.data.file._id}`, { feedback: this.feedbackText, action: "Rejected"}, { headers })
      .subscribe(response => {
        this.closeDialog();
        this.flashMessageSerivce.info("Feedback submitted successfully");
      }, error => {
        console.error('Error submitting feedback:', error);
      });
  
  }
}
