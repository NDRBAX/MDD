import { Component, Input, OnInit } from '@angular/core';
import { isObservable, Observable, of } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent{
  @Input() isLoading$!: Observable<boolean>;
  @Input() message: string = 'Chargement...';
}
