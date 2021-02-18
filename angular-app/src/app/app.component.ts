import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Example Angular App';

  constructor(public auth: AuthService, private router: Router) { }

  public Logout() {
    this.auth.setIsAuthenticated(false);
    this.router.navigate(['login']);
    return false;
  }
}
