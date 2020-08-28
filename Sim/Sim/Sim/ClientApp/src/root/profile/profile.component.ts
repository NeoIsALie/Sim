import { Component, OnInit } from '@angular/core';
import { PlayerInfo } from '../top-players/top-players.component';
import { AuthService } from 'src/auth/auth.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api/api.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  userId: string;
  user: PlayerInfo = { name: '', id: '', wins: 0, defeats: 0};
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private notifier: NotifierService,
    private router: Router
  ) {
    this.userId = this.authService.getUserId();
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['auth']);
      return;
    }

    this.apiService.getUserInfo(this.userId).subscribe((res: PlayerInfo) => {
      this.user.id = res.id;
      this.user.name = res.name;
      this.user.wins = res.wins;
      this.user.defeats = res.defeats;
    }, (err) => {
      console.log(err);
      this.notifier.notify('error', 'Не удалось получить данные о пользователе: ' + err.statusText);
    });
  }

  signout(): void {
    this.authService.logout();
    this.router.navigate(['auth']);
  }
}
