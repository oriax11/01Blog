import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Comment {
  id: number;
  content: string;
  articleId: number;
  author: any;
  createdAt: Date;
  updatedAt?: Date;
  likesCount: number;
  isLiked: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getComments(articleId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${environment.apiUrl}/api/articles/${articleId}/comments`,
      this.authService.getAuthHeaders()
    );
  }

  addComment(articleId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(
      `${environment.apiUrl}/api/articles/${articleId}/comments`,
      { content },
      this.authService.getAuthHeaders()
    );
  }

  updateComment(commentId: number, content: string): Observable<Comment> {
    return this.http.put<Comment>(
      `${environment.apiUrl}/api/comments/${commentId}`,
      { content },
      this.authService.getAuthHeaders()
    );
  }

  deleteComment(commentId: number, articleId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/api/articles/${articleId}/comments/${commentId}`,
      this.authService.getAuthHeaders()
    );
  }

  likeComment(articleId: number, commentId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/api/articles/${articleId}/comments/${commentId}/like`,
      {},
      this.authService.getAuthHeaders()
    );
  }

  unlikeComment(articleId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/api/articles/${articleId}/comments/${commentId}/unlike`,
      this.authService.getAuthHeaders()
    );
  }
}
