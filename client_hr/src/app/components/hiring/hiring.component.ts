import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TokenService } from 'src/app/services/token.service';
import { FlashMessageService } from 'src/app/services/flash-message.service';

@Component({
  selector: 'app-hiring',
  templateUrl: './hiring.component.html',
  styleUrls: ['./hiring.component.css']
})
export class HiringComponent implements OnInit {

  constructor(
    private tokenService: TokenService,
    private flashMessageService: FlashMessageService
  ) { }

  isTokenPage = true;
  currentFilter: string | null = 'pending';

  tokenForm = new FormBuilder().group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required]
  })

  ngOnInit(): void {

    //tokenHIstory
    //create a service to call backend aip
    //To display a list of history

    //onboarding
    //create a service to call backend aip
    //To display a list of employees
  }

  switchPage(bool: boolean): void{
    this.isTokenPage = bool;
  }

  onSendToken(): void{
    if(this.tokenForm.valid){
      const name = this.tokenForm.get('name')!.value!;
      const email = this.tokenForm.get('email')!.value!;
      
      this.tokenService.sendToken(name, email).subscribe({
        next:  (respose) => this.flashMessageService.info("Token sent."),
        error: (error) => {
          this.flashMessageService.warn(error.error.error)
        },
        complete: () => {}
      });
    }
  }

  changeFilter(event: Event):void{
    const target = event.target as HTMLSelectElement;
    this.currentFilter = target.value;
  }

  viewApplication(employee_id: number){
    console.log("view");
    window.open(`/application/${employee_id}`, 'http://localhost:4200');
  }

  employees_data = [
    { id: 1, name: "firstname last", email: "employeeOne@email.com", status: "pending"},
    { id: 2, name: "Youfirst yourlast", email: "employeeTwo@email.com", status: "pending"},
    { id: 3, name: "myfirstname mylast", email: "employeeThree@email.com", status: "approved"},
    { id: 4, name: "fake name", email: "employee4@email.com", status: "rejected"},
    { id: 5, name: "invisible", email: "employee5@email.com", status: "approved"},
    { id: 6, name: "invalid name", email: "employee6@email.com", status: "approved"},
  ]

}
