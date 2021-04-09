import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-just-popup',
  templateUrl: './just-popup.component.html',
  styleUrls: ['./just-popup.component.css']
})
export class JustPopupComponent implements OnInit, AfterViewInit {
  // INIT, LOADING, FAIL, DONE
  public status: string

  constructor(private _modalService: NgbModal) { }

  ngAfterViewInit(): void {
    const dropArea = document.getElementById("profile-picture-file-drop-container");

    const preventDefaults = (e) => {
      e.preventDefault()
      e.stopPropagation()
    };

    const highlight = (highlight) => {
      if (highlight == 'on')
        dropArea.classList.add('on');
      else
        dropArea.classList.remove('on');
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, () => {
        highlight('on');
      }, false)
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, () => {
        highlight('off');
      }, false)
    });

    dropArea.addEventListener('drop', (e) => {
      var dt = e.dataTransfer
      var files = dt.files;

      this.handleFileInput(files);

    }, false);
  }

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
    }, 2 * 1000);
  }
}
