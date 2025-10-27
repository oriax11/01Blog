import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Article } from '../models/article.model';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { AuthService } from './auth.service';
import { Comment } from '../models/article.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(
      `${environment.apiUrl}/api/articles`,
      this.authService.getAuthHeaders()
    );
  }
  getComments(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${environment.apiUrl}/api/articles/${id}/comments`,
      this.authService.getAuthHeaders()
    );
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(
      `${environment.apiUrl}/api/articles/${id}`,
      this.authService.getAuthHeaders()
    );
  }

  getUserArticles(userId: string): Observable<Article[]> {
    return this.http.get<Article[]>(
      `${environment.apiUrl}/api/articles/user/${userId}`,
      this.authService.getAuthHeaders()
    );
  }

  createArticle(article: Partial<Article>): Observable<Article> {
    return this.http.post<Article>(
      `${environment.apiUrl}/api/articles`,
      article,
      this.authService.getAuthHeaders()
    );
  }

  addComment(postId: String, content: String): Observable<Comment> {
    return this.http.post<Comment>(
      `${environment.apiUrl}/api/articles/${postId}/comments`,
      {content},
      this.authService.getAuthHeaders()
    );
  }

  updateArticle(id: string, article: Partial<Article>): Observable<Article> {
    return this.http.put<Article>(
      `${environment.apiUrl}/api/articles/${id}`,
      article,
      this.authService.getAuthHeaders()
    );
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/api/articles/${id}`,
      this.authService.getAuthHeaders()
    );
  }
}
