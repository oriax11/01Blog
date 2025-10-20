import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
})
export class ArticleDetailComponent implements OnInit {
  @Input() article!: Article;
  isDropdownOpen = false;
  currentUserId: string | null = null;

  constructor(
    private authService: AuthService,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getUserId();
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.articleService.getArticleById(articleId).subscribe((article) => {
        this.article = article;
      });
    }
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
    if (confirm('Are you sure you want to delete this article?')) {
      this.articleService.deleteArticle(this.article.id.toString()).subscribe(() => {
        // Optionally, refresh the list of articles or emit an event
        window.location.reload();
      });
    }
  }

  report(event: MouseEvent) {
    event.stopPropagation();
    alert('This article has been reported.');
  }
}
