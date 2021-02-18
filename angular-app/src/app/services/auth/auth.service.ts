import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userIsAuthenticated = false;

  constructor() { }

  public setIsAuthenticated(userIsAuthenticated) {
    this.userIsAuthenticated = userIsAuthenticated;
  }

  public isAuthenticated() {
    return this.userIsAuthenticated;
  }
}
