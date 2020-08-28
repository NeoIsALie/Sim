import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusEditer'
})

export class StatusEditerPipe implements PipeTransform {
  transform(status: boolean): string {
    if (status)
      return 'Игра идёт';
      
    return 'Игроки в лобби';
  }
}
