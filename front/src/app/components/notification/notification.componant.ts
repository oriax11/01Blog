import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/toast.service';
import { Notification } from '../../models/toast.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        *ngFor="let notification of notifications; trackBy: trackByFn"
        class="notification"
        [class]="'notification-' + notification.type"
        [@slideIn]1à
      >
        <div class="notification-content">
          <div class="notification-icon">
            <span *ngIf="notification.type === 'success'">✅</span>
            <span *ngIf="notification.type === 'error'">❌</span>
            <span *ngIf="notification.type === 'info'">ℹ️</span>
            <span *ngIf="notification.type === 'warning'">⚠️</span>
          </div>
          <span class="notification-message">{{ notification.message }}</span>
        </div>
        <button
          class="notification-close"
          (click)="closeNotification(notification.id)"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .notification-container {
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 400px;
        width: 100%;
      }

      .notification {
        background-color: #1f1f1f;
        border-radius: 0.75rem;
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
        border: 2px solid;
        animation: slideIn 0.3s ease-out;
        transition: all 0.3s ease;
      }

      .notification:hover {
        transform: translateX(-4px);
      }

      .notification-success {
        border-color: #22c55e;
        background: linear-gradient(135deg, #1f1f1f 0%, rgba(34, 197, 94, 0.1) 100%);
      }

      .notification-error {
        border-color: #ef4444;
        background: linear-gradient(135deg, #1f1f1f 0%, rgba(239, 68, 68, 0.1) 100%);
      }

      .notification-info {
        border-color: #3b82f6;
        background: linear-gradient(135deg, #1f1f1f 0%, rgba(59, 130, 246, 0.1) 100%);
      }

      .notification-warning {
        border-color: #f59e0b;
        background: linear-gradient(135deg, #1f1f1f 0%, rgba(245, 158, 11, 0.1) 100%);
      }

      .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
      }

      .notification-icon {
        font-size: 1.25rem;
        flex-shrink: 0;
      }

      .notification-message {
        color: #ffffff;
        font-weight: 500;
        font-size: 0.95rem;
        line-height: 1.4;
      }

      .notification-close {
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        font-size: 1.25rem;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: all 0.2s ease;
        flex-shrink: 0;
        margin-left: 1rem;
      }

      .notification-close:hover {
        color: #ffffff;
        background-color: rgba(255, 255, 255, 0.1);
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @media (max-width: 768px) {
        .notification-container {
          top: 1rem;
          right: 1rem;
          left: 1rem;
          max-width: none;
        }

        .notification {
          padding: 0.75rem 1rem;
        }

        .notification-message {
          font-size: 0.9rem;
        }
      }
    `,
  ],
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.getNotifications().subscribe((notifications) => {
      console.log('fsmlfdjdsqmlfkjqsmldfjkqdm');
      this.notifications = notifications;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeNotification(id: string) {
    this.notificationService.remove(id);
  }

  trackByFn(index: number, notification: Notification): string {
    return notification.id;
  }
}
