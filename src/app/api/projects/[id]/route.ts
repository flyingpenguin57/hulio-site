import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import { UpdateProjectRequest } from '@/app/lib/types';

interface ProjectParams {
  params: Promise<{ id: string }>;
}

// GET /api/projects/[id] - 获取单个项目
export async function GET(request: NextRequest, { params }: ProjectParams) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const sql = getSql();
    
    const result = await sql`
      SELECT 
        id, name, description, url, github, picture, status,
        created_time, updated_time
      FROM project 
      WHERE id = ${projectId}
    `;
    
    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      project: result[0] 
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - 更新项目
export async function PUT(request: NextRequest, { params }: ProjectParams) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('Updating project with data:', body);
    
    const { 
      name, 
      description, 
      url, 
      github, 
      picture,
      status
    }: UpdateProjectRequest = body;

    // 验证至少有一个字段需要更新
    if (name === undefined && description === undefined && url === undefined && 
        github === undefined && picture === undefined && status === undefined) {
      return NextResponse.json(
        { success: false, error: 'At least one field must be provided for update' },
        { status: 400 }
      );
    }

    const sql = getSql();
    
    // 构建更新查询
    const updateFields = [];
    const updateValues = [];
    
    if (name !== undefined) {
      updateFields.push('name = $' + (updateValues.length + 1));
      updateValues.push(name.trim());
    }
    if (description !== undefined) {
      updateFields.push('description = $' + (updateValues.length + 1));
      updateValues.push(description?.trim() || null);
    }
    if (url !== undefined) {
      updateFields.push('url = $' + (updateValues.length + 1));
      updateValues.push(url?.trim() || null);
    }
    if (github !== undefined) {
      updateFields.push('github = $' + (updateValues.length + 1));
      updateValues.push(github?.trim() || null);
    }
    if (picture !== undefined) {
      updateFields.push('picture = $' + (updateValues.length + 1));
      updateValues.push(picture?.trim() || null);
    }
    if (status !== undefined) {
      updateFields.push('status = $' + (updateValues.length + 1));
      updateValues.push(status);
    }
    
    // 添加更新时间
    updateFields.push('updated_time = NOW()');
    
    const updateQuery = `
      UPDATE project 
      SET ${updateFields.join(', ')}
      WHERE id = $${updateValues.length + 1}
      RETURNING id, name, description, url, github, picture, status,
                created_time, updated_time
    `;
    
    const queryParams = [...updateValues, projectId];
    const result = await sql.unsafe(updateQuery, queryParams);
    
    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    console.log('Project updated successfully:', result[0]);
    
    return NextResponse.json({ 
      success: true, 
      data: result[0],
      message: 'Project updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating project:', error);
    
    let errorMessage = 'Failed to update project';
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

// DELETE /api/projects/[id] - 删除项目
export async function DELETE(request: NextRequest, { params }: ProjectParams) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const sql = getSql();
    
    // 检查项目是否存在
    const checkResult = await sql`
      SELECT id FROM project WHERE id = ${projectId}
    `;
    
    if (checkResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // 删除项目
    await sql`
      DELETE FROM project WHERE id = ${projectId}
    `;
    
    console.log('Project deleted successfully:', projectId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project deleted successfully' 
    });
    
  } catch (error) {
    console.error('Error deleting project:', error);
    
    let errorMessage = 'Failed to delete project';
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
