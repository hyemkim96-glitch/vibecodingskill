import { BrandToken } from '@/types/token';
import { tossToken } from './toss';
import { kakaoToken } from './kakao';
import { daangnToken } from './daangn';
import { musinsaToken } from './musinsa';
import { cm29Token } from './cm29';
import { baeminToken } from './baemin';
import { naverToken } from './naver';
import { kakaobankToken } from './kakaobank';
import { coupangToken } from './coupang';
import { ohouseToken } from './ohouse';

export const allTokens: BrandToken[] = [
  tossToken,
  kakaoToken,
  daangnToken,
  musinsaToken,
  cm29Token,
  baeminToken,
  naverToken,
  kakaobankToken,
  coupangToken,
  ohouseToken,
];

export function getTokenBySlug(slug: string): BrandToken | undefined {
  return allTokens.find((t) => t.slug === slug);
}
