import { Injectable } from '@angular/core';
import { AsyncSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GroupGridDataService {

  public getColumnDefs() {
    const columns = [
      { field: 'country', rowGroup: true, hide: true },
      { field: 'company', sortable: true, filter: true },
      { field: 'office', sortable: true, filter: true },
      { field: 'data1', sortable: true, filter: true },
      { field: 'data2', sortable: true, filter: true },
    ];

    return columns;
  }

  public getData() {
    const subject = new AsyncSubject();

    setTimeout(() => {
      const data = [];

      for (let country = 0; country < 3; country++) {
        for (let company = 0; company < 3; company++) {
          for (let office = 0; office < 3; office++) {
            for (let i = 0; i < 2; i++) {

              const entry = {
                country: 'Country No.' + country,
                company: 'Company No.' + company,
                office: 'Office No.' + office,
                data1: 'Data-1 No.' + i,
                data2: 'Data-2 No.' + i,
              };

              data.push(entry);
            }

          }
        }
      }

      subject.next(data);
      subject.complete();

    }, 0.5 * 1000);

    return subject;
  }
}
