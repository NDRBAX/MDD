import { Pipe, PipeTransform } from '@angular/core';
import { StatusType } from '@shared/models/status.model';

@Pipe({
  name: 'iconType',
  pure: true
})
export class IconTypePipe implements PipeTransform {
  transform(type: StatusType): string {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'check_circle';
      case 'empty':
        return 'inventory_2';
      case 'info':
      default:
        return 'info';
    }
  }
}
