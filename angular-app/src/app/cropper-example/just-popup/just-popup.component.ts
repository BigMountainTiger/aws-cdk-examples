import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-just-popup',
  templateUrl: './just-popup.component.html',
  styleUrls: ['./just-popup.component.css']
})
export class JustPopupComponent implements OnInit {
  // INIT, LOADING, FAIL, DONE
  public status: string

  constructor(private _modalService: NgbModal) { }

  ngOnInit(): void {
    this.status = 'INIT';
  }

  public onClose(): void {
    this._modalService.dismissAll();
  }

  public handleFileInput(files): void {
    const file = files[0];
    const types = ['image/jpeg', 'image/png'];


    if ((! types.includes(file.type)) || (file.size > (4 * 1024 * 1024))) {
      this.status = 'FAIL';
      return;
    }

    this.status = 'LOADING';
    setTimeout(() => {
      this.status = 'DONE';
    }, 1000);
  }
}
