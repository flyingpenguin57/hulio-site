'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { Article } from '@/app/lib/types';
import { getCategories, PRESET_CATEGORIES } from '@/app/lib/categories';

interface ArticlesPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}

export default function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const limit = 8;

  // 使用 React.use() 解包 searchParams
  const params = use(searchParams);

  // 使用统一的分类配置
  const categories = getCategories();

  // 获取已发布的文章数据
  const fetchArticles = async (page: number, category?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      if (category) {
        params.append('category', category);
      }
      
      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      
      const data = await response.json();
      setArticles(data.articles || []);
      setTotal(data.total || 0);
      setCurrentPage(page);
      setSelectedCategory(category || '');
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    const page = parseInt(params?.page || '1');
    const category = params?.category || '';
    fetchArticles(page, category);
  }, [params?.page, params?.category]);

  const totalPages = Math.ceil(total / limit);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // 为每个分类分配不同的颜色
  const getCategoryColors = (category: string) => {
    const colorMap: Record<string, { bg: string; text: string; hover: string; active: string }> = {
      'Programming': {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-200',
        hover: 'hover:bg-green-200 dark:hover:bg-green-800',
        active: 'bg-green-600 text-white'
      },
      'Life': {
        bg: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-800 dark:text-purple-200',
        hover: 'hover:bg-purple-200 dark:hover:bg-purple-800',
        active: 'bg-purple-600 text-white'
      }
    };
    
    return colorMap[category] || {
      bg: 'bg-gray-100 dark:bg-gray-700',
      text: 'text-gray-700 dark:text-gray-300',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-600',
      active: 'bg-blue-600 text-white'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Articles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover insights, tutorials, and stories from our community
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => fetchArticles(1)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  !selectedCategory
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {categories.map((category) => {
                const colors = getCategoryColors(category);
                return (
                  <button
                    key={category}
                    onClick={() => fetchArticles(1, category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === category
                        ? colors.active
                        : `${colors.bg} ${colors.text} ${colors.hover}`
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Articles List */}
        {loading ? (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading articles...
            </div>
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="max-w-4xl mx-auto space-y-6 mb-8">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => window.location.href = `/articles/${article.id}`}
                >
                  <div className="p-6">
                    {/* Category */}
                    {article.category && (
                      <div className="mb-3">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColors(article.category).bg} ${getCategoryColors(article.category).text}`}>
                          {article.category}
                        </span>
                      </div>
                    )}
                    
                    {/* Title */}
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      {article.title}
                    </h2>
                    
                    {/* Summary */}
                    {article.summary && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg leading-relaxed">
                        {article.summary}
                      </p>
                    )}
                    
                    {/* Tags */}
                    {article.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Meta */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(article.created_at)}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {article.view_count} views
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {(() => {
                          let readingTime = Math.ceil(article.content.length / 1000);
                          // 如果是编程类别，阅读时间乘以3
                          if (article.category === PRESET_CATEGORIES[0]) { // Programming
                            readingTime = readingTime * 3;
                          }
                          return readingTime;
                        })()} min read
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center">
                <nav className="flex items-center space-x-2">
                  {/* Previous */}
                  {currentPage > 1 && (
                    <button
                      onClick={() => fetchArticles(currentPage - 1, selectedCategory)}
                      className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Previous
                    </button>
                  )}
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchArticles(pageNum, selectedCategory)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {/* Next */}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => fetchArticles(currentPage + 1, selectedCategory)}
                      className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Next
                    </button>
                  )}
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              {selectedCategory 
                ? `No articles found in category "${selectedCategory}"`
                : 'No articles found'
              }
            </div>
            {selectedCategory && (
              <Link
                href="/articles"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all articles
              </Link>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {articles.length} of {total} articles
          {selectedCategory && ` in category "${selectedCategory}"`}
        </div>
      </div>
    </div>
  );
}
