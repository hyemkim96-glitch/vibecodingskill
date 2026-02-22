import PRDForm from '@/components/PRDForm';
import PageHeader from '@/components/PageHeader';

export default function PRDGenPage() {
    return (
        <div>
            <PageHeader
                title="PRD 생성기"
                description="사용자 입력 기반 요구사항 정의서와 디자인 시스템 문서를 자동 생성합니다."
                badge="PREMIUM"
            />
            <PRDForm />
        </div>
    );
}
