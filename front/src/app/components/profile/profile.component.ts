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
        console.log(this.user.id);

        this.articleService.getUserArticles(user.id).subscribe((articles) => {
          this.userArticles = articles;
        });
      });
    }
  }
}
