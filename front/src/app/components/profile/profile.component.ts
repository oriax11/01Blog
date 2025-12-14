import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { ArticleService } from '../../services/article.service';
import { UserService } from '../../services/user.service';
import { Article, User } from '../../models/article.model';
import { ReportService } from '../../services/report.service';
import { ReportModalComponent } from '../report-modal/report-modal.component';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ArticleCardComponent, ReportModalComponent, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  userArticles: Article[] = [];
  isFollowing = false;
  showReportModal = false;
  loadingFollow = false;
  loadingReport = false;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private userService: UserService,
    private reportService: ReportService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  isOwnProfile = false;

  ngOnInit() {
    // Assuming you have currentUser from AuthService
    this.currentUser = this.authService.getCurrentUser();

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const userId = params.get('userId');
          if (!userId) throw new Error('User ID not found');
          return forkJoin([
            this.userService.getUserByUsername(userId),
            this.userService.isFollowing(userId),
          ]);
        })
      )
      .subscribe({
        next: ([user, followStatus]) => {
          ;
          this.user = user;
          this.isOwnProfile = this.user?.id === this.currentUser?.username;
          this.isFollowing = followStatus;
          this.fetchUserArticles();
        },
        error: (err) => {
          this.router.navigate(['/not-found']);
        },
      });
  }

  fetchUserArticles() {
    if (!this.user) return;
    this.articleService.getUserArticles(this.user.id).subscribe({
      next: (articles) => (this.userArticles = articles),
    });
  }

  toggleFollow() {
    if (!this.user || this.loadingFollow) return;
    this.loadingFollow = true;

    const action$ = this.isFollowing
      ? this.userService.unfollowUser(this.user.id)
      : this.userService.followUser(this.user.id);

    action$.subscribe({
      next: () => {
        this.isFollowing = !this.isFollowing;
        this.user!.followersCount += this.isFollowing ? 1 : -1;

        this.loadingFollow = false;
      },
      error: (err) => {
        this.loadingFollow = false;
      },
    });
  }

  reportUser() {
    this.showReportModal = true;
  }

  onReportSubmit(reason: string) {
    if (!this.user || this.loadingReport) return;
    this.loadingReport = true;

    this.reportService
      .createReport({
        type: 'user',
        targetId: this.user.id,
        targetTitle: this.user.username,
        reason,
        status: 'pending',
      })
      .subscribe({
        next: () => {
          this.showReportModal = false;
          this.loadingReport = false;

          this.showSuccessDialog(`Report Submitted successfully. `);
        },
        error: (err) => {
          this.loadingReport = false;
        },
      });
  }

  onReportClose() {
    this.showReportModal = false;
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
