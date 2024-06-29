import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseProfileComponent } from './house-profile.component';

describe('HouseProfileComponent', () => {
  let component: HouseProfileComponent;
  let fixture: ComponentFixture<HouseProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
