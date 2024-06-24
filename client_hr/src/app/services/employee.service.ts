import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees = [
    {
      id: 1,
      lastName: 'Doe',
      preferredName: 'John',
      firstName: 'Johnathan',
      ssn: '123-45-6789',
      workAuthorizationTitle: 'U.S. Citizen',
      phoneNumber: '(555) 123-4567',
      email: 'john.doe@example.com'
    },
    {
      id: 2,
      lastName: 'Smith',
      preferredName: 'Jane',
      firstName: 'Jane',
      ssn: '987-65-4321',
      workAuthorizationTitle: 'Permanent Resident',
      phoneNumber: '(555) 987-6543',
      email: 'jane.smith@example.com'
    },
    {
      id:3,
      lastName: 'Brown',
      preferredName: 'Mike',
      firstName: 'Michael',
      ssn: '234-56-7890',
      workAuthorizationTitle: 'Work Visa',
      phoneNumber: '(555) 234-5678',
      email: 'mike.brown@example.com'
    },
    {
      id: 4,
      lastName: 'Johnson',
      preferredName: 'Lisa',
      firstName: 'Elizabeth',
      ssn: '345-67-8901',
      workAuthorizationTitle: 'Green Card',
      phoneNumber: '(555) 345-6789',
      email: 'lisa.johnson@example.com'
    },
    {
      id: 5,
      lastName: 'Garcia',
      preferredName: 'Chris',
      firstName: 'Christopher',
      ssn: '456-78-9012',
      workAuthorizationTitle: 'Student Visa',
      phoneNumber: '(555) 456-7890',
      email: 'chris.garcia@example.com'
    },
    {
      id: 6,
      lastName: 'Martinez',
      preferredName: 'Sarah',
      firstName: 'Sara',
      ssn: '567-89-0123',
      workAuthorizationTitle: 'U.S. Citizen',
      phoneNumber: '(555) 567-8901',
      email: 'sarah.martinez@example.com'
    },
    {
      id: 7,
      lastName: 'Martinez222',
      preferredName: 'Sarah',
      firstName: 'Sara',
      ssn: '567-89-0123',
      workAuthorizationTitle: 'U.S. Citizen',
      phoneNumber: '(555) 567-8901',
      email: 'sarah.martinez@example.com'
    },
    {
      id: 8,
      lastName: 'Martinez333',
      preferredName: 'Sarah',
      firstName: 'Sara',
      ssn: '567-89-0123',
      workAuthorizationTitle: 'U.S. Citizen',
      phoneNumber: '(555) 567-8901',
      email: 'sarah.martinez@example.com'
    }
  ];

  getEmployees(): any[] {
    //get data via api call
    return this.employees.sort((a, b)=> a.lastName.localeCompare(b.lastName));
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
    ).sort((a, b)=> a.lastName.localeCompare(b.lastName));
  }
}