import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier'

import { environment } from '../environments/environment';
import { ApiService } from '../services/api/api.service'
import { SignalrService } from 'src/services/signalr/signalr.service';
import { PlayerInfo } from 'src/root/top-players/top-players.component';
import { AuthService } from 'src/auth/auth.service';
import { GameConfiguration } from 'src/models/gameConfiguration';
import { Player } from 'src/models/player';
import { MessageStreamService, StreamMessage } from 'src/services/message-stream/message-stream.service';

declare var Constellation: any;

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})

export class GameRoomComponent implements OnInit {
  @ViewChild('stars', {static: true}) stars;

  roomId: number;
  playerId: string = '';
  currentPlayerId: string = '';
  leaderId: string = '';
  gameConfiguration: GameConfiguration = {id: 0, name: '', points: []};
  playersList: Player[] = [];
  colorsList: any[] = ['red', 'green', 'blue', 'pink'];
  isStartGame: boolean = false;
  isDefeate: boolean = false;
  isWin: boolean = false;

  constructor(private activateRoute: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private notifierService: NotifierService,
    private signalR: SignalrService,
    private router: Router,
    private messageStream: MessageStreamService,
  ) {
      this.activateRoute.params.subscribe(params => this.roomId = Number(params['id']));

      this.messageStream.getMessage().subscribe((msg: StreamMessage) => {
        if (msg.type === 'config') {
          this.gameConfiguration = msg.data;
        } else if (msg.type === 'leaderId') {
          this.leaderId = msg.data;
        }
      });
      this.playerId = this.authService.getUserId();
      this.addWebSocketHandlers();
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['auth']);
      return;
    }

    this.signalR.startConnection()
      .then(() => {
        this.signalR.connectToRoom(this.roomId, this.playerId)
          .catch((err) => {
            console.log('Ошибка подключения к комнате');
            console.log(err);
            this.notifierService.notify('error', 'Ошибка подключения к комнате: ' + err.statusText);
            this.router.navigate(['desktop']);
          });
      })
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

    new Constellation(this.stars, environment.starsOptions).init();
  }

  getPlayers() {
    this.apiService.getRoomPlayers(this.roomId).subscribe((res: object[]) => {
      if (res) {
        let newPlayers: Player[] = [];
        res.forEach((element: PlayerInfo) => {
          const player: Player = new Player(element, this.colorsList.pop());
          newPlayers.push(player);
        });
        this.playersList = newPlayers;
      }
    }, (err) => {
      console.log('Ошибка загрузки игроков в комнате');
      console.log(err);
      this.notifierService.notify('error', 'Ошибка загрузки игроков в комнате: ' + err.statusText);
    });
  }

  leaveRoom() {
    this.signalR.disconnectFromRoom(this.roomId, this.playerId)
      .then(() => {
        this.signalR.endConnection()
          .then(() => {
            this.router.navigate(['desktop']);
          });
      })
      .catch((err) => {
        this.notifierService.notify('error', 'Ошибка отключения от комнаты: ' + err.statusText);
      });
  }

  addWebSocketHandlers() {
    this.signalR.hubConnection.on('PlayerConnect', (leaderId: string, playerInfo: PlayerInfo) => {
      this.playerConnectHandler(leaderId, playerInfo);
    });

    this.signalR.hubConnection.on('PlayerDisconnect', (playerId: string) => {
      this.playerDisonnectHandler(playerId);
    });

    this.signalR.hubConnection.on('StartGame', (playerId: string) => {
      this.startGameHandler(playerId);
    });

    this.signalR.hubConnection.on('LoseGame', (defeateId: string) => {
      this.loseGameHandler(defeateId);
    });

    this.signalR.hubConnection.on('EndGame', (winId: string) => {
      this.winGameHandler(winId);
    });
  }

  startGame(flag: boolean): void {
    if (this.playersList.length > 1) {
      //this.isStartGame = flag;
      this.signalR.startGame(this.roomId, this.playerId)
        .then(() => {
          this.notifierService.notify('success', 'Игра началась!');
        })
        .catch((err) => {
          this.notifierService.notify('error', 'Невозможно начать игру')
        });
    } else {
      this.notifierService.notify('error', 'Недостаточно игроков в комнате');
    }
  }

  playerConnectHandler(leaderId: string, playerInfo: PlayerInfo) {
    this.leaderId = leaderId;
    let newList = [];
    this.playersList.forEach(v => newList.push(v));
    this.playersList = [];
    const player: Player = new Player(playerInfo, this.colorsList.pop());
    newList.push(player);
    this.playersList = newList;
  }

  playerDisonnectHandler(playerId: string) {
    const index = this.playersList.findIndex((item) => item.id === playerId);
    this.colorsList.push(this.playersList[index].color);
    if (index > -1) {
      this.playersList.splice(index, 1);
    }
    this.playersList = this.playersList.slice();
  }

  startGameHandler(playerId: string) {
    this.currentPlayerId = playerId;
    this.isStartGame = true;
    this.notifierService.notify('success', 'Игра началась!');
  }

  loseGameHandler(defeateId: string) {
    if (defeateId === this.playerId) {
      // модальное окно
      this.notifierService.notify('error', 'Вы проиграли');
      this.isDefeate = true;
    }
    else {
      const loser = this.playersList.find(p => p.id === defeateId);
      this.notifierService.notify('info', 'Игрок ' + loser.name + ' проиграл');
    }
  }

  winGameHandler(winId: string) {
    this.isWin = true;
    this.notifierService.notify('success', 'Игрок  выиграл');
    // моадльное окно
  }
}
