import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css'],
})
export class CommentSectionComponent {
  @Input() postId!: string;
  @Input() comments: Comment[] = [];
  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit() {
    this.articleService.getComments(this.postId).subscribe((comments) => {
      this.comments = comments;
    });
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
    console.log(this.postId);
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
    comment.isLiked = !comment.isLiked;
    comment.likes += comment.isLiked ? 1 : -1;
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
