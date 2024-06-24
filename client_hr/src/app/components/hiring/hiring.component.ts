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
  statusFilter = ['pending', 'rejected', 'approved'];

  tokenForm = new FormBuilder().group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required]
  })

  ngOnInit(): void {
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

  employees_data = [
    { name: "firstname last", email: "employeeOne@email.com"},
    { name: "Youfirst yourlast", email: "employeeTwo@email.com"},
    { name: "myfirstname mylast", email: "employeeThree@email.com"}
  ]

}
