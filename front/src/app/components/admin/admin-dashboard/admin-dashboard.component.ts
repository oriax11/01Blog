import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AdminStats } from '../../../models/article.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1 class="admin-title">ADMIN <span class="accent">DASHBOARD</span></h1>
        <p class="admin-subtitle">Manage your student blogging platform</p>
      </div>

      <div class="admin-nav">
        <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
          📊 DASHBOARD
        </a>
        <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
          👥 USERS
        </a>
        <a routerLink="/admin/posts" routerLinkActive="active" class="nav-item">
          📝 POSTS
        </a>
        <a routerLink="/admin/reports" routerLinkActive="active" class="nav-item">
          🚨 REPORTS
        </a>
      </div>

      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalUsers }}</h3>
            <p class="stat-label">Total Users</p>
            <span class="stat-change positive">+{{ stats.activeUsers }} active</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalPosts }}</h3>
            <p class="stat-label">Total Posts</p>
            <span class="stat-change positive">+{{ stats.postsToday }} today</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🚨</div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stats.totalReports }}</h3>
            <p class="stat-label">Total Reports</p>
            <span class="stat-change" [class.warning]="stats.reportsToday > 0">
              +{{ stats.reportsToday }} today
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3 class="stat-number">{{ getEngagementRate() }}%</h3>
            <p class="stat-label">Engagement Rate</p>
            <span class="stat-change positive">+2.3% this week</span>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="content-section">
          <h2 class="section-title">QUICK ACTIONS</h2>
          <div class="actions-grid">
            <button class="action-btn" routerLink="/admin/users">
              <div class="action-icon">👥</div>
              <div class="action-text">
                <h3>Manage Users</h3>
                <p>View, ban, or delete user accounts</p>
              </div>
            </button>

            <button class="action-btn" routerLink="/admin/posts">
              <div class="action-icon">📝</div>
              <div class="action-text">
                <h3>Moderate Posts</h3>
                <p>Review and manage user content</p>
              </div>
            </button>

            <button class="action-btn" routerLink="/admin/reports">
              <div class="action-icon">🚨</div>
              <div class="action-text">
                <h3>Handle Reports</h3>
                <p>Review user reports and take action</p>
              </div>
            </button>

            <button class="action-btn" routerLink="/create">
              <div class="action-icon">✍️</div>
              <div class="action-text">
                <h3>Create Announcement</h3>
                <p>Post platform updates or news</p>
              </div>
            </button>
          </div>
        </div>

        <div class="content-section">
          <h2 class="section-title">RECENT ACTIVITY</h2>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">👤</div>
              <div class="activity-content">
                <p><strong>New user registered:</strong> alex_student</p>
                <span class="activity-time">2 minutes ago</span>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">📝</div>
              <div class="activity-content">
                <p><strong>New post published:</strong> "React vs Angular: A Student's Perspective"</p>
                <span class="activity-time">15 minutes ago</span>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">🚨</div>
              <div class="activity-content">
                <p><strong>Report submitted:</strong> Inappropriate content in post #1247</p>
                <span class="activity-time">1 hour ago</span>
              </div>
            </div>

            <div class="activity-item">
              <div class="activity-icon">🔨</div>
              <div class="activity-content">
                <p><strong>User banned:</strong> spam_account for violating community guidelines</p>
                <span class="activity-time">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background-color: #1f1f1f;
      border-radius: 0.75rem;
      padding: 2rem;
      border: 1px solid #333333;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-icon {
      font-size: 3rem;
      background-color: #22c55e;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      color: #ffffff;
      font-size: 2.5rem;
      font-weight: bold;
      margin: 0 0 0.5rem 0;
    }

    .stat-label {
      color: #9ca3af;
      margin: 0 0 0.5rem 0;
      text-transform: uppercase;
      font-weight: 600;
    }

    .stat-change {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .stat-change.positive {
      color: #22c55e;
    }

    .stat-change.warning {
      color: #f59e0b;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }

    .content-section {
      background-color: #1f1f1f;
      border-radius: 0.75rem;
      padding: 2rem;
      border: 1px solid #333333;
    }

    .section-title {
      color: #22c55e;
      font-family: 'Courier New', monospace;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 0 2rem 0;
      text-transform: uppercase;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .action-btn {
      background-color: #2d2d2d;
      border: 1px solid #333333;
      border-radius: 0.5rem;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: left;
    }

    .action-btn:hover {
      border-color: #22c55e;
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 2rem;
      background-color: #22c55e;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .action-text h3 {
      color: #ffffff;
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
    }

    .action-text p {
      color: #9ca3af;
      margin: 0;
      font-size: 0.875rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background-color: #2d2d2d;
      border-radius: 0.5rem;
    }

    .activity-icon {
      font-size: 1.5rem;
      background-color: #333333;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
    }

    .activity-content p {
      color: #e5e7eb;
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
    }

    .activity-time {
      color: #9ca3af;
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
      
      .action-btn {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminStats | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAdminStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  getEngagementRate(): number {
    if (!this.stats) return 0;
    return Math.round((this.stats.activeUsers / this.stats.totalUsers) * 100);
  }
}