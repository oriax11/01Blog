import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { ArticleService } from '../../services/article.service';
import { UserService } from '../../services/user.service';
import { Article, User } from '../../models/article.model';
import { NotificationService } from '../../services/toast.service';
import { ReportService } from '../../services/report.service';
import { ReportModalComponent } from '../report-modal/report-modal.component';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ArticleCardComponent, ReportModalComponent,RouterModule],
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
    private notificationService: NotificationService,
    private reportService: ReportService,
    private authService: AuthService
  ) {}

isOwnProfile = false;

ngOnInit() {
  // Assuming you have currentUser from AuthService
  this.currentUser = this.authService.getCurrentUser(); 
  console.log('Current User:', this.currentUser);

  this.route.paramMap
    .pipe(
      switchMap(params => {
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
        console.log('Profile User:', user);
        this.user = user;
        this.isOwnProfile = this.user?.id === this.currentUser?.username;
        this.isFollowing = followStatus;
        this.fetchUserArticles();
      }
    });
}


  fetchUserArticles() {
    if (!this.user) return;
    this.articleService.getUserArticles(this.user.id).subscribe({
      next: (articles) => (this.userArticles = articles),
      error: (err) => console.error('Failed to load articles:', err),
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
        this.notificationService.success(
          this.isFollowing ? 'User followed! 🎉' : 'User unfollowed'
        );
        this.loadingFollow = false;
      },
      error: (err) => {
        console.error('Follow/unfollow failed:', err);
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
        reportedBy: 'currentUser',
        status: 'pending',
      })
      .subscribe({
        next: () => {
          this.notificationService.success('User reported successfully');
          this.showReportModal = false;
          this.loadingReport = false;
        },
        error: (err) => {
          console.error('Report failed:', err);
          this.loadingReport = false;
        },
      });
  }

  onReportClose() {
    this.showReportModal = false;
  }
}
