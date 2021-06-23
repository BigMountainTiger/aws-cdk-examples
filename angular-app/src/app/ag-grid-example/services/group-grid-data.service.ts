import { ColDef } from '@ag-grid-enterprise/all-modules';
import { Injectable } from '@angular/core';
import { AsyncSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GroupGridDataService {

  public getColumnDefs(): ColDef[] {
    const keyCreator = (p) => {
      return p.value.name;
    };

    const columns = [
      { 
        colId: 'country', 
        field: 'country',
        keyCreator: keyCreator,
        rowGroup: true, 
        rowGroupIndex: 0 
      },
      { 
        field: 'company', 
        keyCreator: keyCreator,
        rowGroup: true, 
        rowGroupIndex: 1 
      },
      { 
        field: 'office', 
        keyCreator: keyCreator,
        rowGroup: true, 
        rowGroupIndex: 2 
      },
      { colId: 'data1', field: 'data1', sortable: true, filter: true },
      { field: 'data2', sortable: true, filter: true },
    ];

    return columns;
  }

  public shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
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
                country: {
                  id: country,
                  name: 'Country No.' + country
                },
                countryName: 'Country No.' + country,
                company: {
                  id: company,
                  name: 'Company No.' + company
                },
                companyName: 'Company No.' + company,
                office: {
                  id: office,
                  name: 'Office No.' + office
                },
                officeName: 'Office No.' + office,
                data1: 'Data-1 No.' + i,
                data2: 'Data-2 No.' + i,
              };

              data.push(entry);
            }

          }
        }
      }

      // this.shuffle(data);
      subject.next(data);
      subject.complete();

    }, 0.5 * 1000);

    return subject;
  }
}
