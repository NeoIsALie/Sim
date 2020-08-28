import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomComponent } from './game-room.component';
import { SharedModule } from '../shared/shared.module';
import { PlayersComponent } from './players/players.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { AuthService } from 'src/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { NotifierModule } from 'angular-notifier';
import { MessageStreamService } from 'src/services/message-stream/message-stream.service';


describe('GameRoomComponent', () => {
  let component: GameRoomComponent;
  let fixture: ComponentFixture<GameRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        GameRoomComponent,
        PlayersComponent,
        GameBoardComponent
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
        HttpClientModule,
        NotifierModule
      ],
      providers: [ 
        AuthService,
        NotifierService,
        MessageStreamService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
