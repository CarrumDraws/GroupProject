import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { House } from 'src/app/interface/house';
import { FlashMessageService } from 'src/app/services/flash-message.service';
import { HouseService } from 'src/app/services/house.service';

@Component({
  selector: 'app-housing',
  templateUrl: './housing.component.html',
  styleUrls: ['./housing.component.css']
})
export class HousingComponent implements OnInit {

  constructor(
    private fb: FormBuilder, 
    private flashMessageService: FlashMessageService,
    private houseService:  HouseService
  ) {}

  houseForm = this.fb.group({
    firstname: ['', Validators.required],
    middlename: [''],
    lastname: ['', Validators.required],
    phone: [null, [Validators.pattern('^[0-9]+$'), this.nonNegativeNumberValidator()]],
    email: ['', [Validators.required, Validators.email]],
    buildaptnum: [0, Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    beds: [null, [Validators.pattern('^[0-9]+$'), this.nonNegativeNumberValidator()]],
    mattresses: [null, [Validators.pattern('^[0-9]+$'), this.nonNegativeNumberValidator()]],
    tables: [null, [Validators.pattern('^[0-9]+$'), this.nonNegativeNumberValidator()]],
    chairs: [null, [Validators.pattern('^[0-9]+$'), this.nonNegativeNumberValidator()]]
  });

  ngOnInit(): void {

  }

  onSubmit(): void {
    if (this.houseForm.valid) {
      const formValue = this.houseForm.value;
      const house: House = {
        firstname: formValue.firstname ?? '',
        middlename: formValue.middlename ?? '',
        lastname: formValue.lastname ?? '',
        phone: formValue.phone ?? null,
        email: formValue.email ?? '',
        buildaptnum: formValue.buildaptnum!,
        street: formValue.street ?? '',
        city: formValue.city ?? '',
        state: formValue.state ?? '',
        zip: formValue.zip ?? '',
        beds: formValue.beds ?? 0,
        mattresses: formValue.mattresses ?? 0,
        tables: formValue.tables ?? 0,
        chairs: formValue.chairs ?? 0,
      };
      console.log(house);
      this.houseService.postHouse(house).subscribe(response => {
        this.flashMessageService.info('House is successfully added');
      }, error => {
        console.log(error)
        this.flashMessageService.warn(error.error.error);
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
}