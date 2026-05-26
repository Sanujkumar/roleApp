import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../models';

@Pipe({ name: 'adminCount' })
export class AdminCountPipe implements PipeTransform {
  transform(users: User[]): number {
    return users.filter(u => u.role === 'ADMIN').length;
  }
}
