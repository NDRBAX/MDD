import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.scss'],
})
export class PostHeaderComponent {
  @Input() title: string = '';
  @Input() authorName: string = '';
  @Input() creationDate!: Date;
  @Input() topicName: string = '';
  public currentRoute!: string;
  public isDetailPage: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateRouteInfo();
    });

    this.updateRouteInfo();
  }

  private updateRouteInfo(): void {
    this.currentRoute = this.router.url;
    this.isDetailPage = this.currentRoute.match(/\/articles\/\d+/) !== null;
  }

  public getHeaderClass(): string {
    return this.isDetailPage ? 'detail-header' : 'list-header';
  }
}
