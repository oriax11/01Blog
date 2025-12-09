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
  templateUrl: './admin-posts.component.html',
  styleUrls: ['./admin-posts.component.css'],
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
    this.articleService.getAllArticles().subscribe((posts) => {
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

    if (this.statusFilter) {
      // Mock status filtering - in real app, posts would have status property
      filtered = filtered.filter((post) => this.statusFilter === post.status);
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
