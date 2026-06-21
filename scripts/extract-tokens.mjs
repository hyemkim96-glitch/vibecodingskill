/**
 * Design MD — Brand Token Extractor
 * 실행: node scripts/extract-tokens.mjs [url] [brand-slug]
 * 예시: node scripts/extract-tokens.mjs https://toss.im toss
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BRANDS = [
  { slug: 'toss',         name: '토스',     nameEn: 'Toss',         url: 'https://toss.im',              mobileUrl: 'https://toss.im' },
  { slug: 'kakao',        name: '카카오',   nameEn: 'Kakao',        url: 'https://www.kakao.com',         mobileUrl: 'https://www.kakao.com' },
  { slug: 'daangn',       name: '당근',     nameEn: 'Daangn',       url: 'https://www.daangn.com',        mobileUrl: 'https://www.daangn.com' },
  { slug: 'musinsa',      name: '무신사',   nameEn: 'Musinsa',      url: 'https://www.musinsa.com',       mobileUrl: 'https://www.musinsa.com' },
  { slug: '29cm',         name: '29CM',     nameEn: '29CM',         url: 'https://29cm.co.kr',            mobileUrl: 'https://29cm.co.kr' },
  { slug: 'baemin',       name: '배달의민족', nameEn: 'Baemin',     url: 'https://www.baemin.com',        mobileUrl: 'https://www.baemin.com' },
  { slug: 'naver',        name: '네이버',   nameEn: 'Naver',        url: 'https://www.naver.com',         mobileUrl: 'https://m.naver.com' },
  { slug: 'kakaobank',    name: '카카오뱅크', nameEn: 'KakaoBank',  url: 'https://www.kakaobank.com',     mobileUrl: 'https://www.kakaobank.com' },
  { slug: 'coupang',      name: '쿠팡',     nameEn: 'Coupang',      url: 'https://www.coupang.com',       mobileUrl: 'https://m.coupang.com' },
  { slug: 'ohouse',       name: '오늘의집', nameEn: 'Ohouse',       url: 'https://ohou.se',               mobileUrl: 'https://ohou.se' },
];

async function extractTokens(page, url, viewport) {
  await page.setViewportSize(viewport);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
  } catch (e) {
    console.warn(`  ⚠️  Load timeout: ${url}`);
  }

  return await page.evaluate(() => {
    const results = {
      cssVariables: {},
      colors: [],
      fonts: [],
      borderRadii: [],
      spacing: [],
    };

    // 1. CSS 변수 추출 (:root)
    const sheets = Array.from(document.styleSheets);
    for (const sheet of sheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          if (rule.selectorText === ':root' || rule.selectorText === 'html') {
            const style = rule.style;
            for (let i = 0; i < style.length; i++) {
              const prop = style[i];
              if (prop.startsWith('--')) {
                results.cssVariables[prop] = style.getPropertyValue(prop).trim();
              }
            }
          }
        }
      } catch (_) { /* cross-origin sheet */ }
    }

    // 2. 실제 사용 중인 컬러 수집 (상위 200개 요소)
    const colorSet = new Set();
    const els = document.querySelectorAll('button, a, h1, h2, h3, p, [class*="btn"], [class*="primary"]');
    const sample = Array.from(els).slice(0, 200);

    for (const el of sample) {
      const cs = getComputedStyle(el);
      [cs.color, cs.backgroundColor, cs.borderColor].forEach(c => {
        if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') {
          colorSet.add(c);
        }
      });
    }

    // rgb → hex 변환
    const toHex = (rgb) => {
      const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return null;
      return '#' + [m[1], m[2], m[3]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    };

    results.colors = [...colorSet].map(toHex).filter(Boolean);

    // 3. 폰트 패밀리 수집
    const fontSet = new Set();
    const textEls = document.querySelectorAll('body, h1, h2, p, button, a');
    Array.from(textEls).slice(0, 50).forEach(el => {
      const ff = getComputedStyle(el).fontFamily;
      if (ff) fontSet.add(ff.split(',')[0].replace(/['"]/g, '').trim());
    });
    results.fonts = [...fontSet].filter(f => f && f !== 'inherit');

    // 4. Border radius 수집
    const radiusSet = new Set();
    const rEls = document.querySelectorAll('button, input, [class*="card"], [class*="btn"], [class*="modal"]');
    Array.from(rEls).slice(0, 50).forEach(el => {
      const br = getComputedStyle(el).borderRadius;
      if (br && br !== '0px') radiusSet.add(br);
    });
    results.borderRadii = [...radiusSet];

    // 5. 배경색 (페이지 + 주요 섹션)
    const bgSet = new Set();
    const bgEls = document.querySelectorAll('body, main, section, header, [class*="hero"], [class*="banner"]');
    Array.from(bgEls).slice(0, 20).forEach(el => {
      const bg = getComputedStyle(el).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)') bgSet.add(bg);
    });
    results.backgrounds = [...bgSet].map(toHex).filter(Boolean);

    return results;
  });
}

