'use client';

import { useState } from 'react';
import styles from './Profile.module.css';
import { IPRD } from '@/types/prd';
import { User, Database, Shield } from 'lucide-react';
import PRDPreviewModal from './PRDPreviewModal';

export default function ProfilePage({
    user,
    profile,
    prds
}: {
    user: any,
    profile: any,
    prds: IPRD[]
}) {
    const [selectedPRD, setSelectedPRD] = useState<IPRD | null>(null);

    const handleDownload = async (prd: IPRD) => {
        const { exportToDocx } = await import('@/lib/utils/export');
        await exportToDocx(prd.metadata.serviceName, prd.content);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.userCard}>
                    <div className={styles.avatar}>
                        <User size={40} />
                    </div>
                    <div className={styles.info}>
                        <h2>{profile?.username || user?.email}</h2>
                        <div className={styles.badges}>
                            <span className={styles.badge}>{profile?.badge || 'Newbie'}</span>
                            <span className={styles.rank}>Level: {profile?.ranking?.level || 'Beginner'}</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Database size={20} />
                    <h3>나의 PRD 히스토리</h3>
                </div>

                {prds.length > 0 ? (
                    <div className={styles.prdList}>
                        {prds.map((prd) => (
                            <div key={prd.id} className={styles.prdCard}>
                                <div className={styles.prdInfo}>
                                    <h4>{prd.metadata.serviceName}</h4>
                                    <span className={styles.date}>
                                        {prd.created_at ? new Date(prd.created_at).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <button
                                    className={styles.viewBtn}
                                    onClick={() => setSelectedPRD(prd)}
                                >
                                    보기
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <p>아직 생성된 PRD가 없습니다.</p>
                    </div>
                )}
            </section>

            {selectedPRD && (
                <PRDPreviewModal
                    prd={selectedPRD}
                    onClose={() => setSelectedPRD(null)}
                    onDownload={() => handleDownload(selectedPRD)}
                />
            )}

            {profile?.role === 'admin' && (
                <section className={styles.adminSection}>
                    <div className={styles.sectionHeader}>
                        <Shield size={20} />
                        <h3>관리자 메뉴</h3>
                    </div>
                    <a href="/admin" className={styles.adminBtn}>관리자 대시보드로 이동</a>
                </section>
            )}
        </div>
    );
}
