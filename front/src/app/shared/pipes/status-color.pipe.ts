import { Pipe } from "@angular/core";
import { StatusType } from "@shared/models/status.model";

@Pipe({
  name: 'statusColor',
  pure: true
})
export class StatusColorPipe {
  transform(type: StatusType): string {
    switch (type) {
      case 'error':
        return 'error-color';
      case 'warning':
        return 'warning-color';
      case 'success':
        return 'success-color';
      case 'empty':
      case 'info':
      default:
        return 'info-color';
    }
  }
}
