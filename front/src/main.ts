import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './app/components/navbar/navbar.component';
import { NavbarUnloggedComponent } from './app/components/navbar-unlogged/navbar-unlogged.component';
import { AuthService } from './app/services/auth.service';
import { routes } from './app/app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, NavbarUnloggedComponent],
  template: `
    <div class="app">
      <app-navbar *ngIf="!authService.isLoggedIn()"></app-navbar>
      <!-- <app-navbar-unlogged *ngIf="!authService.isLoggedIn()"></app-navbar-unlogged> -->
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app {
      min-height: 100vh;
      background-color: #1a1a1a;
    }
  `]
})
export class App {
  constructor(public authService: AuthService) {}
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes)
  ]
});