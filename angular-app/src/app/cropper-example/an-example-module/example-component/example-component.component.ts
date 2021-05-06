import { Component, OnInit } from '@angular/core';
import { Abcd } from '../../enums/abcd.enum';

@Component({
  selector: 'app-example-component',
  templateUrl: './example-component.component.html',
  styleUrls: ['./example-component.component.css']
})
export class ExampleComponentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // Abcd
  public btnTestEnum() {

    alert(typeof(Abcd.INIT));
    alert(Abcd.FAIL);
  }

}
