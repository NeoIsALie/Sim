import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs'
import { filter, map } from 'rxjs/operators'

export class Event {
  type: string;
  data: any;

  constructor(type, data) {
    this.type = type;
    this.data = data;
  }
}

@Injectable({
  providedIn: 'root'
})
export class EventPipeService {
  private subject = new Subject();

  constructor() { }

  emit(event: Event) {
    this.subject.next(event);
  }

  on(eventType: string, handler: any): Subscription {
    return this.subject.pipe(
      filter((e: Event) => e.type == eventType),
      map((e: Event) => e.data)).subscribe(handler);
  }
}
