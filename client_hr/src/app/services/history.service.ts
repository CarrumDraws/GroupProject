import { Injectable } from '@angular/core';
import { TokenLink } from '../interface/tokenLink';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private history: TokenLink[] = [];

  constructor(private http:HttpClient) {  }

  getHistory(): Observable<any> {

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<any>(`${environment.serverUrl}/registrationtokens`, { headers });
  }
}
