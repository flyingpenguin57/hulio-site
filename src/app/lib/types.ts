export interface Article {
  id: number;
  title: string;
  summary: string | null;
  content: string;
  author_id: number;
  category: string | null;
  created_at: Date;
  updated_at: Date;
  tags: string[];
  view_count: number;
  status: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateArticleRequest {
  title: string;
  summary?: string;
  content: string;
  author_id: number;
  category?: string;
  tags?: string[];
  status?: number;
}

export interface UpdateArticleRequest {
  title?: string;
  summary?: string;
  content?: string;
  category?: string;
  tags?: string[];
  status?: number;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  url: string | null;
  github: string | null;
  picture: string | null;
  created_time: Date;
  updated_time: Date;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  url?: string;
  github?: string;
  picture?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  url?: string;
  github?: string;
  picture?: string;
}
