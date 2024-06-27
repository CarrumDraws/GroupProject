import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visa } from '../interface/visa';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisaService {

  constructor(private http: HttpClient) { }

  getAllOpt():Observable<Visa[] | null>{

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<Visa[]>(`${environment.serverUrl}/opt/visaholders`, { headers });
  }
}
