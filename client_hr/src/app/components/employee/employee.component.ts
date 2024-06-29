import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router } from '@angular/router';
import { Employee } from 'src/app/interface/employee';
import { map, tap } from 'rxjs';
import { PdfPreviewComponent } from '../pdf-preview/pdf-preview.component';
import { PdfService } from 'src/app/services/pdf.service';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = [];
  searchResults: Employee[] = [];
  searchText: string = '';

  constructor(private employeeService: EmployeeService, private router: Router) { }
  
  ngOnInit(): void {
    this.employeeService.getEmployees().pipe(
      map((response: Employee[]) => {
        // Sort employees by last name
        return response.sort((a: Employee, b: Employee) => a.name.lastname.localeCompare(b.name.lastname));
      }),
      tap((_) => {this.employeeService.loadEmployees();})
    ).subscribe((sortedEmployees: Employee[]) => {
      this.employees = sortedEmployees;
    });
  }

  searchEmployees(): void {
    this.searchResults = this.employeeService.searchEmployees(this.searchText);
  }
  
  sendEmail(email: string) {
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  }

  viewEmployee(employee_id: string) {
    this.router.navigate(['/profile', employee_id]);
  }
}


