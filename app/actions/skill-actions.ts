'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitSkill(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Authentication required' }
    }

    const name = formData.get('name') as string
    const descriptionRaw = formData.get('description') as string
    const stack = formData.get('stack') as string
    const effect = formData.get('effect') as string
    const tokens = formData.get('tokens') as string
    const content = formData.get('content') as string
    const tagsStr = formData.get('tags') as string
    const tags = tagsStr ? tagsStr.split(',').map(tag => tag.trim()) : []

    const description = stack ? `[기술 스택: ${stack}] ${descriptionRaw}` : descriptionRaw

    if (!name || !content) {
        return { error: 'Title and Content are required' }
    }

    const { error } = await supabase.from('skills').insert({
        name,
        description,
        effect,
        tokens,
        content,
        tags,
        author_id: user.id,
        status: 'pending'
    })

    if (error) {
        console.error('Error submitting skill:', error)
        return { error: 'Failed to submit skill. Please try again.' }
    }

    revalidatePath('/')
    return { success: true }
}

export async function approveSkill(skillId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { error: 'Forbidden' }

    const { error } = await supabase
        .from('skills')
        .update({ status: 'approved' })
        .eq('id', skillId)

    if (error) return { error: 'Update failed' }

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
}

export async function rejectSkill(skillId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { error: 'Forbidden' }

    const { error } = await supabase
        .from('skills')
        .delete() // Rejecting deletes the submission
        .eq('id', skillId)

    if (error) return { error: 'Deletion failed' }

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
}

export async function seedDefaultSkills() {
    const supabase = await createClient()

    const defaultSkills = [
        {
            name: 'Next.js + Supabase Authentication',
            description: '가장 깔끔하고 보안이 강화된 최신 인증 로직 스택입니다.',
            content: '1. Supabase Auth Helpers 설치\n2. middleware.ts 세션 관리 설정\n3. Login/Register 전용 페이지 구현\n4. 서버 컴포넌트 유저 상태 동기화 루틴 추가',
            tags: ['Auth', 'Security', 'Next.js'],
            status: 'approved'
        },
        {
            name: 'Tailwind CSS Dark Mode Toggle',
            description: '다크모드 전환 및 시스템 테마 연동 시스템입니다.',
            content: '1. tailwind.config.ts 에 darkMode: "class" 추가\n2. ThemeProvider 컨텍스트 생성\n3. 로컬 스토리지 테마 캐싱\n4. 원클릭 토글 버튼 컴포넌트',
            tags: ['UI', 'CSS', 'UX'],
            status: 'approved'
        },
        {
            name: 'Markdown Editor with Preview',
            description: '마크다운을 입력하고 실시간으로 렌더링된 결과를 확인합니다.',
            content: '1. react-markdown 라이브러리 연동\n2. 입력 textarea와 출력 div의 양방향 바인딩\n3. 코드 하이라이팅(Prism.js) 추가\n4. 이미지 업로드/삽입 핸들러',
            tags: ['Editor', 'Markdown', 'Feature'],
            status: 'approved'
        },
        {
            name: 'OpenAI API Integration Utility',
            description: '안정적인 API 호출 및 에러 핸들링 유틸리티입니다.',
            content: '1. OpenAI Node SDK 구성\n2. 스트리밍 응답 헬퍼 함수\n3. 토큰 제한 및 타임아웃 방어로직\n4. 캐싱 레이어(Redis/Memory) 연동 예시',
            tags: ['AI', 'Backend', 'API'],
            status: 'approved'
        },
        {
            name: 'SEO Meta Tag Component',
            description: '동적 메타 태그 시스템으로 검색 최적화를 자동화합니다.',
            content: '1. 공용 MetaHead 컴포넌트 작성\n2. OpenGraph/Twitter 카드 명세 처리\n3. JSON-LD 구조화 데이터 삽입\n4. Canonical URL 자동 생성기',
            tags: ['SEO', 'Marketing', 'Next.js'],
            status: 'approved'
        }
    ]

    try {
        for (const skill of defaultSkills) {
            // Simple check to avoid duplicates by name
            const { data: existing } = await supabase.from('skills').select('id').eq('name', skill.name).maybeSingle()
            if (!existing) {
                await supabase.from('skills').insert(skill)
            }
        }

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Seeding error:', error)
        return { success: false, error: 'Database error' }
    }
}
