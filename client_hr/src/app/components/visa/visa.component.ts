import { Component, OnInit } from '@angular/core';
import { Visa } from 'src/app/interface/visa';
import { Observable, map } from 'rxjs';
import { VisaService } from 'src/app/services/visa.service';

@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html',
  styleUrls: ['./visa.component.css']
})
export class VisaComponent implements OnInit {

  constructor(
    private visaService: VisaService
  ) { }

  visaList$: Observable<Visa[] | null> = new Observable<Visa[] | null>();

  currentSelected = 0;

  ngOnInit(): void {
    this.visaList$ = this.visaService.getAllOpt().pipe(

      //calculate day remains for work 
      map((response: Visa[] | null) => {
        if (!response) {
          return null;
        }
        return response.map(element => {
          const now = new Date();
          const endDate = new Date(element.workauth.enddate);
          const dayRemains = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          return {
            ...element,
            workauth: {
              ...element.workauth,
              dayRemains: dayRemains
            }
          };
        });
      })
    );
  }

  updateSelected(index: number):void{
    this.currentSelected = index;
  }

}
