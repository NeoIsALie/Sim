import { PlayerInfo } from 'src/root/top-players/top-players.component';

export class Player {
  id: string;
  name: string;
  wins: number;
  defeats: number;
  color: string;

  constructor(playerInfo: PlayerInfo, color: string) {
    this.id = playerInfo.id;
    this.name = playerInfo.name;
    this.wins = playerInfo.wins;
    this.defeats = playerInfo.defeats;
    this.color = color;
  }
}
