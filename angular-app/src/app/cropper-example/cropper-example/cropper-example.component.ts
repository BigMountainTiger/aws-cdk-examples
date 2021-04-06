import { Component, OnInit } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-cropper-example',
  templateUrl: './cropper-example.component.html',
  styleUrls: ['./cropper-example.component.css']
})
export class CropperExampleComponent implements OnInit {
  private cropper: Cropper;

  constructor() { }

  private clearCropper(): void {
    if (this.cropper)
      this.cropper.destroy();
  }

  private createCropper(): void {
    this.clearCropper();

    const GetBlob =  this.onGetBlob;
    const that = this;
    const img = document.getElementById('image') as HTMLImageElement;
    this.cropper = new Cropper(img, {
      aspectRatio: 1 / 1,
      viewMode: 1,
      crop(event) {
        GetBlob.apply(that);
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
      console.log(blob);

      const buffer = blob.arrayBuffer();
      buffer.then(b => {
        const base64 = arrayBufferToBase64(b);
        console.log(base64);
        
        const cropped = document.getElementById('cropped') as HTMLImageElement;
        cropped.src = 'data:image/png;base64, ' + base64;
      })
    });
  }

  public handleFileInput(files): void {
    console.log(files);
  }

}
