import { Injectable } from '@angular/core';
import { Employee } from '../interface/employee';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient){}

  private employees:Employee[] = [];

  getPersonalInfo(){
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    
    return this.http.get<any>(`${environment.serverUrl}/employee`, { headers });
  }

  getEmployees(): Observable<Employee[]> {
    //get data via api call
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    
    return this.http.get<Employee[]>(`${environment.serverUrl}/employee/all`, { headers });
  }
  // this.employees.sort((a, b)=> a.name.lastname.localeCompare(b.name.lastname));
  searchEmployees(searchText: string): Employee[] {
    if(this.employees.length == 0){
      this.loadEmployees();
    }

    if (!searchText.trim()) { 
      return [];
    }
    const lowerCaseSearch = searchText.toLowerCase();
    return this.employees.filter(employee =>
      employee.name.firstname.toLowerCase().includes(lowerCaseSearch) ||
      employee.name.lastname.toLowerCase().includes(lowerCaseSearch) ||
      employee.name.preferredname.toLowerCase().includes(lowerCaseSearch)
    ).sort((a, b)=> a.name.lastname.localeCompare(b.name.lastname));
  }

  loadEmployees(): void {
    this.getEmployees().subscribe(
      data => this.employees = data
    );
  }
}
