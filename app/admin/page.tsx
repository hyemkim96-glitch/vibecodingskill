import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import styles from './Admin.module.css';
import { ShieldAlert, Database } from 'lucide-react';
import SkillModeration from '@/components/SkillModeration';
import { seedDefaultSkills } from '@/app/actions/skill-actions';

function SeedButton() {
    return (
        <button
            onClick={async () => {
                const res = await seedDefaultSkills();
                if (res.success) alert('Skills seeded successfully!');
                else alert('Error seeding skills');
            }}
            style={{
                margin: '20px 0',
                padding: '10px 20px',
                background: 'var(--color-text-primary)',
                color: 'var(--color-bg-primary)',
                fontWeight: 'bold',
                cursor: 'pointer'
            }}
        >
            <Database size={16} /> Seed Default Skills
        </button>
    );
}

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Double check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return (
            <div className={styles.errorContainer}>
                <ShieldAlert size={48} />
                <h1>접근 권한이 없습니다.</h1>
                <p>관리자 계정으로 로그인해주세요.</p>
                <a href="/">홈으로 가기</a>
            </div>
        );
    }

    // Fetch pending skills
    const { data: pendingSkills } = await supabase
        .from('skills')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>관리자 대시보드</h1>
                <SeedButton />
                <p>제출된 스킬셋을 심사하고 승인합니다.</p>
            </header>

            <div className={styles.list}>
                {pendingSkills && pendingSkills.length > 0 ? (
                    pendingSkills.map((skill) => (
                        <div key={skill.id} className={styles.card}>
                            <div className={styles.skillHeader}>
                                <h3>{skill.name}</h3>
                                {skill.tags && skill.tags.length > 0 && (
                                    <span className={styles.tag}>{skill.tags[0]}</span>
                                )}
                            </div>
                            <p className={styles.desc}>{skill.description}</p>
                            <SkillModeration skillId={skill.id} />
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        심사 대기 중인 스킬셋이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
