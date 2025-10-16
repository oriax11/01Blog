import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Article } from '../models/article.model';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('auth_token'); 
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    return { headers };
  }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiUrl}/api/articles`, this.getAuthHeaders());
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${environment.apiUrl}/api/articles/${id}`, this.getAuthHeaders());
  }

  getUserArticles(userId: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiUrl}/api/articles/user/${userId}`, this.getAuthHeaders());
  }

  createArticle(article: Partial<Article>): Observable<Article> {
    return this.http.post<Article>(`${environment.apiUrl}/api/articles`, article, this.getAuthHeaders());
  }
}
