import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/store/auth/auth.actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{

  constructor(private store: Store) {}

  token:string | null = "";

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
  }
}
