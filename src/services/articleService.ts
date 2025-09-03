import { Article, CreateArticleRequest, UpdateArticleRequest } from '@/app/lib/types';

const API_BASE = '/api/articles';

export class ArticleService {
  // 获取所有文章
  static async getAllArticles(): Promise<Article[]> {
    try {
      const response = await fetch(API_BASE);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch articles');
      }
      
      return result.data as Article[];
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  // 获取单篇文章
  static async getArticle(id: number): Promise<Article> {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch article');
      }
      
      return result.data as Article;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  }

  // 创建文章
  static async createArticle(article: CreateArticleRequest): Promise<Article> {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create article');
      }
      
      return result.data as Article;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  // 更新文章
  static async updateArticle(id: number, article: UpdateArticleRequest): Promise<Article> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update article');
      }
      
      return result.data as Article;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  // 删除文章
  static async deleteArticle(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }

  // 发布文章
  static async publishArticle(id: number): Promise<Article> {
    return this.updateArticle(id, { status: 1 });
  }

  // 保存为草稿
  static async saveAsDraft(id: number): Promise<Article> {
    return this.updateArticle(id, { status: 0 });
  }
}
