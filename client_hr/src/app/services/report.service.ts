import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Report } from '../interface/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = `${environment.serverUrl}/report/house`;

  constructor(private http: HttpClient) {}

  getReports(houseId: string): Observable<Report[]> {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<Report[]>(`${this.apiUrl}/${houseId}`, { headers });
  }

  toggleReportStatus(reportId: string){
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.patch<Report>(`${environment.serverUrl}/report/${reportId}`, {}, { headers });
  }

  getComments(reportId: string){
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<any>(`${environment.serverUrl}/report/${reportId}`, { headers });
  }

  addComment(reportId: string, description: string){
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post<any>(`${environment.serverUrl}/report/${reportId}`, { description }, { headers });
  }
}