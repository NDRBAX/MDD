import { Component, Input } from '@angular/core';
import { StatusType } from '@shared/models/status.model';


@Component({
  selector: 'app-status-message',
  templateUrl: './status-message.component.html',
  styleUrls: ['./status-message.component.scss']
})
export class StatusMessageComponent {
  @Input() type: StatusType = 'info';
  @Input() message: string = '';
  @Input() appearance: 'outlined' | 'raised' = 'outlined';
}
