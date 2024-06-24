import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees: any[];
  searchResults: any[] = [];
  searchText: string = '';

  constructor(private employeeService: EmployeeService, private router: Router) {
    this.employees = this.employeeService.getEmployees();
  }
  
  ngOnInit(): void {
  }

  searchEmployees(): void {
    this.searchResults = this.employeeService.searchEmployees(this.searchText);
  }
  
  sendEmail(email: string) {
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  }

  viewEmployee(employee_id: number) {
    this.router.navigate(['/profile', employee_id]);
  }
}


