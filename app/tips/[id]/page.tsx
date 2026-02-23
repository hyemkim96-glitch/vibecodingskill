import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import PageHeader from '@/components/PageHeader';
import WikiHighlight from '@/components/WikiHighlight';
import styles from './Detail.module.css';
import { IArticle } from '@/types/article';

export default async function TipDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

    if (!article) {
        notFound();
    }

    const typedArticle = article as IArticle;

    return (
        <div className={styles.container}>
            <Link href="/tips" className={styles.backLink}>
                <ArrowLeft size={16} /> 바이브 코딩 꿀팁으로 돌아가기
            </Link>

            <article className={styles.article}>
                <header className={styles.header}>
                    <div className={styles.meta}>
                        <span className={styles.category}>{typedArticle.category}</span>
                        <span className={styles.dot}>•</span>
                        <span className={styles.readTime}>
                            <Clock size={14} /> {typedArticle.read_time} min read
                        </span>
                    </div>
                    <h1 className={styles.title}>{typedArticle.title}</h1>
                    <p className={styles.description}><WikiHighlight text={typedArticle.description ?? ''} /></p>

                    <div className={styles.infoBar}>
                        <div className={styles.infoItem}>
                            <Calendar size={14} />
                            <span>{new Date(typedArticle.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <BookOpen size={14} />
                            <span>핵심 가이드</span>
                        </div>
                    </div>
                </header>

                <div className={styles.content}>
                    {typedArticle.content ? (
                        <ReactMarkdown>
                            {typedArticle.content.replace(/\\n/g, '\n')}
                        </ReactMarkdown>
                    ) : (
                        <div className={styles.emptyContent}>
                            아직 상세 내용이 준비되지 않은 아티클입니다.
                        </div>
                    )}
                </div>
            </article>

            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <h4>도움이 되셨나요?</h4>
                    <p>바이브 코딩의 더 많은 꿀팁과 스킬셋을 탐색해 보세요.</p>
                    <Link href="/" className={styles.footerBtn}>
                        스킬셋 라이브러리 가기
                    </Link>
                </div>
            </footer>
        </div>
    );
}
