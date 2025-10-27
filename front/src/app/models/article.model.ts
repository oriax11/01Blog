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
  isLiked?: boolean;
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
  commenterUsername: string;
  commenterId: string;
  avatarUrl?: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked?: boolean;
}
