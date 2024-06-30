import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/store/auth/auth.actions';
import { selectToken } from 'src/app/store/auth/auth.selectors';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private store: Store, private router: Router) { }

  ngOnInit(): void { }

  //dynamic render login/logout based on whether if user has token
  hasToken$ = this.store.select(selectToken);

  loginForm = new FormBuilder().group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  //submit form and trigger login action
  onSubmit(): void {
    if(this.loginForm.valid){
      const email = this.loginForm.get('email')!.value!;
      const password = this.loginForm.get('password')!.value!;
      this.store.dispatch(AuthActions.login({ email, password})); 
    }
  }

  //remove token from storage and trigger logout action
  onLogout(): void {
    localStorage.removeItem('token');
    this.store.dispatch(AuthActions.logout());
    console.log("Token is removed");
    window.location.reload();
  }

}
