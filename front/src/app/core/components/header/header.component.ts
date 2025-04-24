import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  public isMobile = false;
  public isAuthenticated$!: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    this.authService.checkAuthStatus();

    this.breakpointObserver
      .observe(['(max-width: 599px)'])
      .subscribe((result) => {
        this.isMobile = result.matches;
        if (!result.matches && this.drawer && this.drawer.opened) {
          this.drawer.close();
        }
      });
  }

  public isAuthRoute(): boolean {
    return (
      this.router.url.startsWith('/auth') ||
      this.router.url.startsWith('/login') ||
      this.router.url.startsWith('/register')
    );
  }

  public onLogout(): void {
    this.authService.logout().subscribe({
      complete: () => {
        if (this.drawer.opened) {
          this.drawer.close();
          this.enableScrolling();
        }
        this.router.navigate(['/auth/login']);
      },

    });
  }

  public toggleDrawer(): void {
    if (!this.drawer) return;

    if (this.drawer.opened) {
      this.drawer.close();
      this.enableScrolling();
    } else {
      this.drawer.open();
      this.disableScrolling();
    }
  }

  public enableScrolling(): void {
    document.body.style.overflow = '';
  }

  private disableScrolling(): void {
    document.body.style.overflow = 'hidden';
  }
}
