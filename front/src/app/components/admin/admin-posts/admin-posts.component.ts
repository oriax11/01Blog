import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ArticleService } from '../../../services/article.service';
import { AdminService } from '../../../services/admin.service';
import { Article } from '../../../models/article.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatDialogModule, MatButtonModule],
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

  constructor(
    private articleService: ArticleService,
    private adminService: AdminService,
    private dialog: MatDialog
  ) {}

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
      filtered = filtered.filter((post) => this.statusFilter === post.status);
    }

    this.filteredPosts = filtered;
    this.totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
    this.currentPage = 1;
  }

  togglePostStatus(post: Article) {
    if (post.status === 'PUBLISHED') {
      this.hidePost(post);
    } else if (post.status === 'HIDDEN') {
      this.unhidePost(post);
    }
  }

  unhidePost(post: Article) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Unhide Post',
        message: `Are you sure you want to unhide "${post.title}"? This post will visible to all users.`,
        confirmText: 'Unhide Post',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.hidePost(post.id).subscribe(() => {
          ;
          this.showSuccessDialog(`"${post.title}" has been hidden successfully`);
          this.loadPosts();
        });
      }
    });
  }

  hidePost(post: Article) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Hide Post',
        message: `Are you sure you want to hide "${post.title}"? This post will no longer be visible to users but can be restored later.`,
        confirmText: 'Hide Post',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.hidePost(post.id).subscribe(() => {
          ;
          this.showSuccessDialog(`"${post.title}" has been hidden successfully`);
          this.loadPosts();
        });
      }
    });
  }

  deletePost(post: Article) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Post',
        message: `Are you sure you want to permanently delete "${post.title}"? This action cannot be undone and will remove all associated comments and interactions.`,
        confirmText: 'Delete Post',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      ;
      if (result) {
        this.adminService.deletePost(post.id).subscribe(() => {
          this.showSuccessDialog(`"${post.title}" has been deleted successfully`);
          this.loadPosts();
        });
      }
    });
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

  private showSuccessDialog(message: string) {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Success',
        message: message,
        confirmText: 'OK',
        color: 'primary',
        hideCancel: true,
      },
    });
  }
}
