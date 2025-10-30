import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminStats, Report, AdminUser, AdminPost } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private mockStats: AdminStats = {
    totalUsers: 1247,
    totalPosts: 3892,
    totalReports: 23,
    activeUsers: 892,
    postsToday: 47,
    reportsToday: 5
  };

  private mockReports: Report[] = [
    {
      id: '1',
      type: 'post',
      targetId: '1',
      targetTitle: 'Getting Started with Machine Learning',
      reportedBy: 'user123',
      reason: 'Inappropriate Content',
      description: 'Contains misleading information about ML algorithms',
      status: 'pending',
      createdAt: new Date('2024-01-15T10:30:00')
    },
    {
      id: '2',
      type: 'user',
      targetId: '2',
      targetTitle: 'sarah_tech',
      reportedBy: 'user456',
      reason: 'Spam',
      description: 'User is posting spam comments on multiple articles',
      status: 'pending',
      createdAt: new Date('2024-01-14T15:45:00')
    },
    {
      id: '3',
      type: 'post',
      targetId: '3',
      targetTitle: 'Cybersecurity Best Practices',
      reportedBy: 'user789',
      reason: 'Copyright Violation',
      description: 'Content appears to be copied from another source',
      status: 'resolved',
      createdAt: new Date('2024-01-13T09:15:00'),
      resolvedAt: new Date('2024-01-13T14:20:00')
    }
  ];

  getAdminStats(): Observable<AdminStats> {
    return of(this.mockStats);
  }

  getReports(): Observable<Report[]> {
    return of(this.mockReports);
  }

  resolveReport(reportId: string, action: string): Observable<boolean> {
    const report = this.mockReports.find(r => r.id === reportId);
    if (report) {
      report.status = 'resolved';
      report.resolvedAt = new Date();
    }
    return of(true);
  }

  dismissReport(reportId: string): Observable<boolean> {
    const report = this.mockReports.find(r => r.id === reportId);
    if (report) {
      report.status = 'dismissed';
    }
    return of(true);
  }

  banUser(userId: string): Observable<boolean> {
    return of(true);
  }

  hidePost(postId: string): Observable<boolean> {
    return of(true);
  }

  deletePost(postId: string): Observable<boolean> {
    return of(true);
  }
}