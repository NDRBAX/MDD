import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {

  @Input() src: string = '/assets/logo_p6.png';
  @Input() alt: string = 'logo';
  @Input() maxWidth: string = '500px';
  @Input() clickable: boolean = false;
  @Input() routerLink: string = '/';
}
