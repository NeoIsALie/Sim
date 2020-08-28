import { TestBed } from '@angular/core/testing';

import { MessageStreamService } from './message-stream.service';

describe('MessageStreamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageStreamService = TestBed.get(MessageStreamService);
    expect(service).toBeTruthy();
  });
});
