'use client'

import { X, Download, FileText } from 'lucide-react'
import styles from './PRDPreviewModal.module.css'

interface PRDPreviewModalProps {
    prd: {
        content: string;
        metadata: {
            serviceName: string;
        }
    };
    onClose: () => void;
    onDownload: () => void;
}

export default function PRDPreviewModal({ prd, onClose, onDownload }: PRDPreviewModalProps) {
    const handleCopyResult = async () => {
        await navigator.clipboard.writeText(prd.content);
        alert('마크다운 형식이 클립보드에 복사되었습니다.');
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h3>{prd.metadata.serviceName}</h3>
                        <span>PRD Preview</span>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.iconBtn} onClick={onDownload} title="DOCX Download">
                            <Download size={18} />
                        </button>
                        <button className={styles.iconBtn} onClick={handleCopyResult} title="Copy Markdown">
                            <FileText size={18} />
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className={styles.content}>
                    <pre><code>{prd.content}</code></pre>
                </div>
            </div>
        </div>
    )
}
