import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { ArticleService } from '../../services/article.service';
import { UserService } from '../../services/user.service';
import { Article, User } from '../../models/article.model';
import { NotificationService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ArticleCardComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  userArticles: Article[] = [];
  isFollowing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private userService: UserService,
    private notificationService : NotificationService
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.userService.getUserByUsername(userId).subscribe((user) => {
        this.user = user;
        // Check if current logged-in user is following this user
        this.userService.isFollowing(user.id).subscribe((followStatus) => {
          this.isFollowing = followStatus;
        });

        this.articleService.getUserArticles(user.id).subscribe((articles) => {
          this.userArticles = articles;
        });
      });
    }
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
}
