'use client'

import { useState } from 'react'
import { approveSkill, rejectSkill } from '@/app/actions/skill-actions'
import { Check, X } from 'lucide-react'
import styles from '../app/admin/Admin.module.css'

interface SkillModerationProps {
    skillId: string;
}

export default function SkillModeration({ skillId }: SkillModerationProps) {
    const [loading, setLoading] = useState(false)

    const handleApprove = async () => {
        if (!confirm('이 스킬을 승인하시겠습니까?')) return
        setLoading(true)
        const res = await approveSkill(skillId)
        if (res.error) alert(res.error)
        setLoading(false)
    }

    const handleReject = async () => {
        if (!confirm('이 제출물을 거절하고 삭제하시겠습니까?')) return
        setLoading(true)
        const res = await rejectSkill(skillId)
        if (res.error) alert(res.error)
        setLoading(false)
    }

    return (
        <div className={styles.actions}>
            <button
                className={styles.approveBtn}
                disabled={loading}
                onClick={handleApprove}
            >
                <Check size={16} />
                {loading ? '...' : '승인'}
            </button>
            <button
                className={styles.rejectBtn}
                disabled={loading}
                onClick={handleReject}
            >
                <X size={16} />
                {loading ? '...' : '거절'}
            </button>
        </div>
    )
}
