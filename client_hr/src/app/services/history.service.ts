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

// {
//   email: 'john.doe@example.com',
//   name: 'John Doe',
//   registrationLink: 'https://example.com/register?token=abcd1234',
//   status: true
// },
// {
//   email: 'jane.smith@example.com',
//   name: 'Jane Smith',
//   registrationLink: 'https://example.com/register?token=efgh5678',
//   status: false
// },
// {
//   email: 'mike.brown@example.com',
//   name: 'Mike Brown',
//   registrationLink: 'https://example.com/register?token=ijkl9101',
//   status: true
// },
// {
//   email: 'lisa.johnson@example.com',
//   name: 'Lisa Johnson',
//   registrationLink: 'https://example.com/register?token=mnop1213',
//   status: true
// },
// {
//   email: 'chris.garcia@example.com',
//   name: 'Chris Garcia',
//   registrationLink: 'https://example.com/register?token=qrst1415',
//   status: false
// },
// {
//   email: 'sarah.martinez@example.com',
//   name: 'Sarah Martinez',
//   registrationLink: 'https://example.com/register?token=uvwx1617',
//   status: false
// },
// {
//   email: 'david.lee@example.com',
//   name: 'David Lee',
//   registrationLink: 'https://example.com/register?token=yzab1819',
//   status: true
// },
// {
//   email: 'laura.wilson@example.com',
//   name: 'Laura Wilson',
//   registrationLink: 'https://example.com/register?token=cdef2021',
//   status: true
// },
// {
//   email: 'james.taylor@example.com',
//   name: 'James Taylor',
//   registrationLink: 'https://example.com/register?token=ghij2223',
//   status: false
// },
// {
//   email: 'mary.white@example.com',
//   name: 'Mary White',
//   registrationLink: 'https://example.com/register?token=klmn2425',
//   status: true
// }