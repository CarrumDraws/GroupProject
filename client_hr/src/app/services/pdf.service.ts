import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
  }

  async getPdfPageAsImage(pdfUrl: string, pageNumber: number): Promise<string | null> {
    try {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = { canvasContext: context, viewport: viewport };
      await page.render(renderContext).promise;
      return canvas.toDataURL('image/jpeg');
    } catch (error) {
      console.error('Error rendering PDF page', error);
      return null;
    }
  }
}