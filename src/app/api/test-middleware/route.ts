import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'GET 请求成功 - 不需要认证',
    headers: {
      authorization: request.headers.get('authorization') || '无 Authorization 头'
    }
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'POST 请求成功 - 需要认证',
    headers: {
      authorization: request.headers.get('authorization') || '无 Authorization 头'
    }
  });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'DELETE 请求成功 - 需要认证',
    headers: {
      authorization: request.headers.get('authorization') || '无 Authorization 头'
    }
  });
}
