import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../services/user.service';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/article.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatDialogModule, MatButtonModule],
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

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private dialog: MatDialog
  ) {}

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
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          title: 'Ban User',
          message: `Are you sure you want to ban ${user.username}? This will prevent them from accessing the platform.`,
          confirmText: 'Ban User',
          color: 'warn',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.adminService.banUser(user.id).subscribe(() => {
            this.showSuccessDialog(`${user.username} has been banned successfully`);
            this.loadUsers();
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          title: 'Unban User',
          message: `Are you sure you want to unban ${user.username}? They will regain access to the platform.`,
          confirmText: 'Unban User',
          color: 'primary',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.adminService.unbanUser(user.id).subscribe(() => {
            this.showSuccessDialog(`${user.username} has been unbanned successfully`);
            this.loadUsers();
          });
        }
      });
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
      filtered = filtered.filter((user) => this.statusFilter === user.status);
    }

    this.filteredUsers = filtered;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.usersPerPage);
    this.currentPage = 1;
  }

  banUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Ban User',
        message: `Are you sure you want to ban ${user.username}? This will prevent them from accessing the platform.`,
        confirmText: 'Ban User',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.banUser(user.id).subscribe(() => {
          this.showSuccessDialog(`${user.username} has been banned successfully`);
          this.loadUsers();
        });
      }
    });
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.username}? This action cannot be undone and will permanently remove all their data, posts, and comments.`,
        confirmText: 'Delete User',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.deleteUser(user.id).subscribe(() => {
          this.showSuccessDialog(`${user.username} has been deleted successfully`);
          this.loadUsers();
        });
      }
    });
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

  private showSuccessDialog(message: string) {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Success',
        message: message,
        confirmText: 'OK',
        color: 'primary',
        hideCancel: true,
      },
    });
  }
}
