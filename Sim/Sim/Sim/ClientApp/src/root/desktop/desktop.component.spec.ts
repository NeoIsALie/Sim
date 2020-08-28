import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { DesktopComponent } from './desktop.component';
import { TopPlayersComponent } from '../top-players/top-players.component';
import { RoomsListComponent } from '../rooms-list/rooms-list.component';
import { GrdFilterPipe } from '../rooms-list/grd-filter.pipe';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { StatusEditerPipe } from '../rooms-list/status-editer.pipe';
import { SharedModule } from 'src/shared/shared.module';
import { AuthService } from 'src/auth/auth.service';
import { ApiService } from 'src/services/api/api.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NotifierModule } from 'angular-notifier';
import { MessageStreamService } from 'src/services/message-stream/message-stream.service';


describe('DesktopComponent', () => {
  let component: DesktopComponent;
  let fixture: ComponentFixture<DesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DesktopComponent,
        TopPlayersComponent,
        RoomsListComponent,
        GrdFilterPipe,
        StatusEditerPipe
      ],
      imports: [
        FormsModule,
        Ng2OrderModule,
        SharedModule,
        HttpClientModule,
        RouterTestingModule,
        NotifierModule
      ],
      providers: [
        AuthService,
        ApiService,
        NotifierService,
        MessageStreamService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
