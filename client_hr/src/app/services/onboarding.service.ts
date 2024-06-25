import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ApplicationOverview } from '../interface/applicationOverview';
import { ApplicationDetail } from '../interface/applicationDetail';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(private http:HttpClient) { }

  getApplicationByStatus(status: string): Observable<ApplicationOverview[]> {

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<ApplicationOverview[]>(`${environment.serverUrl}/onboarding/all?type=${status}`, { headers });
  }

  getApplicationById(id: number): Observable<ApplicationDetail> {

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<ApplicationDetail>(`${environment.serverUrl}/onboarding/${id}`, { headers });
  }
}