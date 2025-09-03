import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import { UpdateArticleRequest } from '@/app/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);
    
    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    const sql = getSql();
    // 获取文章并增加浏览量
    const result = await sql`
      UPDATE articles 
      SET view_count = view_count + 1 
      WHERE id = ${articleId}
      RETURNING id, title, summary, content, author_id, category,
                created_at, updated_at, tags, view_count, status
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result[0] 
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);
    
    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      summary, 
      content, 
      category,
      tags, 
      status 
    }: UpdateArticleRequest = body;

    // 验证必填字段
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const sql = getSql();
    // 更新文章
    const result = await sql`
      UPDATE articles 
      SET 
        title = ${title},
        summary = ${summary || ''},
        content = ${content},
        category = ${category || ''},
        tags = ${tags || []},
        status = ${status || 1},
        updated_at = NOW()
      WHERE id = ${articleId}
      RETURNING id, title, summary, content, author_id, category,
                created_at, updated_at, tags, view_count, status
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: result[0],
      message: 'Article updated successfully'
    });

  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);
    
    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    const sql = getSql();
    // 删除文章
    const result = await sql`
      DELETE FROM articles 
      WHERE id = ${articleId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Article deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
