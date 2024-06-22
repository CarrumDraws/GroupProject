import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private router: Router) { }

  login(username: string, password: string): Observable<any> {
    // Save it for later, need API call to the backend

      // return this.http.post<any>(`${this.authUrl}/login`, { username, password })
      //   .pipe(
      //     tap(response => this.setSession(response)),
      //     catchError(this.handleError<any>('login'))
      //   );
    
    //mimic authorized login
    return of({token: "my jwt token"}).pipe(
      tap(response => this.setToken(response))
    )

    //mimic login failure
    // return throwError("login failed");
    
  }

  private setToken(result:any): void{
    
    //token will be stored in local
    localStorage.setItem('token', result.token);

    //after a successful login, redirect user to Employee page
    console.log('token is set');
    this.router.navigate(['/employee']);
  }
}
