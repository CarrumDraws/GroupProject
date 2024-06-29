import { Component, OnInit, Input } from '@angular/core';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.css']
})
export class PdfPreviewComponent implements OnInit {
  @Input() pdfUrl: string = '';
  firstPageImage: string | null = null;

  constructor(private pdfService: PdfService) {}

  ngOnInit() {
    this.loadFirstPageImage();
  }

  async loadFirstPageImage() {
    if (this.pdfUrl) {
      this.firstPageImage = await this.pdfService.getPdfPageAsImage(this.pdfUrl, 1);
    }
  }
}