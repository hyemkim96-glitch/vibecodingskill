import { ImageResponse } from 'next/og';
import { allTokens } from '@/lib/tokens';
import { getKoreanFont } from '@/lib/ogFont';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TITLE = 'Design MD';
const SUBTITLE = 'AI 빌더를 위한 브랜드 디자인 토큰';

export default async function Image() {
  const brandDots = allTokens.map((t) => t.colors[0]?.value ?? '#888888');
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
          background: '#0B0D12',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', gap: 10, marginBottom: 36 }}>
          {brandDots.map((c, i) => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />
          ))}
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, display: 'flex' }}>{TITLE}</div>
        <div style={{ fontSize: 36, fontWeight: 400, color: '#9AA3AF', marginTop: 20, display: 'flex' }}>
          {SUBTITLE}
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
