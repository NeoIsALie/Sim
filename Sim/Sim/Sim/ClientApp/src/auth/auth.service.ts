import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {

  constructor() {

  }

  public logout(): void {
    localStorage.removeItem(environment.storage.token);
  }

  public isLoggedIn(): boolean {
    const token: string = localStorage.getItem(environment.storage.token);
    if (token !== null) {
      return true;
    }

    return false;
  }

  public getToken(): string {
    const token = localStorage.getItem(environment.storage.token);
    return token;
  }

  public setSession(authResult): void {
    localStorage.setItem(environment.storage.token, authResult.body);
  }

  public getUserId(): string {
    const token = localStorage.getItem(environment.storage.token);
    let id: string;
    if (token) {
      const res = jwt_decode(token);
      id = res[environment.userIdTokenKey];
    }

    return id;
  }
}
