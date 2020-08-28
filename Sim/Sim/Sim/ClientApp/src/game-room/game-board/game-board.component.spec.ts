import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoardComponent } from './game-board.component';
import { NotifierService } from 'angular-notifier';
import { NotifierModule } from 'angular-notifier';
import { MessageStreamService, StreamMessage } from 'src/services/message-stream/message-stream.service';
import { SignalrService } from 'src/services/signalr/signalr.service';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameBoardComponent ],
      imports: [ NotifierModule ],
      providers: [
        MessageStreamService,
        NotifierService,
        SignalrService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
