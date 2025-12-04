import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css']
})
export class ReportModalComponent {
  @Input() isOpen = false;
  @Input() reportType: 'user' | 'post' = 'post';
  @Input() targetTitle = '';
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();

  reason = '';

  onSubmit() {
    if (this.reason.trim()) {
      this.submit.emit(this.reason);
      this.closeModal();
    }
  }

  closeModal() {
    this.reason = '';
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
