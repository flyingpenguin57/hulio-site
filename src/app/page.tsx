import { redirect } from 'next/navigation';

export default function Home() {
  // 重定向到 about 页面
  redirect('/about');
}
