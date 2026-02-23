'use client';

import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, X, Copy, Check, Info, Zap, Layers, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SkillCard from '@/components/SkillCard';
import SubmitSkillForm from '@/components/SubmitSkillForm';
import WikiHighlight from '@/components/WikiHighlight';
import { ISkill } from '@/types/skill';
import styles from './SkillLibrary.module.css';

interface TipArticle {
    id: string;
    title: string;
    description: string | null;
    color: string | null;
    read_time: number | null;
}

function normalizeTags(tags: unknown): string[] {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string' && tags) return tags.split(',').map(t => t.trim()).filter(Boolean);
    return [];
}

function parseDescription(desc: string) {
    const match = desc?.match(/^\[기술 스택:\s*(.+?)\]/);
    if (match) {
        return {
            stack: match[1],
            text: desc.replace(/^\[기술 스택:\s*.+?\]\s*/, ''),
        };
    }
    return { stack: null, text: desc };
}

export default function SkillLibrary({ initialSkills, tipArticles = [] }: { initialSkills: ISkill[]; tipArticles?: TipArticle[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const allTags = Array.from(
        new Set(initialSkills.flatMap(skill => normalizeTags(skill.tags)))
    ).sort();

    const filteredSkills = initialSkills.filter(skill => {
        const matchesSearch =
            skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (normalizeTags(skill.tags)).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesTag = selectedTag ? (normalizeTags(skill.tags)).includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    const selectedSkill = selectedIndex !== null ? filteredSkills[selectedIndex] : null;

    const handlePrev = () => {
        if (selectedIndex === null) return;
        setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : filteredSkills.length - 1);
        setCopied(false);
    };

    const handleNext = () => {
        if (selectedIndex === null) return;
        setSelectedIndex(selectedIndex < filteredSkills.length - 1 ? selectedIndex + 1 : 0);
        setCopied(false);
    };

    const handleCopy = async () => {
        if (!selectedSkill) return;
        try {
            await navigator.clipboard.writeText(selectedSkill.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const closeModal = () => {
        setSelectedIndex(null);
        setCopied(false);
    };

    return (
        <div>
            <div className={styles.contentLayout}>
                <main>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="스킬셋 검색 (예: 기획, 마케팅, CSS...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {allTags.length > 0 && (
                        <div className={styles.tagFilter}>
                            <button
                                className={`${styles.tagChip} ${selectedTag === null ? styles.tagChipActive : ''}`}
                                onClick={() => setSelectedTag(null)}
                            >
                                전체
                            </button>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    className={`${styles.tagChip} ${selectedTag === tag ? styles.tagChipActive : ''}`}
                                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                >
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    )}

                    {filteredSkills.length > 0 ? (
                        <div className={styles.grid}>
                            {filteredSkills.map((skill, idx) => (
                                <SkillCard
                                    key={skill.id || idx}
                                    {...skill}
                                    onOpen={() => setSelectedIndex(idx)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            {searchTerm ? '검색 결과가 없습니다.' : '등록된 스킬셋이 없습니다.'}
                        </div>
                    )}

                    <div className={styles.suggestRow}>
                        <button
                            className={styles.suggestBtn}
                            onClick={() => setIsSubmitModalOpen(true)}
                        >
                            <Plus size={18} />
                            스킬 제안하기
                        </button>
                    </div>
                </main>

                {tipArticles.length > 0 && (
                    <aside>
                        <div className={styles.sidebarSection}>
                            <h3>For Beginners</h3>
                            <div className={styles.toolList}>
                                {tipArticles.map(article => (
                                    <Link key={article.id} href={`/tips/${article.id}`} className={styles.toolLink}>
                                        <div className={styles.toolTitle}>
                                            <strong>{article.title}</strong>
                                            <ArrowRight size={14} />
                                        </div>
                                        {article.description && (
                                            <p>{article.description}</p>
                                        )}
                                        {article.read_time && (
                                            <span className={styles.readTime}>{article.read_time} min read</span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}
            </div>

            {isSubmitModalOpen && (
                <SubmitSkillForm onClose={() => setIsSubmitModalOpen(false)} />
            )}

            {selectedSkill && (
                <div className={styles.overlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{selectedSkill.name}</h2>
                            <button className={styles.closeBtn} onClick={closeModal}>
                                <X size={20} />
                            </button>
                        </div>

                        {(() => {
                            const { stack, text } = parseDescription(selectedSkill.description);
                            const tags = normalizeTags(selectedSkill.tags);
                            return (
                                <>
                                    <p className={styles.modalDesc}><WikiHighlight text={text} /></p>
                                    <div className={styles.metaGrid}>
                                        {tags.length > 0 && (
                                            <div className={styles.metaItem}>
                                                <Tag size={14} className={styles.metaIcon} />
                                                <span className={styles.metaLabel}>도움 분야:</span>
                                                <div className={styles.modalTags}>
                                                    {tags.map(tag => (
                                                        <span key={tag} className={styles.tag}>#{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {stack && (
                                            <div className={styles.metaItem}>
                                                <Layers size={14} className={styles.metaIcon} />
                                                <span className={styles.metaLabel}>기술 스택:</span>
                                                <span className={styles.metaValue}>{stack}</span>
                                            </div>
                                        )}
                                        <div className={styles.metaItem}>
                                            <Zap size={16} className={styles.metaIcon} />
                                            <span className={styles.metaLabel}>기대 효과:</span>
                                            <span className={styles.metaValue}>{selectedSkill.effect}</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <Info size={14} className={styles.metaIcon} />
                                            <span className={styles.metaLabel}>예상 토큰:</span>
                                            <span className={styles.metaValue}>{selectedSkill.tokens}</span>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}

                        <div className={styles.contentSection}>
                            <div className={styles.contentHeader}>
                                <span className={styles.contentLabel}>프롬프트 전문</span>
                                <button
                                    className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                                    onClick={handleCopy}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    <span>{copied ? '복사됨' : '복사'}</span>
                                </button>
                            </div>
                            <pre className={styles.fullContent}>{selectedSkill.content}</pre>
                        </div>

                        <div className={styles.modalNav}>
                            <button className={styles.navBtn} onClick={handlePrev}>
                                <ChevronLeft size={20} />
                                <span>이전</span>
                            </button>
                            <span className={styles.navCount}>
                                {selectedIndex! + 1} / {filteredSkills.length}
                            </span>
                            <button className={styles.navBtn} onClick={handleNext}>
                                <span>다음</span>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
