// pdf-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-dialog',
  template: `
    <h1 mat-dialog-title>PDF Viewer</h1>
    <div mat-dialog-content>
      <embed [src]="data.pdfUrl" type="application/pdf" width="100%" height="600px" />
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </div>
  `
})
export class PdfDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { pdfUrl: string }) {}
}