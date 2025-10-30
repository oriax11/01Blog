import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { ArticleService } from '../../services/article.service';
import { UserService } from '../../services/user.service';
import { Article, User } from '../../models/article.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ArticleCardComponent],
  template: `
    <div class="search-container">
      <div class="hero-section">
        <h1 class="hero-title">STUDENT <span class="accent">SEARCH</span></h1>
        <p class="hero-subtitle">Discover articles and connect with fellow students</p>

        <div class="search-bar">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Search for articles, users, or topics..."
            class="search-input"
          />
          <button class="search-btn" (click)="onSearch()">🔍</button>
        </div>

        <div class="search-filters">
          <button
            class="filter-btn"
            [class.active]="activeFilter === 'all'"
            (click)="setFilter('all')"
          >
            ALL
          </button>
          <button
            class="filter-btn"
            [class.active]="activeFilter === 'articles'"
            (click)="setFilter('articles')"
          >
            ARTICLES
          </button>
          <button
            class="filter-btn"
            [class.active]="activeFilter === 'users'"
            (click)="setFilter('users')"
          >
            USERS
          </button>
        </div>
      </div>

      <div class="search-results" *ngIf="searchQuery">
        <!-- Articles Results -->
        <div
          class="results-section"
          *ngIf="
            (activeFilter === 'all' || activeFilter === 'articles') && filteredArticles.length > 0
          "
        >
          <h2 class="section-title">ARTICLES</h2>
          <div class="articles-grid">
            <app-article-card *ngFor="let article of filteredArticles" [article]="article">
            </app-article-card>
          </div>
        </div>

        <!-- Users Results -->
        <div
          class="results-section"
          *ngIf="(activeFilter === 'all' || activeFilter === 'users') && filteredUsers.length > 0"
        >
          <h2 class="section-title">USERS</h2>
          <div class="users-grid">
            <div
              class="user-card"
              *ngFor="let user of filteredUsers"
              [routerLink]="['/profile', user.id]"
            >
              <img [src]="user.avatarUrl" [alt]="user.username" class="user-avatar" />
              <div class="user-info">
                <h3 class="user-name">{{ user.username }}</h3>
                <!-- <p class="user-bio">{{ user.bio }}</p> -->
                <div class="user-stats">
                  <span class="stat">{{ user.articlesCount }} articles</span>
                  <span class="stat">{{ user.followersCount }} followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div
          class="no-results"
          *ngIf="searchQuery && filteredArticles.length === 0 && filteredUsers.length === 0"
        >
          <h3>No results found</h3>
          <p>Try adjusting your search terms or browse our categories</p>
        </div>
      </div>

      <!-- Popular Content (when no search) -->
      <div class="popular-content" *ngIf="!searchQuery">
        <div class="content-section">
          <h2 class="section-title">POPULAR ARTICLES</h2>
          <div class="articles-grid">
            <app-article-card *ngFor="let article of popularArticles" [article]="article">
            </app-article-card>
          </div>
        </div>

        <div class="content-section">
          <h2 class="section-title">TOP CONTRIBUTORS</h2>
          <div class="users-grid">
            <div
              class="user-card"
              *ngFor="let user of topUsers"
              [routerLink]="['/profile', user.id]"
            >
              <img [src]="user.avatarUrl" [alt]="user.username" class="user-avatar" />
              <div class="user-info">
                <h3 class="user-name">{{ user.username }}</h3>
                <!-- <p class="user-bio">{{ user.bio }}</p> -->
                <div class="user-stats">
                  <span class="stat">{{ user.articlesCount }} articles</span>
                  <span class="stat">{{ user.followersCount }} followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .search-container {
        min-height: 100vh;
        background-color: #1a1a1a;
        padding-bottom: 2rem;
      }

      .hero-section {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        padding: 4rem 2rem;
        text-align: center;
        border-bottom: 2px solid #22c55e;
      }

      .hero-title {
        font-family: 'Courier New', monospace;
        font-size: 3.5rem;
        font-weight: bold;
        color: #ffffff;
        margin: 0 0 1rem 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      }

      .accent {
        color: #22c55e;
      }

      .hero-subtitle {
        font-size: 1.25rem;
        color: #d1d5db;
        margin: 0 0 3rem 0;
      }

      .search-bar {
        max-width: 600px;
        margin: 0 auto 2rem auto;
        display: flex;
        gap: 0.5rem;
      }

      .search-input {
        flex: 1;
        background-color: #2d2d2d;
        border: 2px solid #333333;
        border-radius: 0.75rem;
        padding: 1rem 1.5rem;
        color: #ffffff;
        font-size: 1.1rem;
        transition: border-color 0.3s ease;
      }

      .search-input:focus {
        outline: none;
        border-color: #22c55e;
      }

      .search-input::placeholder {
        color: #9ca3af;
      }

      .search-btn {
        background-color: #22c55e;
        color: #000000;
        border: none;
        border-radius: 0.75rem;
        padding: 1rem 1.5rem;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .search-btn:hover {
        background-color: #16a34a;
        transform: translateY(-2px);
      }

      .search-filters {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }

      .filter-btn {
        background-color: #2d2d2d;
        color: #e5e7eb;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: bold;
        font-family: 'Courier New', monospace;
      }

      .filter-btn:hover,
      .filter-btn.active {
        background-color: #22c55e;
        color: #000000;
      }

      .search-results,
      .popular-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .results-section,
      .content-section {
        margin-bottom: 3rem;
      }

      .section-title {
        color: #22c55e;
        font-family: 'Courier New', monospace;
        font-size: 2rem;
        font-weight: bold;
        margin: 0 0 2rem 0;
        text-transform: uppercase;
      }

      .articles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
      }

      .users-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .user-card {
        background-color: #1f1f1f;
        border-radius: 0.75rem;
        padding: 1.5rem;
        border: 1px solid #333333;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .user-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        border-color: #22c55e;
      }

      .user-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 2px solid #22c55e;
        flex-shrink: 0;
      }

      .user-info {
        flex: 1;
      }

      .user-name {
        color: #ffffff;
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0 0 0.5rem 0;
      }

      .user-bio {
        color: #d1d5db;
        margin: 0 0 0.75rem 0;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .user-stats {
        display: flex;
        gap: 1rem;
      }

      .stat {
        color: #9ca3af;
        font-size: 0.875rem;
      }

      .no-results {
        text-align: center;
        padding: 4rem 2rem;
      }

      .no-results h3 {
        color: #ffffff;
        font-size: 1.5rem;
        margin: 0 0 1rem 0;
      }

      .no-results p {
        color: #9ca3af;
        margin: 0;
      }

      @media (max-width: 768px) {
        .hero-title {
          font-size: 2.5rem;
        }

        .search-bar {
          flex-direction: column;
        }

        .search-filters {
          flex-wrap: wrap;
        }

        .articles-grid,
        .users-grid {
          grid-template-columns: 1fr;
        }

        .user-card {
          flex-direction: column;
          text-align: center;
        }
      }
    `,
  ],
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  activeFilter = 'all';

  allArticles: Article[] = [];
  allUsers: User[] = [];

  filteredArticles: Article[] = [];
  filteredUsers: User[] = [];

  popularArticles: Article[] = [];
  topUsers: User[] = [];

  constructor(private articleService: ArticleService, private userService: UserService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.articleService.getArticles().subscribe((articles) => {
      this.allArticles = articles;
      this.popularArticles = articles.slice(0, 6);
    });
    
  //   this.userService.getUsers().subscribe((users) => {
  //     this.allUsers = users;
  //     this.topUsers = users.slice(0, 4);
  //   }
  // );
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredArticles = [];
      this.filteredUsers = [];
      return;
    }

    const query = this.searchQuery.toLowerCase();

    this.filteredArticles = this.allArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) || article.content.toLowerCase().includes(query)
    );

    this.filteredUsers = this.allUsers.filter((user) =>
      user.username.toLowerCase().includes(query)
    );
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }
}
