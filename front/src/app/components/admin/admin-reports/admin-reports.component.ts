import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Report } from '../../../models/article.model';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  statusFilter = '';
  typeFilter = '';

  constructor(private adminService: AdminService) {}

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
    if (confirm('Send a warning to this user?')) {
      this.resolveReport(report.id, 'User warned');
    }
  }

  banUser(report: Report) {
    if (confirm('Are you sure you want to ban this user?')) {
      this.adminService.banUser(report.targetId).subscribe(() => {
        this.resolveReport(report.id, 'User banned');
      });
    }
  }

  deleteUser(report: Report) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.resolveReport(report.id, 'User deleted');
    }
  }

  warnAuthor(report: Report) {
    if (confirm('Send a warning to the post author?')) {
      this.resolveReport(report.id, 'Author warned');
    }
  }

  hidePost(report: Report) {
    if (confirm('Are you sure you want to hide this post?')) {
      this.adminService.hidePost(report.targetId).subscribe(() => {
        this.resolveReport(report.id, 'Post hidden');
      });
    }
  }

  deletePost(report: Report) {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      this.adminService.deletePost(report.targetId).subscribe(() => {
        this.resolveReport(report.id, 'Post deleted');
      });
    }
  }

  dismissReport(reportId: string) {
    if (confirm('Are you sure you want to dismiss this report?')) {
      this.adminService.dismissReport(reportId).subscribe(() => {
        alert('Report dismissed successfully');
        this.loadReports();
      });
    }
  }

  private resolveReport(reportId: string, action: string) {
    this.adminService.resolveReport(reportId, action).subscribe(() => {
      alert(`Report resolved: ${action}`);
      this.loadReports();
    });
  }
}