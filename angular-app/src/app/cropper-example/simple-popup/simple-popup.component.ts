// https://mariemchabeni.medium.com/angular-7-drag-and-drop-simple-file-uploadin-in-less-than-5-minutes-d57eb010c0dc

import { AfterViewInit, Component, Directive, DoCheck, EventEmitter, HostBinding, HostListener, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-simple-popup',
  templateUrl: './simple-popup.component.html',
  styleUrls: ['./simple-popup.component.css']
})
export class SimplePopupComponent implements OnInit, AfterViewInit, DoCheck, OnDestroy {

  private WndEvents = [];
  public NoOfBtnClicks: number = 0
  constructor() { }
  
  ngDoCheck(): void {
    // console.log('ngDoCheck');
  }

  private clicked (e)  {
    console.log('Window is clicked');
  }
  
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit')

    // The listener is still attached to the window when component destroyed
    // But if the handler is a class instance method, it is removed by angular

    // document.body.addEventListener('click', this.clicked.bind(this), false);

    const preventDefaults = (e) => {
      e.preventDefault()
      e.stopPropagation()
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    const wnd_click_handler = () => {
      console.log('Window is clicked');
    };

    document.body.addEventListener('click', wnd_click_handler, false);
    this.WndEvents.push({
      event: 'click',
      handler: wnd_click_handler
    });

    // this-is-test-button
    const btn_click_handler = () => {
      console.log('Button is clicked');
    };

    const btn = document.getElementById('this-is-test-button');
    btn.addEventListener('click', btn_click_handler, false);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // This clears the event added to the document in ngAfterViewInit
    this.WndEvents.forEach(v => {
      console.log('Removing EventListener');
      document.body.removeEventListener(v.event, v.handler, false);
    });
  }

  public onNoOfClicks(): void {
    this.NoOfBtnClicks++;
  }

  public onTestClosure(): void {
    const funcs = [];

    let a = "First";
    funcs.push(() => {
      console.log(a);
    });

    a = "Second";
    funcs.push(() => {
      console.log(a);
    });

    a = "Opps";
    funcs[0]();
    funcs[1]();

  }


  uploadFile(files) {
    console.log(files);
  }

}

@Directive({
  selector: '[fileDragDrop]'
})
export class FileDragDropDirective {
	
  @Output() onFileDropped = new EventEmitter<any>();
	
  @HostBinding('style.background-color') private background = '#f5fcff'
  @HostBinding('style.opacity') private opacity = '1'
	
  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    console.log('dragover');

    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8'
  }
	
  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    console.log('dragleave');

    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff'
    this.opacity = '1'
  }
	
  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    console.log('drop');

    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff'
    this.opacity = '1'
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }
  }
}
