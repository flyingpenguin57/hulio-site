import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import { CreateArticleRequest } from '@/app/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const category = searchParams.get('category');
    const includeDrafts = searchParams.get('includeDrafts') === 'true';
    
    const sql = getSql();
    
    // 构建查询条件
    let whereClause = includeDrafts ? 'WHERE status IN (0, 1)' : 'WHERE status = 1';
    const params: string[] = [];
    
    if (category) {
      whereClause += ' AND category = $1';
      params.push(category);
    }
    
    // 获取总数
    const countQuery = `SELECT COUNT(*) as total FROM articles ${whereClause}`;
    const countResult = await sql.unsafe(countQuery, params);
    const total = parseInt(countResult[0].total);
    
    // 计算偏移量
    const offset = (page - 1) * limit;
    
    // 获取分页数据
    const dataQuery = `
      SELECT 
        id, title, summary, content, author_id, category,
        created_at, updated_at, tags, view_count, status
      FROM articles 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    
    const queryParams = [...params, limit, offset];
    const result = await sql.unsafe(dataQuery, queryParams);
    
    return NextResponse.json({ 
      success: true, 
      articles: result,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received article data:', body);
    
    const { 
      title, 
      summary, 
      content, 
      author_id, 
      category,
      tags = [], 
      status = 1 
    }: CreateArticleRequest = body;

    // 验证必填字段
    if (!title || !content || !author_id) {
      return NextResponse.json(
        { success: false, error: 'Title, content, and author_id are required' },
        { status: 400 }
      );
    }

    console.log('Inserting article with data:', {
      title,
      summary: summary || '',
      content: content.substring(0, 100) + '...',
      author_id,
      category: category || '',
      tags,
      status
    });

    const sql = getSql();
    // 插入文章
    const result = await sql`
      INSERT INTO articles (
        title, summary, content, author_id, category, tags, status, 
        created_at, updated_at, view_count
      ) VALUES (
        ${title}, 
        ${summary || ''}, 
        ${content}, 
        ${author_id}, 
        ${category || ''}, 
        ${tags}, 
        ${status}, 
        NOW(), 
        NOW(), 
        0
      ) RETURNING id, title, summary, content, author_id, category,
                  created_at, updated_at, tags, view_count, status
    `;

    console.log('Article created successfully:', result[0]);

    return NextResponse.json({ 
      success: true, 
      data: result[0],
      message: 'Article created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating article:', error);
    
    // 返回更详细的错误信息
    let errorMessage = 'Failed to create article';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.stack : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
