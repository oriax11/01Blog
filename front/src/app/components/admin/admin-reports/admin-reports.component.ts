import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '../../../services/admin.service';
import { Report } from '../../../models/article.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  statusFilter = '';
  typeFilter = '';

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.adminService.getReports().subscribe(reports => {
      this.reports = reports;
      this.filterReports();
    });
  }

  filterReports() {
    let filtered = this.reports;

    if (this.statusFilter) {
      filtered = filtered.filter(report => report.status === this.statusFilter);
    }

    if (this.typeFilter) {
      filtered = filtered.filter(report => report.type === this.typeFilter);
    }

    this.filteredReports = filtered;
  }

  viewTarget(report: Report) {
    if (report.type === 'user') {
      window.open(`/profile/${report.targetId}`, '_blank');
    } else {
      window.open(`/article/${report.targetId}`, '_blank');
    }
  }

  warnUser(report: Report) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Warn User',
        message: 'Are you sure you want to send a warning to this user?',
        confirmText: 'Send Warning',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resolveReport(report.id, 'User warned');
      }
    });
  }

  banUser(report: Report) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Ban User',
        message: 'Are you sure you want to ban this user? This will prevent them from accessing the platform.',
        confirmText: 'Ban User',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.banUser(report.targetId).subscribe(() => {
          this.resolveReport(report.id, 'User banned');
        });
      }
    });
  }

  deleteUser(report: Report) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user? This action cannot be undone and will permanently remove all their data.',
        confirmText: 'Delete User',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resolveReport(report.id, 'User deleted');
      }
    });
  }

  warnAuthor(report: Report) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Warn Author',
        message: 'Are you sure you want to send a warning to the post author?',
        confirmText: 'Send Warning',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.resolveReport(report.id, 'Author warned');
      }
    });
  }

  hidePost(report: Report) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Hide Post',
        message: 'Are you sure you want to hide this post? It will no longer be visible to users.',
        confirmText: 'Hide Post',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.hidePost(report.targetId).subscribe(() => {
          this.resolveReport(report.id, 'Post hidden');
        });
      }
    });
  }

  deletePost(report: Report) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Post',
        message: 'Are you sure you want to delete this post? This action cannot be undone and will permanently remove the content.',
        confirmText: 'Delete Post',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.deletePost(report.targetId).subscribe(() => {
          this.resolveReport(report.id, 'Post deleted');
        });
      }
    });
  }

  dismissReport(reportId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Dismiss Report',
        message: 'Are you sure you want to dismiss this report? No action will be taken.',
        confirmText: 'Dismiss',
        color: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.dismissReport(reportId).subscribe(() => {
          this.showSuccessDialog('Report dismissed successfully');
          this.loadReports();
        });
      }
    });
  }

  private resolveReport(reportId: string, action: string) {
    this.adminService.resolveReport(reportId, action).subscribe(() => {
      this.showSuccessDialog(`Report resolved: ${action}`);
      this.loadReports();
    });
  }

  private showSuccessDialog(message: string) {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Success',
        message: message,
        confirmText: 'OK',
        color: 'primary',
        hideCancel: true
      }
    });
  }
}