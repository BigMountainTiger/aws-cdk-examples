import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-just-popup',
  templateUrl: './just-popup.component.html',
  styleUrls: ['./just-popup.component.css']
})
export class JustPopupComponent implements OnInit {

  constructor(private _modalService: NgbModal) { }

  ngOnInit(): void {
  }

  public onClose(): void {
    this._modalService.dismissAll();
  }
}
