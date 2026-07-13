// Fetches Pretendard (the same font used across the rest of the app) as a
// static OTF for use in OG images. Satori (the renderer behind next/og's
// ImageResponse) ships no built-in CJK glyphs, so any Korean text in an OG
// image needs an explicit font buffer or it renders blank.
//
// Not using Noto Sans KR here: testing found that this exact glyph pair (토스)
// rendered with a corrupted underline-like artifact in Satori/resvg at large
// bold sizes, while unrelated Korean text in the same image rendered fine —
// pointing at a glyph-specific issue in that particular font file rather than
// anything in this component's layout. Pretendard did not reproduce it.
const fontCache = new Map<400 | 700, Promise<ArrayBuffer>>();

export async function getKoreanFont(weight: 400 | 700 = 700): Promise<ArrayBuffer> {
  if (!fontCache.has(weight)) {
    const file = weight === 700 ? 'Pretendard-Bold.otf' : 'Pretendard-Regular.otf';
    fontCache.set(
      weight,
      fetch(`https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/${file}`).then((res) => res.arrayBuffer())
    );
  }
  return fontCache.get(weight)!;
}
