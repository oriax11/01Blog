import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { AdminService } from '../../../services/admin.service';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-admin-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1 class="admin-title">POST <span class="accent">MANAGEMENT</span></h1>
        <p class="admin-subtitle">Moderate and manage all user posts</p>
      </div>

      <div class="admin-nav">
        <a routerLink="/admin" class="nav-item">📊 DASHBOARD</a>
        <a routerLink="/admin/users" class="nav-item">👥 USERS</a>
        <a routerLink="/admin/posts" routerLinkActive="active" class="nav-item">📝 POSTS</a>
        <a routerLink="/admin/reports" class="nav-item">🚨 REPORTS</a>
      </div>

      <div class="controls">
        <div class="search-bar">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="filterPosts()"
            placeholder="Search posts by title, author, or content..."
            class="search-input"
          />
        </div>

        <div class="filters">
          <select [(ngModel)]="categoryFilter" (change)="filterPosts()" class="filter-select">
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Web Development">Web Development</option>
            <option value="Security">Security</option>
            <option value="Mobile Development">Mobile Development</option>
          </select>

          <select [(ngModel)]="statusFilter" (change)="filterPosts()" class="filter-select">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </div>

      <div class="posts-grid">
        <div class="post-card" *ngFor="let post of filteredPosts">
          <div class="post-image" *ngIf="post.imageUrl">
            <img [src]="post.imageUrl" [alt]="post.title" />
          </div>

          <div class="post-content">
            <div class="post-header">
              <div class="post-meta">
                <!-- <span class="category">{{ post.category }}</span> -->
                <span class="date">{{ post.createdAt | date : 'MMM dd, yyyy' }}</span>
              </div>
              <div class="post-status">
                <span class="status-badge published">Published</span>
              </div>
            </div>

            <h3 class="post-title">{{ post.title }}</h3>
            <!-- <p class="post-excerpt">{{ post.excerpt }}</p> -->

            <div class="post-author">
              <!-- <img
                [src]="post.author.avatarUrl"
                [alt]="post.author.username"
                class="author-avatar"
              /> -->
              <!-- <span class="author-name">{{ post.author.username }}</span> -->
            </div>

            <div class="post-stats">
              <!-- <span class="stat">❤️ {{ post.likesCount }}</span> -->
              <span class="stat">💬 {{ post.commentsCount }}</span>
              <span class="stat">👁️ 1.2k views</span>
            </div>

            <div class="post-actions">
              <button class="action-btn view" [routerLink]="['/article', post.id]">👁️ View</button>
              <button class="action-btn hide" (click)="hidePost(post.id)">🙈 Hide</button>
              <button class="action-btn delete" (click)="deletePost(post.id)">🗑️ Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button class="page-btn" [disabled]="currentPage === 1" (click)="previousPage()">
          ← Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="page-btn" [disabled]="currentPage === totalPages" (click)="nextPage()">
          Next →
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-container {
        min-height: 100vh;
        background-color: #1a1a1a;
        padding: 2rem;
      }

      .admin-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .admin-title {
        font-family: 'Courier New', monospace;
        font-size: 3rem;
        font-weight: bold;
        color: #ffffff;
        margin: 0 0 1rem 0;
      }

      .accent {
        color: #22c55e;
      }

      .admin-subtitle {
        color: #d1d5db;
        font-size: 1.1rem;
        margin: 0;
      }

      .admin-nav {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 3rem;
        flex-wrap: wrap;
      }

      .nav-item {
        background-color: #2d2d2d;
        color: #e5e7eb;
        text-decoration: none;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        font-weight: bold;
        font-family: 'Courier New', monospace;
        transition: all 0.3s ease;
      }

      .nav-item:hover,
      .nav-item.active {
        background-color: #22c55e;
        color: #000000;
      }

      .controls {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        align-items: center;
      }

      .search-bar {
        flex: 1;
      }

      .search-input {
        width: 100%;
        background-color: #2d2d2d;
        border: 2px solid #333333;
        border-radius: 0.5rem;
        padding: 1rem;
        color: #ffffff;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      .search-input:focus {
        outline: none;
        border-color: #22c55e;
      }

      .search-input::placeholder {
        color: #9ca3af;
      }

      .filters {
        display: flex;
        gap: 1rem;
      }

      .filter-select {
        background-color: #2d2d2d;
        border: 2px solid #333333;
        border-radius: 0.5rem;
        padding: 1rem;
        color: #ffffff;
        font-size: 1rem;
        min-width: 150px;
      }

      .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .post-card {
        background-color: #1f1f1f;
        border-radius: 0.75rem;
        overflow: hidden;
        border: 1px solid #333333;
        transition: all 0.3s ease;
      }

      .post-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        border-color: #22c55e;
      }

      .post-image {
        height: 200px;
        overflow: hidden;
      }

      .post-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .post-content {
        padding: 1.5rem;
      }

      .post-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .post-meta {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .category {
        background-color: #22c55e;
        color: #000000;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
      }

      .date {
        color: #9ca3af;
        font-size: 0.875rem;
      }

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
      }

      .status-badge.published {
        background-color: #22c55e;
        color: #000000;
      }

      .status-badge.hidden {
        background-color: #f59e0b;
        color: #000000;
      }

      .status-badge.deleted {
        background-color: #ef4444;
        color: #ffffff;
      }

      .post-title {
        color: #ffffff;
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0 0 0.75rem 0;
        line-height: 1.4;
      }

      .post-excerpt {
        color: #d1d5db;
        margin: 0 0 1rem 0;
        line-height: 1.6;
        font-size: 0.9rem;
      }

      .post-author {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .author-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid #22c55e;
      }

      .author-name {
        color: #e5e7eb;
        font-weight: 500;
      }

      .post-stats {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .stat {
        color: #9ca3af;
        font-size: 0.875rem;
      }

      .post-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .action-btn {
        background-color: #333333;
        color: #e5e7eb;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .action-btn.view:hover {
        background-color: #22c55e;
        color: #000000;
      }

      .action-btn.hide:hover {
        background-color: #f59e0b;
        color: #000000;
      }

      .action-btn.delete:hover {
        background-color: #ef4444;
        color: #ffffff;
      }

      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
      }

      .page-btn {
        background-color: #2d2d2d;
        color: #e5e7eb;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .page-btn:hover:not(:disabled) {
        background-color: #22c55e;
        color: #000000;
      }

      .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .page-info {
        color: #e5e7eb;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .controls {
          flex-direction: column;
          align-items: stretch;
        }

        .filters {
          flex-direction: column;
        }

        .posts-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminPostsComponent implements OnInit {
  posts: Article[] = [];
  filteredPosts: Article[] = [];
  searchQuery = '';
  categoryFilter = '';
  statusFilter = '';
  currentPage = 1;
  totalPages = 1;
  postsPerPage = 12;

  constructor(private articleService: ArticleService, private adminService: AdminService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.articleService.getArticles().subscribe((posts) => {
      this.posts = posts;
      this.filterPosts();
    });
  }

  filterPosts() {
    let filtered = this.posts;

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query)
      );
    }

    if (this.categoryFilter) {
      // filtered = filtered.filter(post => post.category === this.categoryFilter);
    }

    if (this.statusFilter) {
      // Mock status filtering - in real app, posts would have status property
      filtered = filtered.filter((post) => this.statusFilter === 'published');
    }

    this.filteredPosts = filtered;
    this.totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    this.currentPage = 1;
  }

  hidePost(postId: string) {
    if (confirm('Are you sure you want to hide this post?')) {
      this.adminService.hidePost(postId).subscribe(() => {
        alert('Post has been hidden successfully');
        this.loadPosts();
      });
    }
  }

  deletePost(postId: string) {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      this.adminService.deletePost(postId).subscribe(() => {
        alert('Post has been deleted successfully');
        this.loadPosts();
      });
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
