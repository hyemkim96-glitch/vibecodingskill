'use client';

import { useWikiTerms } from '@/contexts/WikiContext';
import styles from './WikiHighlight.module.css';

export default function WikiHighlight({ text }: { text: string }) {
    const { terms } = useWikiTerms();

    if (!terms.length || !text) return <>{text}</>;

    // Sort longest first to avoid partial matches (e.g. "AI 코딩" before "AI")
    const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);

    const patterns = sorted.map(t => {
        const escaped = t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Word boundaries only for ASCII-only terms
        const isAscii = /^[\x00-\x7F]+$/.test(t.term);
        return isAscii ? `\\b${escaped}\\b` : escaped;
    });

    const regex = new RegExp(`(${patterns.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) => {
                const match = sorted.find(
                    t => t.term.toLowerCase() === part.toLowerCase()
                );
                if (match) {
                    return (
                        <span key={i} className={styles.term}>
                            {part}
                            <span className={styles.tooltip}>
                                <strong className={styles.tooltipTerm}>{match.term}</strong>
                                <span className={styles.tooltipDef}>{match.definition}</span>
                            </span>
                        </span>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}
