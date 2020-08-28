import { Injectable, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@aspnet/signalr";

import { environment } from 'src/environments/environment';
import { PlayerInfo } from 'src/root/top-players/top-players.component';
import { EventPipeService, Event } from 'src/services/event-pipe/event-pipe.service'


export class PlayerMove {

}

@Injectable()
export class SignalrService implements OnDestroy {
  hubConnection: HubConnection;

  constructor(private eventPipe: EventPipeService) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.apiBaseURL + 'gameroom',
        { accessTokenFactory: () => localStorage.getItem(environment.storage.token) })
      .build();
    //this.hubConnection.on('StartGame', (playerId: string) => {
    //  // переход на игровой экран
    //  this.eventPipe.emit(new Event('StartGame', playerId));
    //  //if (currentPlayer == playerId) {
    //  //  // позволить делать ход (это в компоненте игрового поля)
    //  //}
    //});

    //this.hubConnection.on('LoseGame', (playerId: string) => {
    //  this.eventPipe.emit(new Event('LoseGame', playerId));
    //  // Все, что ниже - это обрабатывать внутри компонента игрового поля
    //  //if (currentPlayer == playerId) {
    //  //  // отобразить модальное окно о проигрыше
    //  //}
    //  //else {
    //  //  // отобразить сообщение, что игрок такой-то проиграл
    //  //}
    //});

    //this.hubConnection.on('EndGame', (playerId: string) => {
    //  eventPipe.emit(new Event('EndGame', playerId));
    //  // Все, что ниже - это обрабатывать внутри компонента игрового поля
    //  //if (currentPlayer == playerId) {
    //  //  // отобразить модальное окно о выигрыше
    //  //}
    //  //else {
    //  //  // отобразить сообщение, что игрок такой-то выиграл
    //  //  // и вернуться на экран комнаты
    //  //}
    //});

    //this.hubConnection.on('GameMove', (playerMove: PlayerMove, nextPlayer: string) => {
    //  eventPipe.emit(new Event('GameMove', { move: playerMove, next: nextPlayer }));
    //  // Все, что ниже - это обрабатывать внутри компонента игрового поля
    //  //// отобразить в игре ход игрока
    //  //if (currentPlayer == nextPlayer) {
    //  //  // позволить делать ход
    //  //}
    //});

    //this.hubConnection.on('PlayerConnect', (player: PlayerInfo) => {
    //  eventPipe.emit(new Event('PlayerConnect', player));
    //  // отобразить в списке игроков нового игрока
    //});

    //this.hubConnection.on('PlayerDisconnect', (playerId: string) => {
    //  eventPipe.emit(new Event('PlayerDisconnect', playerId));
    //  // удалить игрока из списка игроков
    //});

    //this.hubConnection.on('PlayerLeaveGame', (playerId: string) => {
    //  eventPipe.emit(new Event('PlayerLeaveGame', playerId));
    //  // вывести сообщение, что игрок вышел из игры
    //})

    //this.hubConnection.on('Error', (message: string) => {
    //  eventPipe.emit(new Event('Error', message));
    //  // отобразить модельное окошко с сообщением об ошибке
    //});
  }

  startConnection() {
    return this.hubConnection.start();
  }

  endConnection() {
    if (this.isConnect()) {
      return this.hubConnection.stop();
    }
  }

  connectToRoom(roomId: number, playerId: string) {
    return this.hubConnection.invoke("ConnectToRoom", roomId, playerId);
  }

  disconnectFromRoom(roomId: number, playerId: string) {
    return this.hubConnection.invoke("DisconnectFromRoom", roomId, playerId);
  }

  startGame(roomId: number, playerId: string) {
    return this.hubConnection.invoke("StartGame", roomId, playerId);
  }

  leaveGame(roomId: number, gameId: number, playerId: string) {
    return this.hubConnection.invoke("LeaveGame", roomId, gameId, playerId);
  }

  gameAction(gameId: number, playerId: string, pointFrom: number, pointTo: number) {
    return this.hubConnection.invoke("GameAction", gameId, { playerid: playerId, from: pointFrom, to: pointTo });
  }

  configurationSelection(gameId: number, gameConfigurationId: number) {
    return this.hubConnection.invoke("ConfigurationSelection", gameId, gameConfigurationId);
  }

  isConnect(): boolean {
    return this.hubConnection.state == HubConnectionState.Connected;
  }

  ngOnDestroy() {
    this.endConnection();
  }
}
