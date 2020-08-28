import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPlayersComponent } from './top-players.component';
import { ApiService } from 'src/services/api/api.service';
import { HttpClientModule } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { NotifierModule } from 'angular-notifier';
import { AuthService } from 'src/auth/auth.service';


describe('TopPlayersComponent', () => {
  let component: TopPlayersComponent;
  let fixture: ComponentFixture<TopPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopPlayersComponent ],
      imports: [ 
        HttpClientModule,
        NotifierModule
      ],
      providers: [ 
        ApiService,
        AuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
