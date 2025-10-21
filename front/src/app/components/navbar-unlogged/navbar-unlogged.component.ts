import { Component, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar-unlogged',
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar-unlogged.component.html',
  styleUrls: ['./navbar-unlogged.component.css'],
})
export class NavbarUnloggedComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
}
