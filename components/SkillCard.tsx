'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import WikiHighlight from './WikiHighlight';
import styles from './SkillCard.module.css';

interface SkillCardProps {
    name: string;
    content: string;
    tokens: string;
    effect: string;
    description: string;
    tags: string[];
    onOpen: () => void;
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

export default function SkillCard({ name, content, description, tags, onOpen }: SkillCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className={styles.card} onClick={onOpen}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h2 className={styles.name}>{name}</h2>
                    <div className={styles.tags}>
                        {normalizeTags(tags).map(tag => (
                            <span key={tag} className={styles.tag}>#{tag}</span>
                        ))}
                    </div>
                </div>
                <button
                    className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                    onClick={handleCopy}
                    aria-label="Copy to clipboard"
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    <span>{copied ? '복사됨' : '복사'}</span>
                </button>
            </div>

                <p className={styles.description}><WikiHighlight text={parseDescription(description).text} /></p>

            <div className={styles.footer}>
                <div className={styles.preview}>
                    <code>{content.length > 60 ? `${content.substring(0, 60)}...` : content}</code>
                </div>
            </div>
        </div>
    );
}
