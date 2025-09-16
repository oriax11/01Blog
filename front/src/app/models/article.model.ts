export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  articlesCount: number;
  followersCount: number;
  followingCount: number;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  articleId: string;
  createdAt: Date;
}