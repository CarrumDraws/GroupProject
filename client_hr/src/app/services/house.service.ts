import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { House } from '../interface/house';
import { HouseDetail } from '../interface/houseDetail';


@Injectable({
  providedIn: 'root'
})
export class HouseService {

  constructor(private http:HttpClient) { }

  postHouse(house: House): Observable<House> {

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.post<House>(`${environment.serverUrl}/house`, house , { headers });
  }

  getAllHouses(): Observable<HouseDetail[]> {

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<HouseDetail[]>(`${environment.serverUrl}/house/all`, { headers });
  }

  
}
