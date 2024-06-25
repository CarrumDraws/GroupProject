import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { onboardingDummyData } from '../dummyData';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  employeeId: number = this.route.snapshot.params['employeeId'];

  employee = onboardingDummyData;

  ngOnInit(): void {
  }

}
