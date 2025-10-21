import { Component } from '@angular/core';
import { Router, provideRouter, RouterOutlet, RouterLink } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './app/components/navbar/navbar.component';
import { NavbarUnloggedComponent } from './app/components/navbar-unlogged/navbar-unlogged.component';
import { AuthService } from './app/services/auth.service';
import { routes } from './app/app.routes';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, NavbarUnloggedComponent, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, RouterLink],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="over" [fixedInViewport]="true" [opened]="false" class="custom-sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/" (click)="sidenav.close()">Home</a>
          <a mat-list-item routerLink="/create" (click)="sidenav.close()">Write</a>
          <a mat-list-item [routerLink]="['/profile', username]" (click)="sidenav.close()">Profile</a>
          <a mat-list-item (click)="logout(); sidenav.close()">Logout</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <div class="app">
          <app-navbar *ngIf="authService.isLoggedIn()" (toggleSidenav)="sidenav.toggle()"></app-navbar>
          <app-navbar-unlogged *ngIf="!authService.isLoggedIn()" (toggleSidenav)="sidenav.toggle()"></app-navbar-unlogged>
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content> 
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      background-color: #1a1a1a;
      color: #ffffff;
    }

    .custom-sidenav {
      width: 250px;
      background-color: #111111;
      color: #ffffff;
    }

    .mat-list-item {
      color: #ffffff;
    }

    .mat-list-item:hover {
      background-color: rgba(34, 197, 94, 0.1);
      color: #22c55e;
    }

    .app {
      min-height: 100vh;
      background-color: #1a1a1a;
    }
  `]
})
export class App {
  username: string | null = null;

  constructor(public authService: AuthService, private router: Router) {
    this.authService.currentUser.subscribe((user: any) => {
      this.username = user ? user.username : null;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    AuthService,
    provideAnimations()
  ]
});