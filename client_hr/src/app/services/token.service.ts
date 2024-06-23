import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FlashMessageService } from './flash-message.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private serverUrl = 'http://localhost:5000';

  constructor( private http:HttpClient ) { }


  sendToken( name: string, email: string): Observable<any> {

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post<any>(`${this.serverUrl}/registration`, { name, email}, { headers });
  }
}
