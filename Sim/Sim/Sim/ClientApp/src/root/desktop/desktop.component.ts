import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/services/api/api.service';
import { NotifierService } from 'angular-notifier';
import { GameConfiguration } from 'src/models/gameConfiguration';
import { MessageStreamService } from 'src/services/message-stream/message-stream.service';
import { AuthService } from 'src/auth/auth.service';
declare var Constellation: any;

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.css']
})

export class DesktopComponent implements OnInit {
  @ViewChild('stars', {static: true}) stars;

  configurationsList: GameConfiguration[] = [];

  leaderId: string;
  roomName: string;
  playersCount: number;
  configId: number;

  constructor(private router: Router,
    private apiService: ApiService,
    private notifierService: NotifierService,
    private authService: AuthService,
    private messageStream: MessageStreamService
  ) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['auth']);
      return;
    }

    this.getConfigurations();

    new Constellation(this.stars, environment.starsOptions).init();
    this.playersCount = 2;
    this.leaderId = this.authService.getUserId();
  }

  getConfigurations() {
    this.apiService.getConfigurations().subscribe((res: object[]) => {
      this.configurationsList = [];
      res.forEach((element: GameConfiguration) => {
        this.configurationsList.push(element);
      });
      this.configId = this.configurationsList[0].id;
    }, (err) => {
      console.log(err);
      this.notifierService.notify('error',
        'Ошибка загрузки существующих конфигураций игры: ' + err.statusText);
    });
  }

  selectCount(event: any): void {
    this.playersCount = event.target.value;
  }

  selectConfiguration(event: any): void {
    this.configId = event.target.value;
  }

  createRoom(): void {
    this.apiService.addRoom(this.leaderId, this.roomName, this.configId, this.playersCount).subscribe((res) => {
      this.router.navigate(['rooms/', res.body.id])
        .then(() => {
          this.messageStream.sendMessage('config', this.configurationsList.find(g => g.id === this.configId));
          this.messageStream.sendMessage('leaderId', this.leaderId);
        });
    }, (err) => {
      this.notifierService.notify('error', 'Ошибка создания комнаты: ' + err.statusText);
    });
  }

  cancelModal(): void {
    this.playersCount = 2;
    this.configId = this.configurationsList[0].id;
  }
}
