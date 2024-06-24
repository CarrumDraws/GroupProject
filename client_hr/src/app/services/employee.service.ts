import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees = [
    { id: 1, firstName: 'John', lastName: 'Doe', preferredName: 'Johnny' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', preferredName: 'Janie' },
    { id: 3, firstName: 'Michael', lastName: 'Johnson', preferredName: 'Mike' },
    { id: 4, firstName: 'Emily', lastName: 'Brown', preferredName: 'Em' },
    { id: 5, firstName: 'David', lastName: 'Wilson', preferredName: 'Dave' }
  ];

  getEmployees(): any[] {
    //get data via api call
    return this.employees;
  }

  searchEmployees(searchText: string): any[] {
    if (!searchText.trim()) {
      return [];
    }
    const lowerCaseSearch = searchText.toLowerCase();
    return this.employees.filter(employee =>
      employee.firstName.toLowerCase().includes(lowerCaseSearch) ||
      employee.lastName.toLowerCase().includes(lowerCaseSearch) ||
      employee.preferredName.toLowerCase().includes(lowerCaseSearch)
    );
  }
}