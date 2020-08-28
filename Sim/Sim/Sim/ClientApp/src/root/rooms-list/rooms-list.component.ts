import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ApiService } from 'src/services/api/api.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { GameConfiguration } from 'src/models/gameConfiguration';
import { MessageStreamService } from 'src/services/message-stream/message-stream.service';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from 'src/auth/auth.service';

export interface RoomInfo {
  id: number;
  leaderId: string;
  name: string;
  configId: number;
  playersCount: number;
  maxPlayersCount: number;
  status: boolean;
}

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.css']
})

export class RoomsListComponent implements OnInit, OnDestroy {
  configurationsList: GameConfiguration[] = [];
  roomsList: RoomInfo[] = [];

  key: string = 'name';
  reverse: boolean = false;
  timer: NodeJS.Timer; 
  searchText: string = '';

  constructor(private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private notifier: NotifierService,
    private messageStream: MessageStreamService
  ) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate['auth'];
      return;
    }

    this.apiService.getConfigurations().subscribe((res: object[]) => {
      res.forEach((element: GameConfiguration) => {
        this.configurationsList.push(element);
      });
    }, (err) => {
      console.log(err);
      this.notifier.notify('error',
        'Ошибка загрузки существующих конфигураций игры: ' + err.statusText);
    });

    this.loadRooms();
    //this.initRoomUpdateTimer();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  loadRooms() {
    this.apiService.getRooms().subscribe((res) => {
      let newRooms = [];
      res.forEach((element) => {
        const room: RoomInfo = {
          id: element.id,
          name: element.name,
          playersCount: element.currentPlayersCount,
          maxPlayersCount: element.maxPlayers,
          leaderId: element.leaderId,
          status: element.status,
          configId: element.gameConfigurationId 
        };
        newRooms.push(room);
      });
      this.roomsList = newRooms;
    }, (err) => {
      console.log(err);
      this.notifier.notify('error', 'Не удалось получить список комнат: ' + err.statusText);
    });
  }

  selectRoom(roomId: number): void {
    const room = this.roomsList.find(r => r.id === roomId)
    this.router.navigate(['rooms', roomId])
      .then(() => {
        this.messageStream.sendMessage('config', this.configurationsList.find(g => g.id === room.configId));
        this.messageStream.sendMessage('leaderId', room.leaderId);
      })
      .catch(() => {
        this.notifier.notify('error', 'Не удалось подключиться к комнате');
      });
  }

  initRoomUpdateTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.loadRooms();
    }, environment.roomsUpdateInterval);
  }

  getConfigurationName(configId: number): string {
    const config = this.configurationsList.find(conf => conf.id === configId);
      if (config)
        return config.name;
      else
        return '';
  }
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
}
