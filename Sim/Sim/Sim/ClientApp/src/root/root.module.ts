import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NotifierModule } from 'angular-notifier';

import { RootComponent } from './root.component';
import { TopPlayersComponent } from './top-players/top-players.component';
import { RoomsListComponent } from './rooms-list/rooms-list.component';
import { GrdFilterPipe } from './rooms-list/grd-filter.pipe';
import { StatusEditerPipe } from './rooms-list/status-editer.pipe';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { AuthModule } from '../auth/auth.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ApiService } from 'src/services/api/api.service';
import { GameRoomModule } from '../game-room/game-room.module';
import { SharedModule } from '../shared/shared.module';
import { DesktopComponent } from './desktop/desktop.component';
import { RootRoutingModule } from './root-routing.module';
import { ApiInterceptor } from 'src/services/api/api-interceptor';
import { MessageStreamService } from 'src/services/message-stream/message-stream.service';
import { SignalrService } from 'src/services/signalr/signalr.service';


@NgModule({
  declarations: [
    RootComponent,
    TopPlayersComponent,
    RoomsListComponent,
    GrdFilterPipe,
    StatusEditerPipe,
    DesktopComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Ng2OrderModule,
    AuthModule,
    RouterTestingModule,
    HttpClientModule,
    GameRoomModule,
    SharedModule,
    RootRoutingModule,
    NotifierModule.withConfig({
      behaviour: {
        stacking: 2
      },
      position: {
        horizontal: {
          position: 'right',
        },
        vertical: {
          position: 'top',
          distance: 70
        }
      }
    })
  ],
  providers: [
    MessageStreamService,
    SignalrService,
    AuthService,
    ApiService, {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [RootComponent]
})
export class RootModule { }
