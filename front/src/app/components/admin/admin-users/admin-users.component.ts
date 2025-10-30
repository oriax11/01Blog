import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/article.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1 class="admin-title">USER <span class="accent">MANAGEMENT</span></h1>
        <p class="admin-subtitle">Manage all registered users</p>
      </div>

      <div class="admin-nav">
        <a routerLink="/admin" class="nav-item">📊 DASHBOARD</a>
        <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">👥 USERS</a>
        <a routerLink="/admin/posts" class="nav-item">📝 POSTS</a>
        <a routerLink="/admin/reports" class="nav-item">🚨 REPORTS</a>
      </div>

      <div class="controls">
        <div class="search-bar">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="filterUsers()"
            placeholder="Search users by name or email..."
            class="search-input"
          />
        </div>

        <div class="filters">
          <select [(ngModel)]="statusFilter" (change)="filterUsers()" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div class="users-table">
        <div class="table-header">
          <div class="header-cell">User</div>
          <div class="header-cell">Email</div>
          <div class="header-cell">Articles</div>
          <div class="header-cell">Followers</div>
          <div class="header-cell">Status</div>
          <div class="header-cell">Actions</div>
        </div>

        <div class="table-body">
          <div class="table-row" *ngFor="let user of filteredUsers">
            <div class="cell user-cell">
              <img [src]="user.avatarUrl" [alt]="user.username" class="user-avatar" />
              <div class="user-info">
                <h3 class="user-name">{{ user.username }}</h3>
                <!-- <p class="user-bio">{{ user.bio }}</p> -->
              </div>
            </div>

            <div class="cell">{{ user.email }}</div>

            <div class="cell">
              <span class="stat-badge">{{ user.articlesCount }}</span>
            </div>

            <div class="cell">
              <span class="stat-badge">{{ user.followersCount }}</span>
            </div>

            <div class="cell">
              <span class="status-badge active">Active</span>
            </div>

            <div class="cell actions-cell">
              <button class="action-btn view" [routerLink]="['/profile', user.id]">👁️ View</button>
              <button class="action-btn ban" (click)="banUser(user.id)">🚫 Ban</button>
              <button class="action-btn delete" (click)="deleteUser(user.id)">🗑️ Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button class="page-btn" [disabled]="currentPage === 1" (click)="previousPage()">
          ← Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="page-btn" [disabled]="currentPage === totalPages" (click)="nextPage()">
          Next →
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-container {
        min-height: 100vh;
        background-color: #1a1a1a;
        padding: 2rem;
      }

      .admin-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .admin-title {
        font-family: 'Courier New', monospace;
        font-size: 3rem;
        font-weight: bold;
        color: #ffffff;
        margin: 0 0 1rem 0;
      }

      .accent {
        color: #22c55e;
      }

      .admin-subtitle {
        color: #d1d5db;
        font-size: 1.1rem;
        margin: 0;
      }

      .admin-nav {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 3rem;
        flex-wrap: wrap;
      }

      .nav-item {
        background-color: #2d2d2d;
        color: #e5e7eb;
        text-decoration: none;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        font-weight: bold;
        font-family: 'Courier New', monospace;
        transition: all 0.3s ease;
      }

      .nav-item:hover,
      .nav-item.active {
        background-color: #22c55e;
        color: #000000;
      }

      .controls {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        align-items: center;
      }

      .search-bar {
        flex: 1;
      }

      .search-input {
        width: 100%;
        background-color: #2d2d2d;
        border: 2px solid #333333;
        border-radius: 0.5rem;
        padding: 1rem;
        color: #ffffff;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      .search-input:focus {
        outline: none;
        border-color: #22c55e;
      }

      .search-input::placeholder {
        color: #9ca3af;
      }

      .filter-select {
        background-color: #2d2d2d;
        border: 2px solid #333333;
        border-radius: 0.5rem;
        padding: 1rem;
        color: #ffffff;
        font-size: 1rem;
        min-width: 150px;
      }

      .users-table {
        background-color: #1f1f1f;
        border-radius: 0.75rem;
        border: 1px solid #333333;
        overflow: hidden;
        margin-bottom: 2rem;
      }

      .table-header {
        display: grid;
        grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 2fr;
        background-color: #2d2d2d;
        padding: 1rem;
        gap: 1rem;
      }

      .header-cell {
        color: #22c55e;
        font-weight: bold;
        font-family: 'Courier New', monospace;
        text-transform: uppercase;
      }

      .table-row {
        display: grid;
        grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 2fr;
        padding: 1rem;
        gap: 1rem;
        border-bottom: 1px solid #333333;
        align-items: center;
      }

      .table-row:hover {
        background-color: #2d2d2d;
      }

      .cell {
        color: #e5e7eb;
      }

      .user-cell {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid #22c55e;
      }

      .user-name {
        color: #ffffff;
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
        font-weight: bold;
      }

      .user-bio {
        color: #9ca3af;
        margin: 0;
        font-size: 0.8rem;
        line-height: 1.3;
      }

      .stat-badge {
        background-color: #333333;
        color: #22c55e;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: bold;
      }

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: bold;
        text-transform: uppercase;
      }

      .status-badge.active {
        background-color: #22c55e;
        color: #000000;
      }

      .status-badge.banned {
        background-color: #ef4444;
        color: #ffffff;
      }

      .actions-cell {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .action-btn {
        background-color: #333333;
        color: #e5e7eb;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .action-btn.view:hover {
        background-color: #22c55e;
        color: #000000;
      }

      .action-btn.ban:hover {
        background-color: #f59e0b;
        color: #000000;
      }

      .action-btn.delete:hover {
        background-color: #ef4444;
        color: #ffffff;
      }

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
      }

      .page-btn {
        background-color: #2d2d2d;
        color: #e5e7eb;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .page-btn:hover:not(:disabled) {
        background-color: #22c55e;
        color: #000000;
      }

      .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .page-info {
        color: #e5e7eb;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .controls {
          flex-direction: column;
          align-items: stretch;
        }

        .table-header,
        .table-row {
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }

        .header-cell {
          display: none;
        }

        .table-row {
          background-color: #2d2d2d;
          margin-bottom: 1rem;
          border-radius: 0.5rem;
          border: none;
        }

        .actions-cell {
          justify-content: center;
        }
      }
    `,
  ],
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery = '';
  statusFilter = '';
  currentPage = 1;
  totalPages = 1;
  usersPerPage = 10;

  constructor(private userService: UserService, private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // this.userService.getUsers().subscribe((users) => {
    //   this.users = users;
    //   this.filterUsers();
    // });
  }

  filterUsers() {
    let filtered = this.users;

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
      );
    }

    if (this.statusFilter) {
      // Mock status filtering - in real app, users would have status property
      filtered = filtered.filter((user) => this.statusFilter === 'active');
    }

    this.filteredUsers = filtered;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.usersPerPage);
    this.currentPage = 1;
  }

  banUser(userId: string) {
    if (confirm('Are you sure you want to ban this user?')) {
      this.adminService.banUser(userId).subscribe(() => {
        alert('User has been banned successfully');
        this.loadUsers();
      });
    }
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // this.userService.deleteUser(userId).subscribe(() => {
      //   alert('User has been deleted successfully');
      //   this.loadUsers();
      // });
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
