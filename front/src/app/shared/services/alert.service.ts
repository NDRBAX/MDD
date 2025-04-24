import {
  Injectable,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { StatusType } from '@shared/models/status.model';
import { Subject, takeUntil, timer } from 'rxjs';

interface ActiveAlert {
  id: number;
  componentRef: any;
  destroy$: Subject<void>;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertContainer: HTMLElement;
  private activeAlerts: ActiveAlert[] = [];
  private counter = 0;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) {
    this.alertContainer = this.createAlertContainer();
  }

  show(
    message: string,
    type: StatusType = 'info',
    duration: number = 5000
  ): number {
    const alertId = ++this.counter;
    const destroy$ = new Subject<void>();

    // Create the alert component
    const componentRef = createComponent(AlertComponent, {
      environmentInjector: this.environmentInjector,
      hostElement: document.createElement('div'),
    });

    // Set the component properties
    componentRef.instance.message = message;
    componentRef.instance.type = type;
    componentRef.instance.dismissible = true;
    componentRef.instance.id = alertId;

    // Set the dismiss event
    componentRef.instance.dismissed.pipe(takeUntil(destroy$)).subscribe(() => {
      this.removeAlert(alertId);
    });

    // Display the alert
    this.appRef.attachView(componentRef.hostView);
    this.alertContainer.appendChild(componentRef.location.nativeElement);

    // Add the alert to the active alerts array
    this.activeAlerts.push({ id: alertId, componentRef, destroy$ });

    // Set a timer to remove the alert after the specified duration
    if (duration > 0) {
      timer(duration)
        .pipe(takeUntil(destroy$))
        .subscribe(() => this.removeAlert(alertId));
    }
    return alertId;
  }

  success(message: string, duration: number = 5000): number {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration: number = 5000): number {
    return this.show(message, 'error', duration);
  }

  info(message: string, duration: number = 5000): number {
    return this.show(message, 'info', duration);
  }

  warning(message: string, duration: number = 5000): number {
    return this.show(message, 'warning', duration);
  }

  empty(message: string, duration: number = 5000): number {
    return this.show(message, 'empty', duration);
  }

  closeAlert(id: number): void {
    this.removeAlert(id);
  }

  private removeAlert(id: number): void {
    const index = this.activeAlerts.findIndex((a) => a.id === id);
    if (index !== -1) {
      const alert = this.activeAlerts[index];

      // Clean up the subject
      alert.destroy$.next();
      alert.destroy$.complete();

      // Run the exit animation
      alert.componentRef.instance.startExitAnimation();

      // Subscribe to the animation completed event
      alert.componentRef.instance.animationCompleted
      .pipe(takeUntil(new Subject()))
      .subscribe(() => {
        // Remove the component from the DOM
        this.appRef.detachView(alert.componentRef.hostView);
        alert.componentRef.destroy();

        // Remove the alert from the active alerts array
        this.activeAlerts.splice(this.activeAlerts.findIndex(a => a.id === id), 1);
      });
    }
  }

  private createAlertContainer(): HTMLElement {
    // Check if the alert container already exists
    let container = document.getElementById('alert-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'alert-container';

      // Styles
      Object.assign(container.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '1000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
        maxWidth: '400px',
        width: '100%',
        boxSizing: 'border-box',
      });

      document.body.appendChild(container);
    }

    return container;
  }
}
