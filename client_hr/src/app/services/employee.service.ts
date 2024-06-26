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

  getEmployees(): Observable<Employee[]> {
    //get data via api call
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    
    return this.http.get<Employee[]>(`${environment.serverUrl}/employee/all`, { headers });
  }
  // this.employees.sort((a, b)=> a.name.lastname.localeCompare(b.name.lastname));
  searchEmployees(searchText: string): any[] {
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
}

// [
//   {
//     id: 1,
//     lastName: 'Doe',
//     preferredName: 'John',
//     firstName: 'Johnathan',
//     ssn: '123-45-6789',
//     workAuthorizationTitle: 'U.S. Citizen',
//     phoneNumber: '(555) 123-4567',
//     email: 'john.doe@example.com'
//   },
//   {
//     id: 2,
//     lastName: 'Smith',
//     preferredName: 'Jane',
//     firstName: 'Jane',
//     ssn: '987-65-4321',
//     workAuthorizationTitle: 'Permanent Resident',
//     phoneNumber: '(555) 987-6543',
//     email: 'jane.smith@example.com'
//   },
//   {
//     id:3,
//     lastName: 'Brown',
//     preferredName: 'Mike',
//     firstName: 'Michael',
//     ssn: '234-56-7890',
//     workAuthorizationTitle: 'Work Visa',
//     phoneNumber: '(555) 234-5678',
//     email: 'mike.brown@example.com'
//   },
//   {
//     id: 4,
//     lastName: 'Johnson',
//     preferredName: 'Lisa',
//     firstName: 'Elizabeth',
//     ssn: '345-67-8901',
//     workAuthorizationTitle: 'Green Card',
//     phoneNumber: '(555) 345-6789',
//     email: 'lisa.johnson@example.com'
//   },
//   {
//     id: 5,
//     lastName: 'Garcia',
//     preferredName: 'Chris',
//     firstName: 'Christopher',
//     ssn: '456-78-9012',
//     workAuthorizationTitle: 'Student Visa',
//     phoneNumber: '(555) 456-7890',
//     email: 'chris.garcia@example.com'
//   },
//   {
//     id: 6,
//     lastName: 'Martinez',
//     preferredName: 'Sarah',
//     firstName: 'Sara',
//     ssn: '567-89-0123',
//     workAuthorizationTitle: 'U.S. Citizen',
//     phoneNumber: '(555) 567-8901',
//     email: 'sarah.martinez@example.com'
//   },
//   {
//     id: 7,
//     lastName: 'Martinez222',
//     preferredName: 'Sarah',
//     firstName: 'Sara',
//     ssn: '567-89-0123',
//     workAuthorizationTitle: 'U.S. Citizen',
//     phoneNumber: '(555) 567-8901',
//     email: 'sarah.martinez@example.com'
//   },
//   {
//     id: 8,
//     lastName: 'Martinez333',
//     preferredName: 'Sarah',
//     firstName: 'Sara',
//     ssn: '567-89-0123',
//     workAuthorizationTitle: 'U.S. Citizen',
//     phoneNumber: '(555) 567-8901',
//     email: 'sarah.martinez@example.com'
//   }
// ];