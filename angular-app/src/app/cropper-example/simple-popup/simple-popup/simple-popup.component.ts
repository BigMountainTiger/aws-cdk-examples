import { AfterViewInit, Component, DoCheck, OnDestroy, OnInit } from '@angular/core';

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
}
