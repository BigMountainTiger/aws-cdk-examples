import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AllModules } from '@ag-grid-enterprise/all-modules';

import { GroupGridDataService } from '../../services/group-grid-data.service';

@Component({
  selector: 'app-group-ag-grid',
  templateUrl: './group-ag-grid.component.html',
  styleUrls: ['./group-ag-grid.component.css']
})
export class GroupAgGridComponent implements OnInit {
  @ViewChild('myGrid') public myGrid;
  public modules = AllModules;

  public autoGroupColumnDef =  {
    colId: 'group',
    headerName: '',
    minWidth: 400,
    comparator: (a, b) => {
      const a_n = a.countryName;
      const b_n = b.countryName;

      console.log(a_n);

      if (a_n < b_n) {
        return -1;
      }

      if (a_n > b_n) {
        return 1;
      }

      return 0;
    }
  };
  public columnDefs;
  public rowData;

  // https://www.ag-grid.com/angular-grid/grid-interface/

  constructor(private service: GroupGridDataService) { }

  ngOnInit(): void {

    this.columnDefs = this.service.getColumnDefs();
    this.service.getData().subscribe((data) => {
      this.rowData = data;
    }, (err) => {
      console.log(err);
    });

  }

  public RunCommand() {
    // this.myGrid.columnApi.applyColumnState({ state: [{colId: 'contryName', sort: 'asc'}]});

    this.service.shuffle(this.rowData);
    this.rowData = _.clone(this.rowData);

    this.myGrid.api.setRowData(this.rowData);
    
    // this.service.getData().subscribe((data) => {
    //   this.service.shuffle(data);
    //   this.rowData = data;
    // }, (err) => {
    //   console.log(err);
    // });

  }

}
