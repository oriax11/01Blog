import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Notification {
  id: string;
  recipient: any;
  sender: any;
  type: string;
  message: string;
  relatedEntityId: string;
  read: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getNotifications(): Observable<Notification[]> {
    return this.http
      .get<Notification[]>(
        `${environment.apiUrl}/api/notifications`,
        this.authService.getAuthHeaders()
      )
      .pipe(
        tap((notifications) => {
          const unreadCount = notifications.filter((n) => !n.read).length;
          console.log('Fetched notifications, unread count:', unreadCount);
          this.unreadCountSubject.next(unreadCount);
        })
      );
  }

  markAsRead(notificationId: string): Observable<void> {
    return this.http
      .put<void>(
        `${environment.apiUrl}/api/notifications/${notificationId}/read`,
        {},
        this.authService.getAuthHeaders()
      )
      .pipe(
        tap(() => {
          const currentCount = this.unreadCountSubject.value;
          this.unreadCountSubject.next(Math.max(0, currentCount - 1));
        })
      );
  }

  markAsUnread(notificationId: string): Observable<any> {
    return this.http
      .put(
        `${environment.apiUrl}/api/notifications/${notificationId}/unread`,
        {},
        this.authService.getAuthHeaders()
      )
      .pipe(
        tap(() => {
          const currentCount = this.unreadCountSubject.value;
          this.unreadCountSubject.next(Math.max(0, currentCount - 1));
        })
      );
  }

  refreshUnreadCount(): void {
    this.getNotifications().subscribe();
  }
}
