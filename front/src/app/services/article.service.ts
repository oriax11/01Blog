import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Article } from '../models/article.model';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { AuthService } from './auth.service';

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
}
