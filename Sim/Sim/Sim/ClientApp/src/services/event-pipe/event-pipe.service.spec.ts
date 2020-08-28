import { TestBed } from '@angular/core/testing';

import { EventPipeService } from './event-pipe.service';

describe('EventPipeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventPipeService = TestBed.get(EventPipeService);
    expect(service).toBeTruthy();
  });
});
