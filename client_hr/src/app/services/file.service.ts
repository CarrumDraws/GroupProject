import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { File } from '../interface/file';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  newTapForFile(url: string){

    //Cant pass an url into another url, we encode it instead
    let encodedFileUrl = CryptoJS.AES.encrypt(url, environment.myEncodeKey).toString();
    localStorage.setItem(encodedFileUrl, encodedFileUrl)

    window.open( `/file`, environment.myUrl);
  }

  getFileUrl(fileKey: string): Observable<File> {

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<File>(`${environment.serverUrl}/file/${fileKey}`, { headers });
  }

  // getFilesByEmployeeId(id: string):File[]{
  //   //return dummpy data for now

  //   return files;
  // }

}
