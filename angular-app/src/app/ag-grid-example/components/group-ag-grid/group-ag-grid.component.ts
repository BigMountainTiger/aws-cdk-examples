import { Component, OnInit } from '@angular/core';

import { AllModules } from '@ag-grid-enterprise/all-modules';

import { GroupGridDataService } from '../../services/group-grid-data.service';

@Component({
  selector: 'app-group-ag-grid',
  templateUrl: './group-ag-grid.component.html',
  styleUrls: ['./group-ag-grid.component.css']
})
export class GroupAgGridComponent implements OnInit {
  public modules = AllModules;
  public columnDefs;
  public rowData;

  constructor(private service: GroupGridDataService) { }

  ngOnInit(): void {

    this.columnDefs = this.service.getColumnDefs();
    this.service.getData().subscribe((data) => {
      this.rowData = data;
    }, (err) => {
      console.log(err);
    });

  }

}
