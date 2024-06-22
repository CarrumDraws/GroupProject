import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {

  constructor(private snackBar: MatSnackBar) { }

  show(message: string, duration: number = 3000) {
    const config: MatSnackBarConfig = {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: []
    };
    this.snackBar.open(message, 'Close', config);
  }
}