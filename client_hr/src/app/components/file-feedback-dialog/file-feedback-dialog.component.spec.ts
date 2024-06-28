import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileFeedbackDialogComponent } from './file-feedback-dialog.component';

describe('FileFeedbackDialogComponent', () => {
  let component: FileFeedbackDialogComponent;
  let fixture: ComponentFixture<FileFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileFeedbackDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
