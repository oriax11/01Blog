export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  commentsCount: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
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