import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


type DisplayColumn = {
  headerTitle: string,
  columnDef: string,
  columnValue: string
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent<T> implements OnInit {

  @Input() data: T[] = [];
  @Input() displayedColumns: DisplayColumn[] = [];
  @Output() callAction: EventEmitter<any> = new EventEmitter<any>();
  tableColumns: string[] = [];


  constructor() { }

  ngOnInit(): void {
    this.tableColumns = this.displayedColumns.map(column => column.columnDef);
    this.tableColumns.push('actions');
  }

  handleAction(action: string, id: number): void {
    this.callAction.emit({ action, id });
  }

}
