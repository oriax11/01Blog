import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  color?: 'primary' | 'warn';
  hideCancel?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="confirm-dialog">
      <h2 class="dialog-title">{{ data.title }}</h2>
      <div class="dialog-content">
        <p>{{ data.message }}</p>
      </div>
      <div class="dialog-actions">
        <button *ngIf="!data.hideCancel" class="cancel-btn" (click)="onCancel()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button
          class="confirm-btn"
          [class.warn]="data.color === 'warn'"
          [class.primary]="data.color === 'primary' || !data.color"
          (click)="onConfirm()"
        >
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .confirm-dialog {
        background-color: #1f1f1f;
        color: #ffffff;
        min-width: 300px;
      }

      .dialog-title {
        color: #ffffff;
        margin: 0;
        padding: 1.5rem 1.5rem 1rem;
        font-size: 1.5rem;
        font-weight: bold;
        border-bottom: 1px solid #333333;
      }

      .dialog-content {
        padding: 1.5rem;
        color: #d1d5db;
        line-height: 1.6;
      }

      .dialog-content p {
        margin: 0;
      }

      .dialog-actions {
        padding: 1rem 1.5rem 1.5rem;
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        border-top: 1px solid #333333;
      }

      button {
        padding: 0.625rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.875rem;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .cancel-btn {
        background-color: #2d2d2d;
        color: #e5e7eb;
      }

      .cancel-btn:hover {
        background-color: #3d3d3d;
      }

      .confirm-btn.primary {
        background-color: #22c55e;
        color: #000000;
      }

      .confirm-btn.primary:hover {
        background-color: #16a34a;
      }

      .confirm-btn.warn {
        background-color: #ef4444;
        color: #ffffff;
      }

      .confirm-btn.warn:hover {
        background-color: #dc2626;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
