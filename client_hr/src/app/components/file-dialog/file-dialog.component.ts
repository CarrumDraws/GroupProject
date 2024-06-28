import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FileFeedbackDialogComponent } from '../file-feedback-dialog/file-feedback-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FlashMessageService } from 'src/app/services/flash-message.service';
import { File } from 'src/app/interface/file';

@Component({
  selector: 'app-file-dialog',
  templateUrl: './file-dialog.component.html',
  styleUrls: ['./file-dialog.component.css']
})
export class FileDialogComponent{
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { file: File, download: boolean},
    private dialog: MatDialog,
    private http: HttpClient,
    private flashMessageService: FlashMessageService
  ) {}

  approve(){
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    // Make API call using HttpClient
    this.http.patch(`${environment.serverUrl}/opt/${this.data.file._id}`, { feedback: "", action: "Approved"}, { headers })
      .subscribe( ( _ : any) => { 
        this.flashMessageService.info('Application has been approved!');
      });
  }

  openFeedbackDialog(): void {

    const feedbackDialogRef = this.dialog.open(FileFeedbackDialogComponent, {
      width: '400px',
      data: {
        file: this.data.file
      }
    });

    feedbackDialogRef.afterClosed().subscribe(result => {
      console.log('The feedback dialog was closed');
    });
  }

  downloadFile(): void {
    const link = document.createElement('a');
    link.href = this.data.file.url;
    link.download = this.data.file.url.split('?')[0].split('/').pop() || 'download'; // Extract the filename from the URL
    link.target = '_blank'; // Optional: open in a new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}