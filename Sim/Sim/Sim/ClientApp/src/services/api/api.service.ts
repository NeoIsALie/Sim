import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class SignInUser {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<SignInUser>(environment.apiBaseURL + 'session/', { username, password }, { observe: 'response' });
  }

  register(email: string, username: string, password: string) {
    const user: any = {
      email,
      username,
      password
    };
    return this.http.post<any>(environment.apiBaseURL + 'users/', user, { observe: 'response' });
  }

  getTopPlayers() {
    return this.http.get<any>(environment.apiBaseURL + 'users/', { });
  }

  getRooms() {
    return this.http.get<any>(environment.apiBaseURL + 'rooms/', { });
  }

  addRoom(leaderId: string, name: string, gameConfigurationId:number, maxPlayers: number) {
    const room: any = {
      name: name,
      leaderId: leaderId,
      gameConfigurationId: gameConfigurationId,
      maxPlayers: maxPlayers
    };
    return this.http.post<any>(environment.apiBaseURL + 'rooms/', room, { observe: 'response' });
  }

  getRoomPlayers(id: number) {
    return this.http.get(environment.apiBaseURL + 'rooms/' + String(id), { });
  }

  getConfigurations() {
    return this.http.get(environment.apiBaseURL + 'configurations/', { });
  }

  getUserInfo(id: string) {
    return this.http.get(environment.apiBaseURL + 'users/' + id, { });
  }
}
