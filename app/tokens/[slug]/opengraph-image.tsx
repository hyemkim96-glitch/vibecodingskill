import { ImageResponse } from 'next/og';
import { getTokenBySlug, allTokens } from '@/lib/tokens';
import { getKoreanFont } from '@/lib/ogFont';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return allTokens.map((t) => ({ slug: t.slug }));
}

function getContrastText(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#111111' : '#ffffff';
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = getTokenBySlug(slug);
  const name = token?.nameKo ?? token?.name ?? 'Design MD';
  const tagline = token?.tagline ?? 'AI 빌더를 위한 브랜드 디자인 토큰';
  const category = token?.category ?? '';
  const primary = token?.colors[0]?.value ?? '#246CF8';
  const onPrimary = getContrastText(primary);

  const fontData = await getKoreanFont(700);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          background: primary,
          color: onPrimary,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 2,
            opacity: 0.7,
            marginBottom: 24,
            display: 'flex',
          }}
        >
          DESIGN MD · {category}
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.2, display: 'flex' }}>{name}</div>
        <div style={{ fontSize: 40, fontWeight: 400, opacity: 0.85, marginTop: 20, display: 'flex' }}>
          {tagline}
        </div>
        <div style={{ fontSize: 28, fontWeight: 400, opacity: 0.6, marginTop: 48, display: 'flex' }}>
          디자인 토큰 · CSS · Tailwind · Figma · Design.md
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Pretendard', data: fontData, style: 'normal', weight: 700 },
      ],
    }
  );
}
