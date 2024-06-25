import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/interface/profile';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile$: Observable<Profile | null> = new Observable<Profile | null>(); 

  constructor(private route: ActivatedRoute, private profileService: ProfileService) { }

  ngOnInit(): void {
    const employeeId = "667a350722a96c9de64d682c"; // Replace with dynamic ID if needed
    this.profile$ = this.profileService.getProfile(employeeId);
  }

}