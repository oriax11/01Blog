import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-dropdown.component.html',
  styleUrls: ['./notification-dropdown.component.css']
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
  isOpen = false;
  notifications: Notification[] = [];
  unreadCount = 0;
  private subscription?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNotifications();
    
    // Subscribe to unread count
    this.subscription = this.notificationService.unreadCount$.subscribe(
      count => this.unreadCount = count
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadNotifications();
    }
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  markAsRead(notification: Notification, event: Event) {
    event.stopPropagation();
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.read = true;
        this.loadNotifications();
      });
    }
  }

  markAsUnread(notification: Notification, event: Event) {
    event.stopPropagation();
    if (notification.read) {
      this.notificationService.markAsUnread(notification.id).subscribe(() => {
        notification.read = false;
        this.loadNotifications();
      });
    }
  }

  navigateToPost(notification: Notification) {
    if (notification.type === 'POST' && notification.relatedEntityId) {
      this.router.navigate(['/article', notification.relatedEntityId]);
      this.isOpen = false;
      this.markAsRead(notification, new Event('click'));
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationDate.toLocaleDateString();
  }

  closeDropdown() {
    this.isOpen = false;
  }
}