import { Component, EventEmitter, Output,  Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input() values: string[] = [];
  @Output() filterChange: EventEmitter<string> = new EventEmitter<string>();

  currentFilter: string = "";

  ngOnInit(){
    this.currentFilter = `${this.values[0]}`
  }

  changeFilter(): void {
    this.filterChange.emit(this.currentFilter);
  }

}
