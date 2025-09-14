import { Injectable } from '@angular/core';
import { Article, User } from '../models/article.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private mockUser: User = {
    id: '1',
    username: 'john_doe',
    email: 'john@student.edu',
    bio: 'Computer Science student passionate about technology and coding.',
    avatarUrl: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=150',
    articlesCount: 12,
    followersCount: 234,
    followingCount: 156
  };

  private mockArticles: Article[] = [
    {
      id: '1',
      title: 'Getting Started with Machine Learning: A Student\'s Guide',
      content: 'Machine learning has become one of the most exciting fields in computer science...',
      excerpt: 'A comprehensive introduction to machine learning concepts for students starting their journey in AI.',
      imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: this.mockUser,
      category: 'Technology',
      tags: ['ML', 'AI', 'Programming'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      likesCount: 42,
      commentsCount: 8
    },
    {
      id: '2',
      title: 'Web Development Best Practices for Beginners',
      content: 'Starting your web development journey can be overwhelming...',
      excerpt: 'Essential tips and tricks every new web developer should know to build better applications.',
      imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: this.mockUser,
      category: 'Web Development',
      tags: ['HTML', 'CSS', 'JavaScript'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      likesCount: 38,
      commentsCount: 12
    },
    {
      id: '3',
      title: 'The Future of Cybersecurity: What Students Need to Know',
      content: 'Cybersecurity threats are evolving rapidly in today\'s digital world...',
      excerpt: 'Understanding the cybersecurity landscape and career opportunities for students.',
      imageUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: this.mockUser,
      category: 'Security',
      tags: ['Cybersecurity', 'Career', 'Technology'],
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      likesCount: 55,
      commentsCount: 15
    },
    {
      id: '4',
      title: 'Building Your First Mobile App: React Native vs Flutter',
      content: 'Mobile app development has never been more accessible to students...',
      excerpt: 'Comparing the two most popular cross-platform mobile development frameworks.',
      imageUrl: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: this.mockUser,
      category: 'Mobile Development',
      tags: ['React Native', 'Flutter', 'Mobile'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      likesCount: 29,
      commentsCount: 6
    }
  ];

  getArticles(): Observable<Article[]> {
    return of(this.mockArticles);
  }

  getArticleById(id: string): Observable<Article | undefined> {
    const article = this.mockArticles.find(a => a.id === id);
    return of(article);
  }

  getUserArticles(userId: string): Observable<Article[]> {
    const userArticles = this.mockArticles.filter(a => a.author.id === userId);
    return of(userArticles);
  }

  createArticle(article: Partial<Article>): Observable<Article> {
    const newArticle: Article = {
      id: Date.now().toString(),
      title: article.title || '',
      content: article.content || '',
      excerpt: article.excerpt || '',
      imageUrl: article.imageUrl,
      author: this.mockUser,
      category: article.category || 'General',
      tags: article.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      likesCount: 0,
      commentsCount: 0
    };
    this.mockArticles.unshift(newArticle);
    return of(newArticle);
  }
}