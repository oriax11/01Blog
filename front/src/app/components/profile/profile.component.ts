import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { ArticleService } from '../../services/article.service';
import { Article, User } from '../../models/article.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ArticleCardComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  userArticles: Article[] = [];

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      // Mock user data - in real app, fetch from service
      this.user = {
        id: '1',
        username: 'john_doe',
        email: 'john@student.edu',
        bio: 'Computer Science student passionate about technology and coding. I love sharing knowledge and learning from the community.',
        avatarUrl: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=300',
        articlesCount: 12,
        followersCount: 234,
        followingCount: 156
      };

      this.articleService.getUserArticles(userId).subscribe(articles => {
        this.userArticles = articles;
      });
    }
  }
}