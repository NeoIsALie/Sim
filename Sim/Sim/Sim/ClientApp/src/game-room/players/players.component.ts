import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Player } from 'src/models/player';
import { MessageStreamService, StreamMessage } from 'src/services/message-stream/message-stream.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})

export class PlayersComponent implements OnInit {
  @Input() playersList: Player[];
  @Input() leaderId: string;
  currentPlayer: string;

  constructor(private messageStream: MessageStreamService) {
    this.messageStream.getMessage().subscribe((msg: StreamMessage) => {
      if (msg.type === 'curPlayer') {
        this.currentPlayer = msg.data;
      }
    })
  }

  ngOnInit() {
    
  }

}
