import Link from 'next/link';
import { allTokens } from '@/lib/tokens';
import styles from './Landing.module.css';

/* ── helpers ── */
function getPrimary(colors: typeof allTokens[0]['colors']) {
  return colors.find(c => /^primary$/i.test(c.role))?.value ?? colors[0]?.value ?? '#888888';
}

function getContrastText(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#111111' : '#ffffff';
}


const CAT_KO: Record<string, string> = {
  '핀테크/금융': 'FINTECH',
  '플랫폼':     'PLATFORM',
  '커머스':     'COMMERCE',
  '개발자 도구': 'DEVTOOLS',
  '디자인 강자': 'DESIGN',
};

const LAYERS = [
  {
    tier: '01',
    name: 'Palette',
    nameKo: '원시 팔레트',
    desc: 'OKLCH 기반 지각 균등 색상 원시값. 뉴트럴 13단계 + 상태 5종. 어떤 브랜드 컬러도 이 표에서 파생돼요.',
    code: 'neutral[900].hex',
  },
  {
    tier: '02',
    name: 'Semantic',
    nameKo: '시멘틱 토큰',
    desc: '배경·채움·텍스트·테두리 역할로 추상화. 라이트/다크 각각 독립 정의. CSS 변수로 직접 참조해요.',
    code: '--color-fill-normal',
  },
  {
    tier: '03',
    name: 'Role',
    nameKo: '롤 토큰',
    desc: '컴포넌트 슬롯 단위 토큰. 버튼 배경, 카드 보더 등 구체적 역할. 브랜드 오버라이드 진입점이에요.',
    code: '--comp-button-primary-bg',
  },
  {
    tier: '04',
    name: 'Variant',
    nameKo: '변형 토큰',
    desc: 'hover·pressed·disabled 인터랙션 상태 파생 토큰. 각 슬롯마다 자동 계산되어 모션과 연결돼요.',
    code: '--comp-button-primary-bg-hover',
  },
];

const FEATURES = [
  {
    icon: '◈',
    tag: 'Color Science',
    title: 'OKLCH 기반\n지각 균등 팔레트',
    desc: 'sRGB 도구의 한계를 넘어 사람 눈이 인식하는 밝기를 수학적으로 균등하게 분배해요. 어두운 배경에서도 대비가 정확히 유지되고, WCAG AA는 빌드 타임에 검증해요.',
  },
  {
    icon: '⧉',
    tag: '4-Layer Token',
    title: '4계층 토큰\n캐스케이드',
    desc: 'Palette → Semantic → Role → Variant. 프로덕션 DS 아키텍처와 동일한 구조예요. 각 계층이 바로 위 계층만 참조하니, AI도 변경 범위를 예측할 수 있어요.',
  },
  {
    icon: '▦',
    tag: 'Live Preview',
    title: '실시간\n컴포넌트 미리보기',
    desc: '버튼, 카드, 입력, 배지, 네비게이션, 스테퍼, 패턴까지. 모든 컴포넌트가 브랜드 토큰에 반응해 즉시 그려져요. 다크 모드도 자동으로 지원해요.',
  },
  {
    icon: '◷',
    tag: 'AI-Ready Export',
    title: '5가지 포맷\n즉시 내보내기',
    desc: 'CSS 변수, Tailwind Config, 디자인 토큰 JSON, Figma 변수, Design.md. AI 코딩 도구에 한 번만 붙여넣으면 브랜드 정체성이 코드 전반에 자동으로 적용돼요.',
  },
];

const CODE_SNIPPET = `# Toss Design System — AI Context (Design.md)

## 브랜드 색상
Primary:       #246CF8   CTA 버튼, 링크, 활성 탭
On-Primary:    #FFFFFF   Primary 위 텍스트·아이콘
Primary-Tint:  #EBF3FE   배지 배경, 선택 상태
Surface:       #FFFFFF   카드, 모달, 바텀시트
Text Main:     #191F28   본문, 제목
Text Sub:      #4E5968   메타 정보, 보조 레이블

## 토큰 계층 (4-tier cascade)
neutral[900] → --color-fill-normal
             → --comp-button-primary-bg
             → --comp-button-primary-bg-hover (+10% L)

## 타이포그래피
Font:   Pretendard Variable
Body:   16px / 1.6 / weight 400
Label:  14px / 1.4 / weight 500 / ls -0.01em
CTA:    16px / 1   / weight 600 / ls -0.01em`;

