import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/article.model';
import { environment } from '../../../src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserByUsername(userUUID: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/users/${userUUID}`);
  }

  followUser(userId: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/api/users/${userId}/follow`,
      {},
      this.authService.getAuthHeaders()
    );
  }

  unfollowUser(userId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/api/users/${userId}/unfollow`,
      this.authService.getAuthHeaders()
    );
  }

  isFollowing(userId: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${environment.apiUrl}/api/users/${userId}/is-following`,
      this.authService.getAuthHeaders()
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(
      `${environment.apiUrl}/api/users`,
      this.authService.getAuthHeaders()
    );
  }
}
