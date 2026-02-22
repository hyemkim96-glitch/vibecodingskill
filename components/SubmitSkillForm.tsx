'use client'

import { useState } from 'react'
import { submitSkill } from '@/app/actions/skill-actions'
import { Send, CheckCircle2, AlertCircle, X } from 'lucide-react'
import styles from './SubmitSkillForm.module.css'

interface SubmitSkillFormProps {
    onClose: () => void
}

export default function SubmitSkillForm({ onClose }: SubmitSkillFormProps) {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        const formData = new FormData(e.currentTarget)
        const res = await submitSkill(formData)

        setLoading(false)
        setResult(res)

        if (res.success) {
            setTimeout(() => {
                onClose()
            }, 2000)
        }
    }

    if (result?.success) {
        return (
            <div className={styles.successState}>
                <CheckCircle2 size={48} className={styles.successIcon} />
                <h2>제출이 완료되었습니다!</h2>
                <p>관리자의 승인 후 라이브러리에 게시됩니다.</p>
            </div>
        )
    }

    return (
        <div className={styles.formOverlay} onClick={onClose}>
            <div className={styles.formContainer} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>새 스킬 제안하기</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">스킬 이름</label>
                        <input
                            id="name"
                            name="name"
                            placeholder="예: 클린 코드 리뷰어"
                            required
                            maxLength={50}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="tags">어디에 도움이 되나요? (쉼표로 구분)</label>
                        <input
                            id="tags"
                            name="tags"
                            placeholder="예: 디자인 개선, 기획서 작성, 마케팅 자동화"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="description">설명</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="이 스킬이 어떤 도움을 주는지 간단히 적어주세요."
                            rows={2}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="stack">기술 스택</label>
                        <input
                            id="stack"
                            name="stack"
                            placeholder="예: Next.js + Supabase + TypeScript"
                        />
                    </div>

                    <div className={styles.twoCol}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="effect">기대 효과</label>
                            <input
                                id="effect"
                                name="effect"
                                placeholder="예: 개발 시간 80% 단축"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="tokens">예상 토큰</label>
                            <input
                                id="tokens"
                                name="tokens"
                                placeholder="예: ~500"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="content">프롬프트 전문</label>
                        <textarea
                            id="content"
                            name="content"
                            placeholder="실제 AI에게 전달할 프롬프트 전문을 입력하세요."
                            required
                            rows={8}
                            className={styles.codeArea}
                        />
                    </div>

                    {result?.error && (
                        <div className={styles.errorMsg}>
                            <AlertCircle size={16} />
                            {result.error}
                        </div>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? '제출 중...' : (
                            <>
                                <Send size={18} />
                                제출하기
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
