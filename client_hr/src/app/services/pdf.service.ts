import { Injectable } from '@angular/core';
import WebViewer from '@pdftron/webviewer';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private webViewerInstance: any;

  constructor() {}

  initializeWebViewer(viewerElement: HTMLElement): Promise<void> {
    return WebViewer({
      path: 'https://cdn.pdftron.com/webviewer/latest',
    }, viewerElement).then(instance => {
      this.webViewerInstance = instance;
    });
  }

  async getFirstPageAsImage(url: string): Promise<string | null> {
    if (!this.webViewerInstance) {
      throw new Error('WebViewer is not initialized.');
    }

    try {
      const doc = await this.webViewerInstance.loadDocument(url);
      const pageNumber = 1;
      const page = await doc.loadPage(pageNumber);

      // Render the page to an HTML5 canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const viewport = page.getViewport({ scale: 1.0 });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Convert canvas to base64 image
      const imageData = canvas.toDataURL('image/png');

      return imageData;
    } catch (error) {
      console.error('Error fetching PDF or rendering page', error);
      return null;
    }
  }
}