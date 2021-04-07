import { Component, OnInit } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-cropper-drag-drop',
  templateUrl: './cropper-drag-drop.component.html',
  styleUrls: ['./cropper-drag-drop.component.css']
})
export class CropperDragDropComponent implements OnInit {
  private cropper: Cropper;
  private img: HTMLImageElement;

  constructor() { }

  ngOnInit(): void {
    const context = this;
    this.img = document.getElementById('image-ok') as HTMLImageElement;

    console.log(this.img);

    const dropArea = document.getElementById("drop-area");

    const preventDefaults = (e) => {
      e.preventDefault()
      e.stopPropagation()
    };

    const highlight = (highlight) => {

      if (highlight == 'on')
        dropArea.classList.add('highlight');
      else
        dropArea.classList.remove('highlight');
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

      context.handleFileInput(files);

    }, false);

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
}