export default function LandingPage() {
  const brands = allTokens.map(t => ({
    slug:     t.slug,
    name:     t.tagline,
    primary:  getPrimary(t.colors),
    category: t.category,
  }));

  const marqueeItems = [...brands, ...brands];

  return (
    <div>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className={styles.hero}>
        <span className={styles.heroEyebrow}>
          <span className={styles.heroEyebrowDot} />
          Brand Design Token Engine &nbsp;·&nbsp; AI-Ready
        </span>

        <h1 className={styles.heroHeadline}>
          AI 빌더를 위한<br />
          <span className={styles.heroHeadlineAccent}>브랜드 토큰</span> 엔진
        </h1>

        <p className={styles.heroDesc}>
          한국 주요 서비스 9개의 디자인 시스템을 OKLCH 4계층 토큰으로 바로 꺼내 써요.
          Design.md 한 장이면 AI가 프로덕션 수준 UI를 완성해요.
        </p>

        <div className={styles.heroCtas}>
          <Link href="/tokens" className={styles.ctaPrimary}>
            브랜드 탐색하기 →
          </Link>
          <Link href="/foundation" className={styles.ctaSecondary}>
            파운데이션 구조 보기
          </Link>
        </div>

        {/* ── brand color marquee ── */}
        <div className={styles.marqueeWrap}>
          <div className={styles.marqueeTrack}>
            {marqueeItems.map((b, i) => (
              <Link
                key={`${b.slug}-${i}`}
                href={`/tokens/${b.slug}`}
                className={styles.marqueeChip}
              >
                <span className={styles.marqueeChipDot} style={{ background: b.primary }} />
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-12)',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <p className={styles.sectionEyebrow}>By the numbers</p>
            <h2 className={styles.sectionTitle}>
              하나의 엔진으로<br />모든 브랜드를 구현해요
            </h2>
            <p className={styles.sectionDesc}>
              브랜드마다 디자인 시스템을 직접 만들 필요 없어요.
              이미 검증된 9개 서비스의 토큰을 그대로 활용해보세요.
              Figma 없이도 AI가 브랜드를 온전히 이해해요.
            </p>
          </div>
          <div className={styles.statsRow}>
            {[
              { num: '9',    label: '브랜드 지원' },
              { num: '4',    label: '계층 토큰' },
              { num: '5',    label: '내보내기 포맷' },
              { num: '100+', label: '컴포넌트 변형' },
            ].map(s => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BRAND GRID
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <p className={styles.sectionEyebrow}>Supported brands</p>
        <h2 className={styles.sectionTitle} style={{ marginBottom: 'var(--spacing-8)' }}>
          9개 브랜드 디자인 시스템을 담았어요
        </h2>
        <div className={styles.brandGrid}>
          {brands.map(b => {
            const onPrimary = getContrastText(b.primary);
            return (
              <Link key={b.slug} href={`/tokens/${b.slug}`} className={styles.brandCard}>
                <div className={styles.brandCardSwatch} style={{ background: b.primary }}>
                  <span className={styles.brandCardSwatchHex} style={{ color: onPrimary }}>
                    {b.primary.toUpperCase()}
                  </span>
                </div>
                <div className={styles.brandCardBody}>
                  <span className={styles.brandCardName}>{b.name}</span>
                  <span className={styles.brandCardCat}>{CAT_KO[b.category] ?? b.category}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <p className={styles.sectionEyebrow}>How it works</p>
        <h2 className={styles.sectionTitle} style={{ marginBottom: 'var(--spacing-8)' }}>
          세 단계로 완성해요
        </h2>
        <div className={styles.stepsGrid}>

          <div className={styles.step}>
            <div className={styles.stepNum}>
              <span className={styles.stepNumBadge}>1</span>
              브랜드 선택
            </div>
            <div className={styles.stepTitle}>원하는 브랜드의<br />토큰 페이지 입장</div>
            <p className={styles.stepDesc}>
              깔끔한 금융, 일상의 연결, 동네 생활권 등 9개 브랜드 중 레퍼런스로 삼을 서비스를 골라요.
              각 브랜드의 실제 컬러·타이포·스페이싱이 토큰으로 정리되어 있어요.
            </p>
            <div className={styles.stepPreview}>
              {brands.slice(0, 5).map(b => (
                <div key={b.slug} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: b.primary, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-normal)', fontFamily: 'var(--font-ui)' }}>{b.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>
              <span className={styles.stepNumBadge}>2</span>
              토큰 미리보기
            </div>
            <div className={styles.stepTitle}>색상·타이포·컴포넌트를<br />실시간 확인</div>
            <p className={styles.stepDesc}>
              OKLCH 팔레트, 시멘틱 롤 색상, 타이포그래피 스케일, 스페이싱, 컴포넌트 미리보기를
              한 페이지에서 확인해요. 다크 모드도 바로 전환돼요.
            </p>
            <div className={styles.stepPreview}>
              {([
                { label: 'Primary BG', var: 'var(--color-fill-normal)' },
                { label: 'Text Main',  var: 'var(--color-text-normal)' },
                { label: 'Surface',    var: 'var(--color-bg-elevated)' },
                { label: 'Border',     var: 'var(--color-border-normal)' },
              ]).map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 4, background: row.var, border: '1px solid var(--color-border-normal)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-normal)', fontFamily: 'var(--font-ui)', flex: 1 }}>{row.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNum}>
              <span className={styles.stepNumBadge}>3</span>
              내보내기 & 활용
            </div>
            <div className={styles.stepTitle}>AI에 붙여넣거나<br />코드에 바로 적용</div>
            <p className={styles.stepDesc}>
              CSS 변수, Tailwind, JSON, Figma 변수, Design.md 중 원하는 포맷으로 한 번에 내보내요.
              AI 코딩 도구에 Design.md를 붙여넣으면 끝이에요.
            </p>
            <div className={styles.stepPreview}>
              {['CSS 변수', 'Tailwind Config', '디자인 토큰 JSON', 'Figma 변수', 'Design.md'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-text-assistive)', fontFamily: 'var(--font-code)' }}>›</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-normal)', fontFamily: 'var(--font-ui)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TOKEN ARCHITECTURE
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: 'var(--spacing-12)',
          alignItems: 'start',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', position: 'sticky', top: 'calc(var(--nav-height) + var(--spacing-8))' }}>
            <p className={styles.sectionEyebrow}>Token Architecture</p>
            <h2 className={styles.sectionTitle}>
              4계층 토큰<br />캐스케이드로 설계했어요
            </h2>
            <p className={styles.sectionDesc}>
              모든 값은 반드시 바로 위 계층에서만 참조해요.
              AI가 이 구조를 이해하면 브랜드 일관성이 코드 전반에 자동으로 퍼져요.
            </p>
          </div>
          <div className={styles.cascadeWrap}>
            {LAYERS.map((layer, i) => (
              <div key={layer.tier}>
                <div className={styles.cascadeLayer}>
                  <div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-code)', color: 'var(--color-text-assistive)', letterSpacing: '0.08em', marginBottom: 3 }}>
                      Tier {layer.tier}
                    </div>
                    <div className={styles.cascadeLayerName}>{layer.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-assistive)', fontFamily: 'var(--font-ui)', marginTop: 2 }}>{layer.nameKo}</div>
                  </div>
                  <div className={styles.cascadeLayerDesc}>{layer.desc}</div>
                  <code className={styles.cascadeCode}>{layer.code}</code>
                </div>
                {i < LAYERS.length - 1 && (
                  <div className={styles.cascadeArrow}>↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <p className={styles.sectionEyebrow}>Core features</p>
        <h2 className={styles.sectionTitle} style={{ marginBottom: 'var(--spacing-8)' }}>
          왜 Design MD인가요
        </h2>
        <div className={styles.featureGrid}>
          {FEATURES.map(f => (
            <div key={f.tag} className={styles.featureCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <span className={styles.featureTag}>{f.tag}</span>
              </div>
              <div className={styles.featureTitle} style={{ whiteSpace: 'pre-line' }}>{f.title}</div>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CODE PREVIEW
      ══════════════════════════════════════ */}
      <section className={styles.section}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 'var(--spacing-12)',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <p className={styles.sectionEyebrow}>AI-Ready Format</p>
            <h2 className={styles.sectionTitle}>
              Design.md —<br />AI 브랜드 컨텍스트예요
            </h2>
            <p className={styles.sectionDesc}>
              구조화된 마크다운이라 AI가 색상·타이포·컴포넌트 롤을 다 이해해요.
              Claude, GPT, Cursor 어디든 붙여넣기 한 장이면 브랜드 UI가 완성돼요.
            </p>
            <Link href="/tokens/toss" className={styles.ctaSecondary} style={{ alignSelf: 'flex-start', marginTop: 'var(--spacing-2)' }}>
              토스 토큰 보기 →
            </Link>
          </div>
          <div className={styles.codePreview}>
            <div className={styles.codePreviewBar}>
              <span className={styles.codePreviewDot} style={{ background: 'var(--color-fill-danger)' }} />
              <span className={styles.codePreviewDot} style={{ background: 'var(--color-fill-warning)' }} />
              <span className={styles.codePreviewDot} style={{ background: 'var(--color-fill-success)' }} />
              <span className={styles.codePreviewFile}>toss-DESIGN.md</span>
            </div>
            <pre className={styles.codePre}>{CODE_SNIPPET}</pre>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className={styles.ctaSection}>
        <p className={styles.sectionEyebrow}>Get started · Free</p>
        <h2 className={styles.ctaSectionTitle}>
          지금 바로 탐색해보세요
        </h2>
        <p className={styles.ctaSectionDesc}>
          9개 브랜드 × 5가지 포맷 × 4계층 토큰 — 무료로 사용할 수 있어요.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/tokens" className={styles.ctaPrimary}>
            브랜드 탐색 시작하기 →
          </Link>
          <Link href="/components" className={styles.ctaSecondary}>
            컴포넌트 미리보기
          </Link>
        </div>
      </section>

    </div>
  );
}
