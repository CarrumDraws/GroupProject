import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent{

  feedbackText: string = '';

  constructor(
    public dialogRef: MatDialogRef<FeedbackComponent>,
    private http: HttpClient
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitFeedback(): void {
    // Make API call using HttpClient
    this.http.post('https://our-link-to-api-call', { feedback: this.feedbackText })
      .subscribe(response => {
        console.log('Feedback submitted successfully:', response);
        this.closeDialog();
      }, error => {
        console.error('Error submitting feedback:', error);
        // Handle error if needed
      });
  }

}
