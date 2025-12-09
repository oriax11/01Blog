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

  unbanUser(userId: string): Observable<boolean> {
    return this.http.put<boolean>(
      `${environment.apiUrl}/api/users/${userId}/unban`,
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
