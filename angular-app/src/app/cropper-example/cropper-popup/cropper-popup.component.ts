import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-cropper-popup',
  templateUrl: './cropper-popup.component.html',
  styleUrls: ['./cropper-popup.component.css']
})
export class CropperPopupComponent implements OnInit {
  private cropper: Cropper;
  private img: HTMLImageElement;

  constructor(private _modalService: NgbModal) {}

  ngOnInit(): void {
    this.img = document.getElementById('image-display') as HTMLImageElement;
  }

  private createCropper(): void {
    if (this.cropper) {
      this.cropper.destroy();
    }

    this.cropper = new Cropper(this.img, {
      aspectRatio: 1 / 1,
      viewMode: 1
    });
  }

  public handleFileInput(files): void {
    const file = files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      let base64 = reader.result as string;
      this.img.src = base64;

      this.createCropper();

    }, false);

    reader.readAsDataURL(file); 
  }

  public onCancel(): void {
    this._modalService.dismissAll();
  }
}
