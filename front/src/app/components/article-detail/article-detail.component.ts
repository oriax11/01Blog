import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { AuthService } from '../../services/auth.service';
import { CommentSectionComponent } from '../comment-section/comment-section.component';
import { ReportModalComponent } from '../report-modal/report-modal.component';
import { ReportService } from '../../services/report.service';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, CommentSectionComponent, ReportModalComponent],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
})
export class ArticleDetailComponent implements OnInit {
  @Input() article!: Article;
  isDropdownOpen = false;
  currentUserId: string | null = null;
  showReportModal = false;
  showDeleteModal = false;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getUserId();

    this.route.paramMap.subscribe((params) => {
      const articleId = params.get('id');

      if (articleId) {
        this.articleService.getArticleById(articleId).subscribe({
          next: (article) => {
            if (!article) {
              this.router.navigate(['/404']);
              return;
            }
            this.article = article;
          },
          error: () => {
            this.router.navigate(['/not-found']);
          },
        });
      }
    });
  }

  // This listens for clicks anywhere in the document
  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    // Close only if it's open and the click is *outside* the dropdown
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
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
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.articleService.deleteArticle(this.article.id.toString()).subscribe(() => {
      this.router.navigate(['/']);
    });
    this.showDeleteModal = false;
  }

  cancelDelete() {
    this.showDeleteModal = false;
  }

  report(event: MouseEvent) {
    event.stopPropagation();
    this.showReportModal = true;
    this.isDropdownOpen = false; // Close dropdown when opening modal
  }

  onReportSubmit(reason: string) {
    this.reportService
      .createReport({
        type: 'post',
        targetId: this.article.id.toString(),
        reason: reason,
      })
      .subscribe(() => {
        this.showReportModal = false;
        this.showSuccessDialog(`Report Submitted successfully. `);
      });
  }

  onReportClose() {
    this.showReportModal = false;
  }

  goToAuthorProfile() {
    this.router.navigate(['/profile', this.article.creator.id]);
  }

  // Like functionality
  toggleLike(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    if (!this.currentUserId) {
      return;
    }

    if (this.article.isLiked) {
      this.unlikePost();
    } else {
      this.likePost();
    }
  }

  private likePost(): void {
    this.articleService.likeArticle(this.article.id.toString()).subscribe({
      next: () => {
        this.article.isLiked = true;
        this.article.likeCount++;
      },
      error: (error) => {
        console.error('Error liking post:', error);
      },
    });
  }

  private unlikePost(): void {
    this.articleService.unlikeArticle(this.article.id.toString()).subscribe({
      next: () => {
        this.article.isLiked = false;
        this.article.likeCount--;
      },
      error: (error) => {
        console.error('Error unliking post:', error);
      },
    });
  }

  private showSuccessDialog(message: string) {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Success',
        message: message,
        confirmText: 'OK',
        color: 'primary',
        hideCancel: true,
      },
    });
  }
}
