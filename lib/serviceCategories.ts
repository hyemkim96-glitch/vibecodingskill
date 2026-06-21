import { BrandToken } from '@/types/token';
import { allTokens } from '@/lib/tokens';

/**
 * Service-type categories — the organizing axis for the Components and
 * Patterns pages. Components/patterns are classified by the kind of service
 * they belong to (messaging, delivery, search, …) — not by brand style —
 * and rendered as wireframes.
 *
 * getServiceType() is the single source of truth for which pattern a token
 * gets (e.g. KakaoTalk = messaging → chat UI, not delivery UI).
 */

export type ServiceType =
  | 'finance'
  | 'messaging'
  | 'delivery'
  | 'search'
  | 'commerce'
  | 'local';

export function getServiceType(t: BrandToken): ServiceType {
  const s = (t.serviceTypes ?? []).join(' ');
  if (/지역|중고|커뮤니티|동네/.test(s)) return 'local';
  if (/메신저|소셜|채팅/.test(s)) return 'messaging';
  if (/배달|푸드|음식/.test(s)) return 'delivery';
  if (/포털|검색|뉴스/.test(s)) return 'search';
  if (t.category === '핀테크/금융' || /핀테크|뱅킹|은행|금융/.test(s))
    return 'finance';
  return 'commerce';
}

export interface ServiceCategory {
  key: ServiceType;
  label: string;
  description: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: 'finance',
    label: '핀테크 / 금융',
    description:
      '잔액·자산을 큰 숫자로 강조하고, 송금·결제 같은 단일 핵심 액션을 명확히 제시',
  },
  {
    key: 'messaging',
    label: '메신저 / 소셜',
    description: '대화 목록·말풍선·입력바 중심의 실시간 커뮤니케이션',
  },
  {
    key: 'delivery',
    label: '배달 / O2O',
    description: '검색·카테고리 필터 후 가게 카드와 주문 CTA로 연결',
  },
  {
    key: 'search',
    label: '검색 / 포털',
    description: '검색바와 콘텐츠 피드·바로가기 그리드로 정보를 탐색',
  },
  {
    key: 'commerce',
    label: '커머스',
    description: '상품 그리드·가격·할인 배지·장바구니 CTA로 구매 전환을 유도',
  },
  {
    key: 'local',
    label: '지역 / 커뮤니티',
    description: '동네 기반 거래·게시글 리스트와 상태 배지(판매중·구매중)',
  },
];

export interface CategoryGroup {
  category: ServiceCategory;
  tokens: BrandToken[];
  representative: BrandToken;
}

export function getCategoryGroups(): CategoryGroup[] {
  return SERVICE_CATEGORIES.map((category) => {
    const tokens = allTokens.filter((t) => getServiceType(t) === category.key);
    return { category, tokens, representative: tokens[0] };
  }).filter((g) => !!g.representative);
}
