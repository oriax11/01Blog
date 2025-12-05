import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AdminStats, Report } from '../models/article.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private mockStats: AdminStats = {
    totalUsers: 1247,
    totalPosts: 3892,
    totalReports: 23,
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
      createdAt: new Date('2024-01-15T10:30:00'),
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
      createdAt: new Date('2024-01-14T15:45:00'),
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
      resolvedAt: new Date('2024-01-13T14:20:00'),
    },
  ];

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(
      `${environment.apiUrl}/api/dashboard/stats`,
      this.authService.getAuthHeaders()
    );
  }

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(
      `${environment.apiUrl}/api/reports`,
      this.authService.getAuthHeaders()
    );
  }

  resolveReport(reportId: string, action: string): Observable<boolean> {
    return this.http.put<boolean>(
      `${environment.apiUrl}/api/reports/${reportId}/resolve`,
      {},
      {
        ...this.authService.getAuthHeaders(),
        params: { action },
      }
    );
  }

  dismissReport(reportId: string): Observable<boolean> {
    return this.http.put<boolean>(
      `${environment.apiUrl}/api/reports/${reportId}/dismiss`,
      {},
      this.authService.getAuthHeaders()
    );
  }

  banUser(userId: string): Observable<boolean> {
    return this.http.put<boolean>(
      `${environment.apiUrl}/api/users/${userId}/ban`,
      {},
      this.authService.getAuthHeaders()
    );
  }
  deleteUser(userId: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `${environment.apiUrl}/api/users/${userId}/delete`,
      this.authService.getAuthHeaders()
    );
  }

  hidePost(postId: string): Observable<boolean> {
    return this.http.put<boolean>(
      `${environment.apiUrl}/api/articles/${postId}/hide`,
      {},
      this.authService.getAuthHeaders()
    );
  }

  deletePost(postId: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `${environment.apiUrl}/api/articles/${postId}`,
      this.authService.getAuthHeaders()
    );
  }
}
