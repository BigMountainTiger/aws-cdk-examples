import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userIsAuthenticated = true;
  private targetUrl = '';

  constructor() { }

  public setTargetUrl(url) {
    this.targetUrl = url;
    console.log(this.targetUrl);
  }

  public setIsAuthenticated(userIsAuthenticated) {
    this.userIsAuthenticated = userIsAuthenticated;
  }

  public isAuthenticated() {
    return this.userIsAuthenticated;
  }
}
