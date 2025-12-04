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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ArticleCardComponent, ReportModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  userArticles: Article[] = [];
  isFollowing: boolean = false;
  showReportModal = false;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private userService: UserService,
    private notificationService : NotificationService,
    private reportService: ReportService
  ) {}

ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const userId = params.get('userId');

    if (userId) {
      this.userService.getUserByUsername(userId).subscribe(user => {
        this.user = user;

        this.userService.isFollowing(user.id).subscribe(followStatus => {
          this.isFollowing = followStatus;
        });

        this.articleService.getUserArticles(user.id).subscribe(articles => {
          this.userArticles = articles;
        });
      });
    }
  });
}


  toggleFollow() {
    if (!this.user) return;

    if (this.isFollowing) {
      this.userService.unfollowUser(this.user.id).subscribe({
        next: () => {
          this.user!.followersCount--;
          this.isFollowing = false;
          this.notificationService.success('Article published! 🎉');
        },
        error: (err) => console.error('Failed to unfollow:', err),
      });
    } else {
      this.userService.followUser(this.user.id).subscribe({
        next: () => {
          this.isFollowing = true;
          this.user!.followersCount++;
        },
        error: (err) => console.error('Failed to follow:', err),
      });
    }
  }

  reportUser() {
    this.showReportModal = true;
  }

  onReportSubmit(reason: string) {
    if (!this.user) return;
    this.reportService.createReport({
      type: 'user',
      targetId: this.user.id,
      targetTitle: this.user.username,
      reason: reason,
      reportedBy: 'currentUser',
      status: 'pending'
    }).subscribe(() => {
      this.notificationService.success('User reported successfully');
      this.showReportModal = false;
    });
  }

  onReportClose() {
    this.showReportModal = false;
  }
}
