import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
    phone: [null, [Validators.pattern('^[0-9]+$')]],
    email: ['', [Validators.required, Validators.email]],
    buildaptnum: [0, Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    beds: [null, Validators.pattern('^[0-9]+$')],
    mattresses: [null, Validators.pattern('^[0-9]+$')],
    tables: [null, Validators.pattern('^[0-9]+$')],
    chairs: [null, Validators.pattern('^[0-9]+$')]
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
        buildaptnum: formValue.buildaptnum ?? 0,
        street: formValue.street ?? '',
        city: formValue.city ?? '',
        state: formValue.state ?? '',
        zip: formValue.zip ?? '',
        beds: formValue.beds ?? null,
        mattresses: formValue.mattresses ?? null,
        tables: formValue.tables ?? null,
        chairs: formValue.chairs ?? null,
      };
      this.houseService.postHouse(house).subscribe(response => {
        this.flashMessageService.info('House is successfully added');
      }, error => {
        this.flashMessageService.warn(error);
      });
    } else {
      this.flashMessageService.warn("House form is not valid");
    }
  }
}