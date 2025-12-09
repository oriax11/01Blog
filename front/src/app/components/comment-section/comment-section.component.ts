import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { CommentService } from '../../services/comment.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css'],
})
export class CommentSectionComponent {
  username: string | null = null;
  @Input() postId!: string;
  @Input() comments: Comment[] = [];
  userId: string | null = null;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private authService: AuthService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.username = decodedToken.username;
      this.userId = decodedToken.sub || decodedToken.userId; // Get user ID from token
    }
    this.articleService.getComments(this.postId).subscribe((comments) => {
      this.comments = comments;
    });
  }

  canDeleteComment(comment: Comment): boolean {
    // Assuming comment has a commenterId property
    return this.userId === comment.commenterId.toString();
  }

  deleteComment(comment: Comment) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(comment.id , this.postId).subscribe({
        next: () => {
          this.comments = this.comments.filter((c) => c.id !== comment.id);
        },
        error: (err) => {
          console.error('Failed to delete comment', err);
          alert('Failed to delete comment. Please try again.');
        },
      });
    }
  }

  newCommentText = '';
  currentUser = {
    name: 'Current User',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
  };

  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey) {
      this.addComment();
    }
  }

  addComment() {
    const text = this.newCommentText.trim();
    if (!text) return;

    this.articleService.addComment(this.postId, this.newCommentText).subscribe({
      next: (comment) => {
        this.comments = [comment, ...this.comments];
        this.newCommentText = '';
      },
      error: (err) => {},
    });
  }

  toggleLike(comment: Comment) {
    if (comment.isLiked) {
      // Unlike
      this.commentService.unlikeComment(Number(this.postId), comment.id).subscribe({
        next: () => {
          comment.isLiked = false;
          comment.likes--;
        },
        error: (err) => console.error('Failed to unlike comment', err),
      });
    } else {
      // Like
      this.commentService.likeComment(Number(this.postId), comment.id).subscribe({
        next: () => {
          comment.isLiked = true;
          comment.likes++;
        },
        error: (err) => console.error('Failed to like comment', err),
      });
    }
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }

    return 'just now';
  }

  goToAuthorProfile(id: string) {
    this.router.navigate(['/profile', id]);
  }
}
