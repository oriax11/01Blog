// navbar.component.ts
import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/article.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    NotificationDropdownComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();

  username: string | null = null;
  userId: string | null = null;
  searchText: string = '';
  isSearchFocused: boolean = false;
  showDropdown: boolean = false;
  results: User[] = [];
  isLoading: boolean = false;

  private searchSubject = new Subject<string>();

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.userId = decodedToken.sub;
      this.username = decodedToken.username;
    }

    // Debounce search input
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
  }

  isAdmin(): boolean {
    const token = this.authService.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);

      // Extract role from different possible field names
      const role = decoded.role || decoded.roles || decoded.authorities;

      // Check if role contains ADMIN
      if (Array.isArray(role)) {
        return role.some((r) => r === 'ADMIN' || r.includes('ADMIN'));
      } else if (typeof role === 'string') {
        return role === 'ADMIN' || role.includes('ADMIN');
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  onSearchInput(): void {
    if (this.searchText.trim()) {
      this.isLoading = true;
      this.showDropdown = true;
      this.searchSubject.next(this.searchText);
    } else {
      this.showDropdown = false;
      this.results = [];
      this.isLoading = false;
    }
  }

  performSearch(query: string): void {
    if (!query.trim()) {
      this.isLoading = false;
      return;
    }

    this.userService.searchUsers(query).subscribe({
      next: (data) => {
        this.results = data;
        this.isLoading = false;
        this.showDropdown = data.length > 0 || this.searchText.trim().length > 0;
      },
      error: () => {
        this.isLoading = false;
        this.results = [];
      },
    });
  }

  onSearchFocus(): void {
    this.isSearchFocused = true;
    if (this.searchText.trim() && this.results.length > 0) {
      this.showDropdown = true;
    }
  }

  onSearchBlur(): void {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      this.isSearchFocused = false;
      this.showDropdown = false;
    }, 200);
  }

  selectUser(user: User): void {
    this.router.navigate(['/profile', user.id]);
    this.clearSearch();
  }

  clearSearch(): void {
    this.searchText = '';
    this.results = [];
    this.showDropdown = false;
    this.isLoading = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const searchContainer = document.querySelector('.search-wrapper');

    if (searchContainer && !searchContainer.contains(target)) {
      this.showDropdown = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
