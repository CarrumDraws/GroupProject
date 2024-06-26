import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { FlashMessageService } from 'src/app/services/flash-message.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent{

  feedbackText: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: number },
    public dialogRef: MatDialogRef<FeedbackComponent>,
    private http: HttpClient,
    private flashMessageSerivce: FlashMessageService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitFeedback(): void {

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    
    // Make API call using HttpClient
    this.http.put(`${environment.serverUrl}/onboarding/${this.data.employeeId}`, { feedback: this.feedbackText, action: "Rejected"}, { headers })
      .subscribe(response => {
        console.log(`Feedback submitted successfully: ${this.data.employeeId}`, response);
        this.flashMessageSerivce.info("Feedback submitted successfully");
        this.closeDialog();
      }, error => {
        console.error('Error submitting feedback:', error);
        // Handle error if needed
      });
  }

}
