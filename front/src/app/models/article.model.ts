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
export interface Report {
  id: string;
  type: 'user' | 'post';
  targetId: string;
  targetTitle: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalReports: number;
}

export interface AdminUser extends User {
  status: 'active' | 'banned' ;
  joinedAt: Date;
  reportCount: number;
}

export interface AdminPost extends Article {
  status: 'published' | 'hidden' | 'deleted';
  reportCount: number;
  views: number;
}
