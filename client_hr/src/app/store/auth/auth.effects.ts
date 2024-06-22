import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, tap } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { AuthActions } from './auth.actions';
import { FlashMessageService } from 'src/app/services/flash-message.service';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private flashMessageService: FlashMessageService
  ) {}

  //listen on the login action, tigger AuthService.login to verify user
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(action =>
        this.authService.login(action.email, action.password).pipe(
          map(response => AuthActions.loginsuccess({ token: response.token})),
          catchError(error => of(AuthActions.loginfailure({ error: error })).pipe(
            tap(()=>{ this.flashMessageService.show('Invalid credential, please try again.'); })
          ))
        )
      )
    )
  );
}