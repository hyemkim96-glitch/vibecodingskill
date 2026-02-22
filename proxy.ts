import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

// 반드시 'default' export여야 Next.js 16 빌드 엔진이 인식합니다.
export default async function proxy(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/prd-gen')) {
        return Response.redirect(new URL('/', request.url))
    }
    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}