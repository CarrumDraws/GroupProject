import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { File } from '../interface/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  newTapForFile(url: string){

    window.open( `/file`, environment.myUrl);
  }

  getFileUrl(fileKey: string): Observable<File> {

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<File>(`${environment.serverUrl}/file/${fileKey}`, { headers });
  }

}
