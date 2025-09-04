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

    // 检查是否要增加浏览量，默认为 true（向后兼容）
    const url = new URL(request.url);
    const incrementView = url.searchParams.get('incrementView') !== 'false';

    const sql = getSql();
    
    let result;
    if (incrementView) {
      // 获取文章并增加浏览量
      result = await sql`
        UPDATE articles 
        SET view_count = view_count + 1 
        WHERE id = ${articleId}
        RETURNING id, title, summary, content, author_id, category,
                  created_at, updated_at, tags, view_count, status
      `;
    } else {
      // 只获取文章，不增加浏览量
      result = await sql`
        SELECT id, title, summary, content, author_id, category,
               created_at, updated_at, tags, view_count, status
        FROM articles 
        WHERE id = ${articleId}
      `;
    }

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
    
    console.log('🔍 PUT /api/articles/[id] - Article ID:', articleId);
    
    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('📝 Request body:', body);
    
    const { 
      title, 
      summary, 
      content, 
      category,
      tags, 
      status 
    }: UpdateArticleRequest = body;

    // 检查是否是只更新状态的操作
    const isStatusOnlyUpdate = Object.keys(body).length === 1 && body.hasOwnProperty('status');
    console.log('🔄 Is status only update:', isStatusOnlyUpdate);
    
    // 如果不是只更新状态，则验证必填字段
    if (!isStatusOnlyUpdate && (!title || !content)) {
      console.log('❌ Validation failed - missing title or content');
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const sql = getSql();
    
    let result;
    if (isStatusOnlyUpdate) {
      // 只更新状态
      console.log('🔄 Executing status-only update for article:', articleId, 'with status:', status);
      result = await sql`
        UPDATE articles 
        SET 
          status = ${status !== undefined ? status : 1},
          updated_at = NOW()
        WHERE id = ${articleId}
        RETURNING id, title, summary, content, author_id, category,
                  created_at, updated_at, tags, view_count, status
      `;
      console.log('✅ Status update result:', result);
    } else {
      // 更新完整文章信息
      console.log('🔄 Executing full update for article:', articleId);
      result = await sql`
        UPDATE articles 
        SET 
          title = ${title || ''},
          summary = ${summary || ''},
          content = ${content || ''},
          category = ${category || ''},
          tags = ${tags || []},
          status = ${status !== undefined ? status : 1},
          updated_at = NOW()
        WHERE id = ${articleId}
        RETURNING id, title, summary, content, author_id, category,
                  created_at, updated_at, tags, view_count, status
      `;
      console.log('✅ Full update result:', result);
    }

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
