import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { RootComponent } from './root.component';
import { TopPlayersComponent } from './top-players/top-players.component';
import { RoomsListComponent } from './rooms-list/rooms-list.component';
import { GrdFilterPipe } from './rooms-list/grd-filter.pipe';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { StatusEditerPipe } from './rooms-list/status-editer.pipe';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { ApiService } from 'src/services/api/api.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { GameRoomModule } from '../game-room/game-room.module';
import { SharedModule } from '../shared/shared.module';
import { DesktopComponent } from './desktop/desktop.component';
import { NotifierService } from 'angular-notifier';
import { NotifierModule } from 'angular-notifier';


describe('RootComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RootComponent,
        TopPlayersComponent,
        RoomsListComponent,
        GrdFilterPipe,
        StatusEditerPipe,
        DesktopComponent
      ],
      imports: [
        FormsModule,
        Ng2OrderModule,
        AuthModule,
        HttpClientModule,
        RouterTestingModule,
        GameRoomModule,
        SharedModule,
        NotifierModule
      ],
      providers: [
        AuthService,
        ApiService,
        NotifierService
      ]
    }).compileComponents();
  }));

  it('should create the root', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const root = fixture.debugElement.componentInstance;
    expect(root).toBeTruthy();
  });
});
