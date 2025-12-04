import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Article } from '../../models/article.model';
import { AuthService } from '../../services/auth.service';
import { ArticleService } from '../../services/article.service';
import { ReportService } from '../../services/report.service';
import { NotificationService } from '../../services/toast.service';
import { ReportModalComponent } from '../report-modal/report-modal.component';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ReportModalComponent],
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css'],
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: Article;
  isDropdownOpen = false;
  currentUserId: string | null = null;
  showReportModal = false;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private router: Router,
    private reportService: ReportService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
  }

  isAuthor(): boolean {
    if (!this.currentUserId || !this.article.creator) {
      return false;
    }
    return this.currentUserId === this.article.creator.id;
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  edit(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/edit', this.article.id]);
  }

  delete(event: MouseEvent) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this article?')) {
      this.articleService.deleteArticle(this.article.id.toString()).subscribe(() => {
        // Optionally, refresh the list of articles or emit an event
        window.location.reload();
      });
    }
  }

  report(event: MouseEvent) {
    event.stopPropagation();
    this.showReportModal = true;
  }

  onReportSubmit(reason: string) {
    this.reportService.createReport({
      type: 'post',
      targetId: this.article.id.toString(),
      targetTitle: this.article.title,
      reason: reason,
      reportedBy: 'currentUser',
      status: 'pending'
    }).subscribe(() => {
      this.notificationService.success('Post reported successfully');
      this.showReportModal = false;
    });
  }

  onReportClose() {
    this.showReportModal = false;
  }
}
