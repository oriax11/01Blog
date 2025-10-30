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
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1 class="admin-title">REPORT <span class="accent">MANAGEMENT</span></h1>
        <p class="admin-subtitle">Handle user reports and take appropriate action</p>
      </div>

      <div class="admin-nav">
        <a routerLink="/admin" class="nav-item">📊 DASHBOARD</a>
        <a routerLink="/admin/users" class="nav-item">👥 USERS</a>
        <a routerLink="/admin/posts" class="nav-item">📝 POSTS</a>
        <a routerLink="/admin/reports" routerLinkActive="active" class="nav-item">🚨 REPORTS</a>
      </div>

      <div class="controls">
        <div class="filters">
          <select [(ngModel)]="statusFilter" (change)="filterReports()" class="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
          
          <select [(ngModel)]="typeFilter" (change)="filterReports()" class="filter-select">
            <option value="">All Types</option>
            <option value="user">User Reports</option>
            <option value="post">Post Reports</option>
          </select>
        </div>
      </div>

      <div class="reports-list">
        <div class="report-card" *ngFor="let report of filteredReports" [class.resolved]="report.status === 'resolved'">
          <div class="report-header">
            <div class="report-type">
              <span class="type-badge" [class]="report.type">
                {{ report.type === 'user' ? '👤' : '📝' }} {{ report.type | titlecase }}
              </span>
              <span class="status-badge" [class]="report.status">
                {{ report.status | titlecase }}
              </span>
            </div>
            <div class="report-date">
              {{ report.createdAt | date:'MMM dd, yyyy HH:mm' }}
            </div>
          </div>

          <div class="report-content">
            <h3 class="report-target">{{ report.targetTitle }}</h3>
            <div class="report-details">
              <p><strong>Reported by:</strong> {{ report.reportedBy }}</p>
              <p><strong>Reason:</strong> {{ report.reason }}</p>
              <p><strong>Description:</strong> {{ report.description }}</p>
            </div>
          </div>

          <div class="report-actions" *ngIf="report.status === 'pending'">
            <button class="action-btn view" (click)="viewTarget(report)">
              👁️ View {{ report.type === 'user' ? 'Profile' : 'Post' }}
            </button>
            
            <div class="action-group" *ngIf="report.type === 'user'">
              <button class="action-btn warn" (click)="warnUser(report)">
                ⚠️ Warn User
              </button>
              <button class="action-btn ban" (click)="banUser(report)">
                🚫 Ban User
              </button>
              <button class="action-btn delete" (click)="deleteUser(report)">
                🗑️ Delete User
              </button>
            </div>

            <div class="action-group" *ngIf="report.type === 'post'">
              <button class="action-btn warn" (click)="warnAuthor(report)">
                ⚠️ Warn Author
              </button>
              <button class="action-btn hide" (click)="hidePost(report)">
                🙈 Hide Post
              </button>
              <button class="action-btn delete" (click)="deletePost(report)">
                🗑️ Delete Post
              </button>
            </div>

            <button class="action-btn dismiss" (click)="dismissReport(report.id)">
              ❌ Dismiss Report
            </button>
          </div>

          <div class="report-resolved" *ngIf="report.status === 'resolved'">
            <p class="resolved-text">
              ✅ Resolved on {{ report.resolvedAt | date:'MMM dd, yyyy HH:mm' }}
            </p>
          </div>
        </div>
      </div>

      <div class="no-reports" *ngIf="filteredReports.length === 0">
        <h3>No reports found</h3>
        <p>All reports have been handled or no reports match your filters.</p>
      </div>
    </div>
  `,
  styles: [`
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
      margin-bottom: 2rem;
    }

    .filters {
      display: flex;
      gap: 1rem;
      justify-content: center;
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

    .reports-list {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .report-card {
      background-color: #1f1f1f;
      border-radius: 0.75rem;
      padding: 2rem;
      border: 2px solid #ef4444;
      transition: all 0.3s ease;
    }

    .report-card.resolved {
      border-color: #22c55e;
      opacity: 0.8;
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .report-type {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .type-badge {
      background-color: #333333;
      color: #22c55e;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: bold;
      text-transform: uppercase;
    }

    .type-badge.user {
      background-color: #1e40af;
      color: #ffffff;
    }

    .type-badge.post {
      background-color: #7c3aed;
      color: #ffffff;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    .status-badge.pending {
      background-color: #f59e0b;
      color: #000000;
    }

    .status-badge.resolved {
      background-color: #22c55e;
      color: #000000;
    }

    .status-badge.dismissed {
      background-color: #6b7280;
      color: #ffffff;
    }

    .report-date {
      color: #9ca3af;
      font-size: 0.9rem;
    }

    .report-target {
      color: #ffffff;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 0 1rem 0;
    }

    .report-details p {
      color: #e5e7eb;
      margin: 0.5rem 0;
      line-height: 1.5;
    }

    .report-details strong {
      color: #22c55e;
    }

    .report-actions {
      margin-top: 2rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }

    .action-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .action-btn {
      background-color: #333333;
      color: #e5e7eb;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .action-btn.view:hover {
      background-color: #22c55e;
      color: #000000;
    }

    .action-btn.warn:hover {
      background-color: #f59e0b;
      color: #000000;
    }

    .action-btn.ban:hover {
      background-color: #dc2626;
      color: #ffffff;
    }

    .action-btn.hide:hover {
      background-color: #7c3aed;
      color: #ffffff;
    }

    .action-btn.delete:hover {
      background-color: #ef4444;
      color: #ffffff;
    }

    .action-btn.dismiss:hover {
      background-color: #6b7280;
      color: #ffffff;
    }

    .report-resolved {
      margin-top: 1rem;
      padding: 1rem;
      background-color: rgba(34, 197, 94, 0.1);
      border-radius: 0.5rem;
      border: 1px solid #22c55e;
    }

    .resolved-text {
      color: #22c55e;
      margin: 0;
      font-weight: 500;
    }

    .no-reports {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .no-reports h3 {
      color: #ffffff;
      font-size: 1.5rem;
      margin: 0 0 1rem 0;
    }

    .no-reports p {
      color: #9ca3af;
      margin: 0;
    }

    @media (max-width: 768px) {
      .report-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
      
      .filters {
        flex-direction: column;
        align-items: stretch;
      }
      
      .report-actions {
        flex-direction: column;
        align-items: stretch;
      }
      
      .action-group {
        justify-content: center;
      }
    }
  `]
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