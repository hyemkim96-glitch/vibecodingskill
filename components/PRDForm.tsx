'use client';

import { useState } from 'react';
import { Sparkles, FileText, Download } from 'lucide-react';
import { savePRD } from '@/app/actions/prd-actions';
import styles from './PRDForm.module.css';

export default function PRDForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        serviceName: '',
        targetUser: '',
        keyFeatures: '',
        designSystem: 'Minimal B&W',
        techStack: 'Next.js + Supabase',
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPRD, setGeneratedPRD] = useState<string | null>(null);

    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setStatus(null);

        // Simulate AI delay
        setTimeout(async () => {
            const content = `
# PRD: ${formData.serviceName}

## 1. 서비스 개요
본 서비스는 ${formData.targetUser}를 대상으로 하며, 주요 목표는 사용자의 핵심 니즈를 해결하는 것입니다.

## 2. 주요 기능
${formData.keyFeatures.split('\n').map(f => `- ${f}`).join('\n')}

## 3. 기술 스택 및 디자인 시스템
- **Framework**: ${formData.techStack}
- **Design System**: ${formData.designSystem}
- **Rules**: Minimalist, Zero Radius, B&W Focus.

## 4. 사용자 여정 (User Journey)
1. 메인 페이지 접속 -> 2. 기능 탐색 -> 3. 핵심 액션 수행 -> 4. 결과 확인
      `;

            setGeneratedPRD(content);

            // Save to database
            const res = await savePRD(content, formData);
            if (res.error) {
                setStatus({ type: 'error', message: res.error });
            } else {
                setStatus({ type: 'success', message: 'PRD가 내 보관함에 안전하게 저장되었습니다.' });
            }

            setIsGenerating(false);
            setStep(3);
        }, 2000);
    };

    const handleCopyResult = async () => {
        if (generatedPRD) {
            await navigator.clipboard.writeText(generatedPRD);
            alert('마크다운 형식이 클립보드에 복사되었습니다.');
        }
    };

    const handleDownloadResult = async () => {
        if (generatedPRD) {
            const { exportToDocx } = await import('@/lib/utils/export');
            await exportToDocx(formData.serviceName, generatedPRD);
        }
    };

    return (
        <div className={styles.container}>
            {step === 1 && (
                <div className={styles.step}>
                    <h3 className={styles.stepTitle}>Step 1. 기본 정보 입력</h3>
                    <div className={styles.field}>
                        <label>서비스 이름</label>
                        <input name="serviceName" value={formData.serviceName} onChange={handleInputChange} placeholder="예: 바이브 코딩" />
                    </div>
                    <div className={styles.field}>
                        <label>타겟 사용자</label>
                        <input name="targetUser" value={formData.targetUser} onChange={handleInputChange} placeholder="예: 비개발자 디자이너" />
                    </div>
                    <button className={styles.nextBtn} onClick={() => setStep(2)} disabled={!formData.serviceName}>다음 단계</button>
                </div>
            )}

            {step === 2 && (
                <div className={styles.step}>
                    <h3 className={styles.stepTitle}>Step 2. 상세 요구사항</h3>
                    <div className={styles.field}>
                        <label>핵심 기능 (줄바꿈으로 구분)</label>
                        <textarea name="keyFeatures" value={formData.keyFeatures} onChange={handleInputChange} rows={5} placeholder="예: 스킬셋 복사기&#10;PRD 자동 생성&#10;도네이션 기능" />
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.field}>
                            <label>디자인 시스템</label>
                            <select name="designSystem" value={formData.designSystem} onChange={handleInputChange}>
                                <option>Minimal B&W</option>
                                <option>Modern Clean</option>
                                <option>High Contrast</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>선호 기술 스택</label>
                            <input name="techStack" value={formData.techStack} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.backBtn} onClick={() => setStep(1)}>이전</button>
                        <button className={styles.generateBtn} onClick={handleGenerate} disabled={isGenerating || !formData.keyFeatures}>
                            {isGenerating ? '생성 중...' : 'PRD 생성하기'}
                            <Sparkles size={16} />
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && generatedPRD && (
                <div className={styles.result}>
                    <div className={styles.resultHeader}>
                        <h3>생성된 PRD 초안</h3>
                        <div className={styles.resultActions}>
                            <button
                                className={styles.iconBtn}
                                title="Download DOCX"
                                onClick={handleDownloadResult}
                            >
                                <Download size={18} />
                            </button>
                            <button
                                className={styles.iconBtn}
                                title="Copy Markdown"
                                onClick={handleCopyResult}
                            >
                                <FileText size={18} />
                            </button>
                        </div>
                    </div>

                    {status && (
                        <div className={`${styles.statusMsg} ${status.type === 'error' ? styles.error : styles.success}`}>
                            {status.message}
                        </div>
                    )}

                    <pre className={styles.prdOutput}>
                        <code>{generatedPRD}</code>
                    </pre>
                    <button className={styles.resetBtn} onClick={() => { setStep(1); setGeneratedPRD(null); }}>새로 만들기</button>
                </div>
            )}
        </div>
    );
}
