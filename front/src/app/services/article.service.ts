import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Article, User } from '../models/article.model';
import { Observable, of } from 'rxjs';
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiUrl}/api/articles`);
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${environment.apiUrl}/api/articles/${id}`);
  }

  getUserArticles(userId: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiUrl}/api/articles/user/${userId}`);
  }

  createArticle(article: Partial<Article>): Observable<Article> {
    return this.http.post<Article>(`${environment.apiUrl}/api/articles`, article);
  }
}
