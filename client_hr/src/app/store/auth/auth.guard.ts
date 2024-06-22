import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectToken } from './auth.selectors';
import { AuthState } from 'src/app/interface/auth';
import { FlashMessageService } from 'src/app/services/flash-message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    FlashMessageService: any;

    constructor(
        private store: Store<AuthState>, 
        private router: Router,
        private flashMessageService: FlashMessageService
    ) {}
  
    // Redirect to login page if not authenticated
    canActivate(): Observable<boolean> {
      return this.store.select(selectToken).pipe(
        map(token => {
          if (token !== null) {
            return true;
          } else {
            this.router.navigate(['/']);
            this.flashMessageService.show('Please Login');
            return false;
          }
        })
      );
    }
  }