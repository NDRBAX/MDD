import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-go-back-button',
  templateUrl: './go-back-button.component.html',
  styleUrls: ['./go-back-button.component.scss']
})
export class GoBackButtonComponent {
  @Input() public navigateTo!: string;

  constructor(private router: Router) {}

  public onBack(): void {
    this.router.navigate([this.navigateTo]);
  }
}
