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
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
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
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.filterUsers();
    });
  }
  toggleBan(user: User) {
    if (user.status === 'ACTIVE') {
      if (confirm('Are you sure you want to ban this user?')) {
        this.adminService.banUser(user.id).subscribe(() => {
          alert('User has been banned successfully');
          this.loadUsers();
        });
      }
    } else {
      if (confirm('Are you sure you want to unban this user?')) {
        this.adminService.unbanUser(user.id).subscribe(() => {
          alert('User has been unbanned successfully');
          this.loadUsers();
        });
      }
    }
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
      filtered = filtered.filter((user) => this.statusFilter === user.status);
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
      this.adminService.deleteUser(userId).subscribe(() => {
        alert('User has been deleted successfully');
        this.loadUsers();
      });
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
