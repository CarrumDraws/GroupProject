import { ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TokenService } from 'src/app/services/token.service';
import { FlashMessageService } from 'src/app/services/flash-message.service';
import { HistoryService } from 'src/app/services/history.service';
import { TokenLink } from 'src/app/interface/tokenLink';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OnboardingService } from 'src/app/services/onboarding.service';
import { ApplicationOverview } from 'src/app/interface/applicationOverview';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-hiring',
  templateUrl: './hiring.component.html',
  styleUrls: ['./hiring.component.css']
})
export class HiringComponent implements OnInit{

  constructor(
    private tokenService: TokenService,
    private flashMessageService: FlashMessageService,
    private historyService: HistoryService,
    private cdr: ChangeDetectorRef,
    private onboardingService: OnboardingService
  ) { }

  currentFilter: string = 'Pending';

  tokenHistory$: Observable<TokenLink[]> | null = null;
  applications$: Observable<ApplicationOverview[]> | null = null;

  tokenForm = new FormBuilder().group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]]
  })

  ngOnInit(): void {

    this.fetchHistoryData();
    this.getApplicationByStatus(this.currentFilter);
  }

  fetchHistoryData(){
    this.tokenHistory$ = this.historyService.getHistory().pipe(
      map(response => response.reverse())
    );
  }
  getApplicationByStatus(status: string):void{
    this.applications$ = this.onboardingService.getApplicationByStatus(status);
  }


  onSendToken(): void {
    if (this.tokenForm.valid) {
      const name = this.tokenForm.get('name')!.value!;
      const email = this.tokenForm.get('email')!.value!;

      this.tokenService.sendToken(name, email).pipe(
        switchMap(() => {
          this.flashMessageService.info("Token sent.");
          // Reload the history list to get the newest updated data
          return this.historyService.getHistory();
        }),
        map(response => response.reverse())
      ).subscribe({
        next: (_) => { this.fetchHistoryData(); },
        error: (error) => {
          this.flashMessageService.warn(error.error.error);
        },
        complete: () => {
          this.tokenForm.reset();
        }
      });
    }
  }

  onFilterChange(filter: string): void {
    this.getApplicationByStatus(filter);
    this.currentFilter = filter;
  }

  viewApplication(employee_id: number){

    window.open(`/application/${employee_id}`, environment.myUrl);
  }

  sendEmail(email: string) {
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  }

}
