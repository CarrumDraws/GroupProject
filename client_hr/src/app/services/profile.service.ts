import { Injectable } from '@angular/core';
import { Profile } from '../interface/profile';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http:HttpClient) { }

  getProfile(id: any): Observable<Profile>{

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    

    return this.http.get<Profile>(`${environment.serverUrl}/employee/${id}`, { headers });
  }

}
