'use client';

import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useWikiTerms } from '@/contexts/WikiContext';
import { IWikiTerm } from '@/types/wiki';
import styles from './WikiHighlight.module.css';

function TermSpan({ match, children }: { match: IWikiTerm; children: string }) {
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    const ref = useRef<HTMLSpanElement>(null);

    const handleMouseEnter = useCallback(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setPos({
                x: rect.left + rect.width / 2,
                y: rect.top + window.scrollY,
            });
        }
    }, []);

    const handleMouseLeave = useCallback(() => setPos(null), []);

    return (
        <>
            <span
                ref={ref}
                className={styles.term}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </span>
            {pos && createPortal(
                <div
                    className={styles.tooltip}
                    style={{
                        position: 'absolute',
                        left: pos.x,
                        top: pos.y - 10,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <strong className={styles.tooltipTerm}>{match.term}</strong>
                    <span className={styles.tooltipDef}>{match.definition}</span>
                </div>,
                document.body
            )}
        </>
    );
}

export default function WikiHighlight({ text }: { text: string }) {
    const { terms } = useWikiTerms();

    if (!terms.length || !text) return <>{text}</>;

    const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);

    const patterns = sorted.map(t => {
        const escaped = t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
                    return <TermSpan key={i} match={match}>{part}</TermSpan>;
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}
