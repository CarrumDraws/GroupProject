import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { File } from 'src/app/interface/file';
import { environment } from 'src/environments/environment';
import { FlashMessageService } from 'src/app/services/flash-message.service';
import { FileFeedbackDialogComponent } from '../file-feedback-dialog/file-feedback-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent {

  constructor(
    private http: HttpClient,
    private flashMessageService: FlashMessageService,
    private dialog: MatDialog
  ) {}

  @Input() pdf: File | null = null;
  isVisible: boolean = false;
  pdfUrl: string = "";

  open(pdf: File): void {
    this.pdfUrl = pdf.url;
    this.pdf = pdf;
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }

  approve(){
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    // Make API call using HttpClient
    this.http.patch(`${environment.serverUrl}/opt/${this.pdf!._id}`, { feedback: "", action: "Approved"}, { headers })
      .subscribe( ( _ : any) => { 
        this.flashMessageService.info('Application has been approved!');
      });
  }

  openFeedbackDialog(): void {

    const feedbackDialogRef = this.dialog.open(FileFeedbackDialogComponent, {
      width: '400px',
      data: {
        file: this.pdf
      }
    });

    feedbackDialogRef.afterClosed().subscribe(result => {
      console.log('The feedback dialog was closed');
    });
  }
}