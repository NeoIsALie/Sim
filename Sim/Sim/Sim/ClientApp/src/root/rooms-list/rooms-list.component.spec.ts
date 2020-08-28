import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsListComponent } from './rooms-list.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { GrdFilterPipe } from './grd-filter.pipe';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { StatusEditerPipe } from './status-editer.pipe';
import { ApiService } from 'src/services/api/api.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NotifierModule } from 'angular-notifier';
import { MessageStreamService } from 'src/services/message-stream/message-stream.service';
import { AuthService } from 'src/auth/auth.service';


describe('RoomsListComponent', () => {
  let component: RoomsListComponent;
  let fixture: ComponentFixture<RoomsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        RoomsListComponent,
        GrdFilterPipe,
        StatusEditerPipe
      ],
      imports: [
        FormsModule,
        Ng2OrderModule,
        HttpClientModule,
        RouterTestingModule,
        NotifierModule
      ],
      providers: [ 
        ApiService,
        NotifierService,
        MessageStreamService,
        AuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
