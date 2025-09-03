import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import { CreateProjectRequest } from '@/app/lib/types';

// GET /api/projects - 获取所有项目
export async function GET() {
  try {
    const sql = getSql();
    
    const result = await sql`
      SELECT 
        id, name, description, url, github, picture,
        created_time, updated_time
      FROM project 
      ORDER BY created_time DESC
    `;
    
    return NextResponse.json({ 
      success: true, 
      projects: result 
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - 创建新项目
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received project data:', body);
    
    const { 
      name, 
      description, 
      url, 
      github, 
      picture 
    }: CreateProjectRequest = body;

    // 验证必填字段
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }

    console.log('Inserting project with data:', {
      name: name.trim(),
      description: description?.trim() || null,
      url: url?.trim() || null,
      github: github?.trim() || null,
      picture: picture?.trim() || null
    });

    const sql = getSql();
    
    // 插入项目
    const result = await sql`
      INSERT INTO project (
        name, description, url, github, picture, 
        created_time, updated_time
      ) VALUES (
        ${name.trim()}, 
        ${description?.trim() || null}, 
        ${url?.trim() || null}, 
        ${github?.trim() || null}, 
        ${picture?.trim() || null}, 
        NOW(), 
        NOW()
      ) RETURNING id, name, description, url, github, picture,
                  created_time, updated_time
    `;

    console.log('Project created successfully:', result[0]);

    return NextResponse.json({ 
      success: true, 
      data: result[0],
      message: 'Project created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating project:', error);
    
    // 返回更详细的错误信息
    let errorMessage = 'Failed to create project';
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
