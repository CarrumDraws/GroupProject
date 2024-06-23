import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private serverUrl = environment.serverUrl;

  constructor(private http:HttpClient, private router: Router) { }
  
  login(email: string, password: string): Observable<any> {
    
    // Save it for later, need API call to the backend
    return this.http.post<any>(`${this.serverUrl}/login`, { email, password })
      .pipe(
        tap(response => this.setToken(response)),
        catchError((err) => throwError(err))
      );
  
  }

  private setToken(result:any): void{
    
    //token will be stored in local
    localStorage.setItem('token', result.token);

    //after a successful login, redirect user to Employee page
    console.log('token is set');
    this.router.navigate(['/employee']);
  }
}
    