import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api/api.service';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/auth/auth.service';
import { Router } from '@angular/router';

export interface PlayerInfo {
  id: string;
  name: string;
  wins: number;
  defeats: number;
};

@Component({
  selector: 'app-top-players',
  templateUrl: './top-players.component.html',
  styleUrls: ['./top-players.component.css']
})

export class TopPlayersComponent implements OnInit {
  topPlayers: PlayerInfo[] = [];

  constructor(private apiService: ApiService,
    private authService: AuthService,
    private notifier: NotifierService,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate['auth'];
      return;
    }

    this.apiService.getTopPlayers().subscribe((res) => {
      let players: PlayerInfo[] = [];
      res.forEach((element: PlayerInfo) => {
        players.push(element);
      });
      this.topPlayers = players;
      this.topPlayers.sort(function (a, b) {
        return b.wins - a.wins;
      });
    }, (err) => {
      console.log(err);
      this.notifier.notify('error', 'Не удалось получить список лидеров');
    });
  }
}
