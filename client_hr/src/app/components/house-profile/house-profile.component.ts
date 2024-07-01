import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HouseDetail } from 'src/app/interface/houseDetail';
import { HouseService } from 'src/app/services/house.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/interface/profile';

@Component({
  selector: 'app-house-profile',
  templateUrl: './house-profile.component.html',
  styleUrls: ['./house-profile.component.css']
})
export class HouseProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private houseService: HouseService,
    private profileService: ProfileService
  ) { }

  houseProfile: HouseDetail | null = null;
  houseList$: Observable<HouseDetail[]> = new Observable<HouseDetail[]>;
  members: Profile[] = [];

  ngOnInit(): void {

    const houseId: string = this.route.snapshot.params['houseId'];

    this.houseList$ = this.houseService.getAllHouses();

    this.houseList$.subscribe(next =>{
      this.houseProfile = next.filter(house => houseId === house._id)[0];
     let memberList = this.houseProfile.members;

     memberList.forEach((memberId)=>{
      this.profileService.getProfile(memberId).subscribe(next =>{
        this.members.push(next);
      })
     })
    })
  }

}
