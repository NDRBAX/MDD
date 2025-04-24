import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonType, ColorType } from '@shared/models/button.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent{
  @Input() color!: ColorType;
  @Input() type!: ButtonType;
  @Input() label!: string;
  @Input() disabled$!: Observable<boolean>;
  @Output() onClick = new EventEmitter<any>();


  isDisabled(): boolean {
    if (typeof this.disabled$ === 'boolean') {
      return this.disabled$;
    }
    return false;
  }

  getColorClass() {
    return {
      'primary-color': this.color === 'primary',
      'secondary-color': this.color === 'secondary',
      'white-color': this.color === 'white',
      '': this.color === 'none',
    };
  }
}
