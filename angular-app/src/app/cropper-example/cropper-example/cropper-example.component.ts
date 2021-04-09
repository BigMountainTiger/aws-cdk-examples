import { Component, OnInit } from '@angular/core';
import Cropper from 'cropperjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CropperPopupComponent } from '../cropper-popup/cropper-popup.component';
import { CropperDragDropComponent } from '../cropper-drag-drop/cropper-drag-drop.component';
import { JustPopupComponent } from '../just-popup/just-popup.component';

@Component({
  selector: 'app-cropper-example',
  templateUrl: './cropper-example.component.html',
  styleUrls: ['./cropper-example.component.css']
})
export class CropperExampleComponent implements OnInit {
  private cropper: Cropper;

  constructor(private _modalService: NgbModal) { }

  private clearCropper(): void {
    if (this.cropper)
      this.cropper.destroy();
  }

  private createCropper(): void {
    this.clearCropper();

    const context = this;
    const img = document.getElementById('image') as HTMLImageElement;
    this.cropper = new Cropper(img, {
      aspectRatio: 1 / 1,
      viewMode: 1,
      crop: (event) => {
        context.onGetBlob();
      },
    });
  }

  ngOnInit(): void {
    this.createCropper();
  }

  public onClearCropper(): void {
    this.clearCropper();
  }

  public onCreateCropper(): void {
    this.createCropper();
  }

  public onGetBlob(): void {
        
    const arrayBufferToBase64 = ( buffer ) => {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    }

    this.cropper.getCroppedCanvas().toBlob(blob => {
      const type = blob.type;

      // The buffer is the binary to save
      const buffer = blob.arrayBuffer();
      buffer.then(b => {
        const base64 = arrayBufferToBase64(b);
        
        const cropped = document.getElementById('cropped') as HTMLImageElement;
        cropped.src = 'data:' + type + ';base64, ' + base64;
      })
    });
  }

  public handleFileInput(files): void {
    const file = files[0];
    const reader = new FileReader();


    reader.addEventListener("load", () => {
      let base64 = reader.result as string;
      const img = document.getElementById('image') as HTMLImageElement;

      this.clearCropper();
      img.src = base64;

      this.createCropper();

    }, false);

    reader.readAsDataURL(file); 
  }

  public onCropperPopup(): void {
    this._modalService.open(CropperPopupComponent, {
      size: 'sm'
    });
  }

  public onFileDragDrop(): void {
    this._modalService.open(CropperDragDropComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
  }

  public onJustPopup(): void {
    this._modalService.open(JustPopupComponent, {
      size: 'lg'
    });
  }
}