async function takeScreenshot(page, slug, platform, outputDir) {
  const path = join(outputDir, `${slug}-${platform}.png`);
  await page.screenshot({ path, fullPage: false });
  return path;
}

function buildMarkdown(brand, mobile, web) {
  const allColors = [...new Set([...(mobile.colors || []), ...(web.colors || [])])];
  const cssVars = { ...mobile.cssVariables, ...web.cssVariables };
  const fonts = [...new Set([...(mobile.fonts || []), ...(web.fonts || [])])];
  const radii = [...new Set([...(mobile.borderRadii || []), ...(web.borderRadii || [])])];

  // CSS 변수 중 컬러 관련만 필터
  const colorVars = Object.entries(cssVars)
    .filter(([k]) => k.match(/color|bg|background|primary|secondary|brand|accent/i))
    .map(([k, v]) => `- \`${k}\`: ${v}`)
    .join('\n') || '(CSS 변수 없음)';

  return `# ${brand.nameEn} (${brand.name}) Design Token
> Updated: ${new Date().toISOString().slice(0, 7)} | Extracted from: ${brand.url}

---

## CSS Variables (from :root)

${colorVars}

---

## Colors (computed, deduplicated)

${allColors.slice(0, 20).map(c => `- \`${c}\``).join('\n') || '없음'}

### Mobile-specific
${(mobile.backgrounds || []).map(c => `- bg: \`${c}\``).join('\n') || '-'}

### Web-specific
${(web.backgrounds || []).map(c => `- bg: \`${c}\``).join('\n') || '-'}

---

## Typography

**Font families:** ${fonts.join(', ') || '추출 실패'}

---

## Shape (Border Radius)

${[...new Set(radii)].slice(0, 8).map(r => `- \`${r}\``).join('\n') || '없음'}

---

## Raw CSS Variables (전체)

\`\`\`
${Object.entries(cssVars).slice(0, 60).map(([k, v]) => `${k}: ${v}`).join('\n') || '없음'}
\`\`\`
`;
}

async function run() {
  const targetSlug = process.argv[2];
  const targets = targetSlug
    ? BRANDS.filter(b => b.slug === targetSlug)
    : BRANDS;

  if (targets.length === 0) {
    console.error(`브랜드를 찾을 수 없어요: ${targetSlug}`);
    console.log('사용 가능:', BRANDS.map(b => b.slug).join(', '));
    process.exit(1);
  }

  const outputDir = join(process.cwd(), 'scripts', 'extracted');
  mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const brand of targets) {
    console.log(`\n🔍 ${brand.nameEn} (${brand.name}) 추출 중...`);

    try {
      // Mobile
      const mobilePage = await browser.newPage();
      console.log(`  📱 Mobile: ${brand.mobileUrl}`);
      const mobileData = await extractTokens(mobilePage, brand.mobileUrl, { width: 390, height: 844 });
      await takeScreenshot(mobilePage, brand.slug, 'mobile', outputDir);
      await mobilePage.close();

      // Web
      const webPage = await browser.newPage();
      console.log(`  🖥️  Web: ${brand.url}`);
      const webData = await extractTokens(webPage, brand.url, { width: 1440, height: 900 });
      await takeScreenshot(webPage, brand.slug, 'web', outputDir);
      await webPage.close();

      // 마크다운 생성
      const md = buildMarkdown(brand, mobileData, webData);
      const mdPath = join(outputDir, `${brand.slug}.md`);
      writeFileSync(mdPath, md, 'utf-8');

      console.log(`  ✅ 완료: ${mdPath}`);
    } catch (e) {
      console.error(`  ❌ 실패: ${e.message}`);
    }
  }

  await browser.close();
  console.log(`\n✅ 완료. 결과물: scripts/extracted/`);
}

run();
