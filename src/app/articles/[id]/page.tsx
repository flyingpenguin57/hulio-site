import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSql } from '@/app/lib/db';
import { Article } from '@/app/lib/types';
import { PRESET_CATEGORIES } from '@/app/lib/categories';
import MarkdownRenderer from './MarkdownRenderer';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

// 获取单篇文章数据
async function getArticle(id: number): Promise<Article | null> {
  try {
    const sql = getSql();
    
    // 增加浏览量
    await sql`
      UPDATE articles 
      SET view_count = view_count + 1 
      WHERE id = ${id}
    `;
    
    // 获取文章数据
    const result = await sql`
      SELECT id, title, summary, content, author_id, category, created_at, updated_at, tags, view_count, status
      FROM articles 
      WHERE id = ${id} AND status = 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    const row = result[0];
    return {
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      author_id: row.author_id,
      category: row.category,
      created_at: row.created_at,
      updated_at: row.updated_at,
      tags: row.tags || [],
      view_count: row.view_count || 0,
      status: row.status || 0
    } as Article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// 获取相关文章
async function getRelatedArticles(category: string | null, currentId: number, limit: number = 3): Promise<Article[]> {
  try {
    const sql = getSql();
    
    let query;
    if (category) {
      query = sql`
        SELECT id, title, summary, category, created_at, tags, view_count
        FROM articles 
        WHERE status = 1 AND category = ${category} AND id != ${currentId}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else {
      query = sql`
        SELECT id, title, summary, category, created_at, tags, view_count
        FROM articles 
        WHERE status = 1 AND id != ${currentId}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    }
    
    const result = await query;
    
    return result.map(row => ({
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: '',
      author_id: row.author_id,
      category: row.category,
      created_at: row.created_at,
      updated_at: row.updated_at,
      tags: row.tags || [],
      view_count: row.view_count || 0,
      status: row.status || 0
    })) as Article[];
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const articleId = parseInt(id);
  
  if (isNaN(articleId)) {
    notFound();
  }
  
  const article = await getArticle(articleId);
  
  if (!article) {
    notFound();
  }
  
  const relatedArticles = await getRelatedArticles(article.category, articleId);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatReadingTime = (content: string, category: string | null) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    let readingTime = Math.ceil(words / wordsPerMinute);
    
    // 如果是编程类别，阅读时间乘以3
    if (category === PRESET_CATEGORIES[0]) { // Programming
      readingTime = readingTime * 3;
    }
    
    return readingTime;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/articles" className="hover:text-gray-700 dark:hover:text-gray-300">
                Articles
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 dark:text-white font-medium">
              {article.title}
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            {/* Category */}
            {article.category && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {article.category}
                </span>
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {article.title}
            </h1>
            
            {/* Summary */}
            {article.summary && (
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {article.summary}
              </p>
            )}
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(article.created_at)}
              </div>
              
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {article.view_count} views
              </div>
              
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatReadingTime(article.content, article.category)} min read
              </div>
            </div>
          </div>
        </article>

        {/* Article Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownRenderer content={article.content} />
            </div>
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedArticles.map((relatedArticle) => (
                  <article key={relatedArticle.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <Link
                      href={`/articles/${relatedArticle.id}`}
                      className="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 transition-colors duration-200"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-2">
                        {relatedArticle.title}
                      </h4>
                      {relatedArticle.summary && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {relatedArticle.summary}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(relatedArticle.created_at)}</span>
                        <span>{relatedArticle.view_count} views</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back to Articles */}
        <div className="mt-8 text-center">
          <Link
            href="/articles"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
