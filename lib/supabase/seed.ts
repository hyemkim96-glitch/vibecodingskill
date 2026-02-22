import { createClient } from './server'

export async function seedMockData() {
    const supabase = await createClient()

    const mockSkills = [
        {
            name: '아이디어 구체화 프롬프트',
            description: '어렴풋한 아이디어를 구체적인 서비스 기능 목록과 화면 설계로 바꿔주는 기획자용 스킬셋입니다.',
            content: '당신은 시니어 서비스 기획자입니다. 다음 아이디어를 바탕으로 [기능 리스트], [사용자 시나리오], [필요 데이터]를 상세히 정의해주세요: [아이디어 입력]',
            tokens: '약 400 ~ 600',
            effect: '기획 시간 70% 단축',
            tags: ['기획', 'Claude', '초기단계'],
            status: 'approved'
        },
        {
            name: '디자인 시스템 토큰 생성기',
            description: '디자인 가이드를 바탕으로 개발자가 바로 쓸 수 있는 CSS 변수와 테일윈드 설정을 생성합니다.',
            content: '선택된 컬러 팔레트(#FFFFFF, #191919...)를 기반으로 웹 접근성을 준수하는 디자인 시스템 토큰을 JSON 포맷으로 추출해줘.',
            tokens: '약 300 ~ 500',
            effect: '개발 협업 효율 증가',
            tags: ['디자인', 'CSS', 'Figma'],
            status: 'approved'
        },
        {
            name: '마케팅 카피 베리에이션',
            description: '하나의 슬로건을 SNS, 이메일, 광고 배너 등 플랫폼별 특성에 맞게 10가지 버전으로 변형합니다.',
            content: '다음 제품 설명을 바탕으로 [감성형], [직설형], [혜택강조형] 세 가지 톤앤매너로 마케팅 카피를 5개씩 작성해줘.',
            tokens: '약 500 ~ 800',
            effect: '콘텐츠 제작 속도 향상',
            tags: ['마케팅', '카피라이팅', 'SNS'],
            status: 'approved'
        },
    ]

    const { error } = await supabase.from('skills').insert(mockSkills)

    if (error) {
        console.error('Error seeding data:', error)
        return { success: false, error }
    }

    return { success: true }
}
