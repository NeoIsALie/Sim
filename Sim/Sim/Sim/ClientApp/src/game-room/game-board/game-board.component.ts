import { Component, ViewChild, ElementRef, OnInit, Input, AfterViewInit } from '@angular/core';
import { PaperScope, Project, Path, Point, Color } from 'paper';
import { environment } from 'src/environments/environment';
import { GameConfiguration, MyPoint } from 'src/models/gameConfiguration';
import { SignalrService } from 'src/services/signalr/signalr.service';
import { PlayerAction } from 'src/models/playerAction';
import { NotifierService } from 'angular-notifier';
import { MessageStreamService, StreamMessage } from 'src/services/message-stream/message-stream.service';

class Line {
  start: Point;
  end: Point;

  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }
}

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})

export class GameBoardComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef;

  @Input() currentPlayerId: string;
  @Input() playerId: string;
  @Input() gameConfiguration: GameConfiguration = new GameConfiguration();
  @Input() roomId: number;

  scope: PaperScope;
  project: Project;

  points: MyPoint[];

  curPlayerColor: Color = new Color('red'); // TODO прокинуть сюда список игроков и брать из списка по ID

  circles: Path.Circle[] = new Array();
  path: Path.Line;
  startPoint = new Point(-1, -1);
  endPoint = new Point(-1, -1);
  lines: Line[] = [];

  constructor(private signalR: SignalrService,
    private notifierService: NotifierService,
    private messageStream: MessageStreamService,
  ) {
    this.messageStream.getMessage().subscribe((msg: StreamMessage) => {
      if (msg.type === 'config') {
        this.gameConfiguration = msg.data;
        this.points = this.gameConfiguration.points;
      }
    });

    this.addGameActionHandler();
  }

  ngOnInit() {
    this.messageStream.sendMessage('curPlayer', this.currentPlayerId);
  }

  ngAfterViewInit() {
    this.scope = new PaperScope();
    this.project = new Project(this.canvas.nativeElement);
    this.initCircles();
    this.circles.forEach((circle) => {
      circle.onMouseEnter = (e) => {
        circle.dashArray = environment.dashOptions;
      }

      circle.onMouseLeave = (e) => {
        circle.dashArray = [];
      }

      circle.onMouseDown = (e) => {
        if (this.currentPlayerId == this.playerId) {
          this.path = new Path();
        }
      };

      circle.onMouseDrag = (e) => {
        //this.mouseDragHandler(e, circle);
        if (this.currentPlayerId == this.playerId) {
          this.path.removeSegments();
          this.startPoint = circle.getNearestPoint(e.point);

          this.path = new Path.Line({
            from: this.startPoint,
            to: e.point,
            strokeWidth: environment.linesWidth,
            strokeColor: this.curPlayerColor
          });

          if (!this.check(e.point)) {
            this.path.removeOnUp();
          }
        }
      };

      circle.onMouseUp = (e) => {
        //this.mouseUpHandler(e, circle);
        if (this.currentPlayerId == this.playerId) {
          this.path.removeSegments();

          var endPoint = circle.getNearestPoint(this.startPoint);
          if (!this.checkIfExist(this.startPoint, endPoint)) {
            this.path = new Path.Line({
              from: this.startPoint,
              to: endPoint,
              strokeWidth: environment.linesWidth,
              strokeColor: this.curPlayerColor
            });

            this.lines.push(new Line(this.startPoint, endPoint));

            this.sendGameAction(this.startPoint, endPoint);
          }
        }
      }
    });
  }

  addGameActionHandler() {
    this.signalR.hubConnection.on('GameAction', (playerAction: PlayerAction, nextPlayerId: string) => {
      const startPoint = this.points[playerAction.from];
      const endPoint = this.points[playerAction.to];
      new Path.Line({
        from: startPoint,
        to: endPoint,
        strokeWidth: environment.linesWidth,
        strokeColor: this.curPlayerColor
      });
      this.currentPlayerId = nextPlayerId;
      this.curPlayerColor = new Color('red'); // TODO
      this.messageStream.sendMessage('curPlayer', this.currentPlayerId);
    });
  }

  initCircles() {
    for (var i = 0; i < this.points.length; i++) {
      var circle = new Path.Circle({
        center: [this.points[i].x, this.points[i].y],
        radius: environment.circleOptions.radius,
        fillColor: environment.circleOptions.fillColor,
        strokeWidth: environment.circleOptions.strokeWidth,
        strokeColor: environment.circleOptions.strokeColor
      });

      this.circles.push(circle);
    }
  }

  mouseDragHandler(e: any, circle: Path.Circle) {
    if (this.currentPlayerId == this.playerId) {
      this.path.removeSegments();
      this.startPoint = circle.getNearestPoint(e.point);

      this.path = new Path.Line({
        from: this.startPoint,
        to: e.point,
        strokeWidth: environment.linesWidth,
        strokeColor: this.curPlayerColor
      });

      if (!this.check(e.point)) {
        this.path.removeOnUp();
      }
    }
  }

  mouseUpHandler(e: any, circle: Path.Circle) {
    if (this.currentPlayerId == this.playerId) {
      this.path.removeSegments();

      var endPoint = circle.getNearestPoint(this.startPoint);
      if (!this.checkIfExist(this.startPoint, endPoint)) {
        this.path = new Path.Line({
          from: this.startPoint,
          to: endPoint,
          strokeWidth: environment.linesWidth,
          strokeColor: this.curPlayerColor
        });

        this.lines.push(new Line(this.startPoint, endPoint));

        this.sendGameAction(this.startPoint, endPoint);
      }
    }
  }

  checkIfExist(startPoint: Point, endPoint: Point): boolean {
    for (let i = 0; i < this.lines.length; i++) {
      if ((this.lines[i].start === startPoint && this.lines[i].end === endPoint) ||
        (this.lines[i].end === startPoint && this.lines[i].start === endPoint)) {
        return true;
      }
    }

    return false;
  }

  check(point: { x: number, y: number }) : boolean  {
    for (var i = this.points.length - 1; i >= 0; i--) {
      if (((point.x - this.points[i].x)*(point.x - this.points[i].x) + 
           (point.y - this.points[i].y)*(point.y - this.points[i].y)) <= 
          environment.circleOptions.radius * environment.circleOptions.radius)
        return true;
    }
    return false;
  }

  sendGameAction(start: Point, end: Point) {
    const startIndex = this.points.findIndex(p => p.x === start.x &&
      p.y === start.y);
    const endIndex = this.points.findIndex(p => p.x === end.x && p.y === end.y);
    this.signalR.gameAction(this.roomId, this.playerId, startIndex, endIndex)
      .catch((err) => {
        console.log(err);
        this.notifierService.notify('error',
          'Ошибка отправки данных о ходе: ' + err.statusText);
      });
  }
}
