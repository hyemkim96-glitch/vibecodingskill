import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <ShieldAlert size={48} />
        <h1>접근 권한이 없습니다.</h1>
        <p>관리자 계정으로 로그인해주세요.</p>
        <Link href="/">홈으로 가기</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px' }}>
      <h1>관리자 대시보드</h1>
      <p>This page is under construction.</p>
    </div>
  );
}
