import { Component, OnInit } from '@angular/core';
import { AllModules } from '@ag-grid-enterprise/all-modules';

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.css']
})
export class AgGridComponent implements OnInit {
  public modules = AllModules;
  public columnDefs = [
    { field: 'make', sortable: true, filter: true },
    { field: 'model', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    { field: 'hidden_field', sortable: true, filter: true }
  ];

  public rowData = [
      { make: 'Toyota', model: 'Celica', price: 35000, hidden_field: 'Is hidden' },
      { make: 'Ford', model: 'Mondeo', price: 32000, hidden_field: 'Is hidden' },
      { make: 'Porsche', model: 'Boxter', price: 72000, hidden_field: 'Is hidden' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
