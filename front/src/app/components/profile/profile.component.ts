import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { ArticleService } from '../../services/article.service';
import { UserService } from '../../services/user.service';
import { Article, User } from '../../models/article.model';

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
  isFollowing: boolean = false; // track follow state

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.userService.getUserByUsername(username).subscribe((user) => {
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
      this.userService.unfollowUser(this.user.id).subscribe(() => {
        this.isFollowing = false;
      });
    } else {
      this.userService.followUser(this.user.id).subscribe(() => {
        this.isFollowing = true;
      });
    }
  }
}
