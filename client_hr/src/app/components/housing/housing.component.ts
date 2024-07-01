import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { House } from 'src/app/interface/house';
import { HouseDetail } from 'src/app/interface/houseDetail';
import { FlashMessageService } from 'src/app/services/flash-message.service';
import { HouseService } from 'src/app/services/house.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-housing',
  templateUrl: './housing.component.html',
  styleUrls: ['./housing.component.css']
})
export class HousingComponent implements OnInit {

  constructor(
    private fb: FormBuilder, 
    private flashMessageService: FlashMessageService,
    private houseService:  HouseService,
    private router: Router
  ) {}

  houseForm = this.fb.group({
    firstname: ['', Validators.required],
    middlename: [''],
    lastname: ['', Validators.required],
    phone: ['', [Validators.pattern('^[0-9]+$'), this.nonNegativeNumberValidator()]],
    email: ['', [Validators.required, Validators.email]],
    buildaptnum: [0, Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    beds: [0, [Validators.required, Validators.pattern('^[0-9]+$'), this.nonNegativeNumberValidator()]],
    mattresses: [0, [Validators.required, Validators.pattern('^[0-9]+$'), this.nonNegativeNumberValidator()]],
    tables: [0, [Validators.required, Validators.pattern('^[0-9]+$'), this.nonNegativeNumberValidator()]],
    chairs: [0, [Validators.required, Validators.pattern('^[0-9]+$'), this.nonNegativeNumberValidator()]]
  });

  houseList$: Observable<HouseDetail[]> = new Observable<HouseDetail[]>;

  ngOnInit(): void {

    this.getHouseList();
  }

  getHouseList(){
    this.houseList$ = this.houseService.getAllHouses().pipe(
      map(houses => houses.reverse())
    );
  }


  onSubmit(): void {
    if (this.houseForm.valid) {
      const formValue = this.houseForm.value;
      const house: House = {
        firstname: formValue.firstname!,
        middlename: formValue.middlename || null,
        lastname: formValue.lastname!,
        phone: formValue.phone || null,
        email: formValue.email!,
        buildaptnum: formValue.buildaptnum!,
        street: formValue.street!,
        city: formValue.city!,
        state: formValue.state!,
        zip: formValue.zip!,
        beds: formValue.beds || 0,
        mattresses: formValue.mattresses || 0,
        tables: formValue.tables || 0,
        chairs: formValue.chairs || 0,
      };
      console.log(house);
      this.houseService.postHouse(house).subscribe(response => {
        this.getHouseList();
        this.flashMessageService.info('House is successfully added');
      }, error => {
        console.log(error)
        this.flashMessageService.warn(error.error);
      });
    } else {
      this.flashMessageService.warn("House form is not valid");
    }
  }

  nonNegativeNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = control.value >= 0;
      return isValid ? null : { 'nonNegativeNumber': { value: control.value } };
    };
  }

  onHouseCard(houseId: string){
    this.router.navigate(['/housing', houseId]);
  }

}