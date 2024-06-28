import { Component, EventEmitter, Output,  Input } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  @Input() values: string[] = [];
  @Output() filterChange: EventEmitter<string> = new EventEmitter<string>();

  currentFilter: string = `${this.values[0]}`;

  changeFilter(): void {
    this.filterChange.emit(this.currentFilter);
  }

}
