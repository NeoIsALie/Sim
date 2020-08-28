import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoomComponent } from './game-room.component';
import { SharedModule } from '../shared/shared.module';
import { PlayersComponent } from './players/players.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { MessageStreamService } from 'src/services/message-stream/message-stream.service';
import { AuthService } from 'src/auth/auth.service';
import { ApiService } from 'src/services/api/api.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from 'src/services/api/api-interceptor';
import { NotifierModule } from 'angular-notifier';


@NgModule({
  declarations: [
    GameRoomComponent,
    PlayersComponent,
    GameBoardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
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
    AuthService,
    ApiService, {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  exports: [
    GameRoomComponent
  ]
})

export class GameRoomModule { }
