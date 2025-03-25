import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StatusType } from '@shared/models/status.model';



@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('messageState', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('hidden => visible', animate('300ms ease-out')),
      transition('visible => hidden', animate('200ms ease-in'))
    ])
  ]
})
export class AlertComponent implements AfterViewInit {
  @Input() id!: number;
  @Input() type: StatusType = 'info';
  @Input() message: string = '';
  @Input() duration: number = 5000;
  @Input() dismissible: boolean = true;

  @Output() dismissed = new EventEmitter<number>();
  @Output() animationCompleted = new EventEmitter<void>();

  state: 'visible' | 'hidden' = 'hidden';

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.state = 'visible';
    this.cdr.detectChanges();
  }

  startExitAnimation() {
    this.state = 'hidden';
    this.cdr.detectChanges();
  }

  onAnimationDone(event: any) {
    if (event.toState === 'hidden') {
      this.dismissed.emit(this.id);
      this.animationCompleted.emit();
    }
  }

  dismiss() {
    this.startExitAnimation();
  }
}
