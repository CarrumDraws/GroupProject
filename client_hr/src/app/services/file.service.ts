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

  getFilesByEmployeeId(id: string):File[]{
    //return dummpy data for now
    let files = [
      {message: "", url:"https://ohiostate.pressbooks.pub/app/uploads/sites/160/h5p/content/5/images/image-5bd08790e1864.png"} as File,
      {message: "", url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5x88uP9b7i5eSspIC4RM_B7bqyXaukMauLw&usqp=CAU"} as File,
      {message: "", url:"https://amzirlodp-prd-s3.s3.amazonaws.com/documents/images/big_441d7f43ead31df601a2dc864f5d8ec564d2e7ae.jpg"} as File,
      {message: "", url:"https://amzirlodp-prd-s3.s3.amazonaws.com/documents/images/big_441d7f43ead31df601a2dc864f5d8ec564d2e7ae.jpg"} as File,
      {message: "", url:"https://amzirlodp-prd-s3.s3.amazonaws.com/documents/images/big_441d7f43ead31df601a2dc864f5d8ec564d2e7ae.jpg"} as File,
      {message: "", url:"https://amzirlodp-prd-s3.s3.amazonaws.com/documents/images/big_441d7f43ead31df601a2dc864f5d8ec564d2e7ae.jpg"} as File
    ]

    return files;
  }

}
