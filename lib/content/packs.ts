import { BrandToken } from '@/types/token';

/**
 * Brand content packs — the domain copy & data that makes each template read as
 * a *different product*, not a recolor of the same screens. Patterns pull strings
 * from here instead of hardcoded literals.
 *
 * A pack is chosen by domain, derived from the brand's serviceTypes → category.
 * Copy is brand-true (food delivery shows menus & delivery status; fintech shows
 * balances & transactions; portal shows news & rankings, …).
 */

export interface PackItem {
  name: string;
  price?: string;
  meta?: string;
  badge?: string;
}

export interface PackRow {
  title: string;
  sub?: string;
  meta?: string;
}

export type SignatureKind =
  | 'status'    // StatusTracker — stepped progress
  | 'balance'   // BalanceCard — big-number finance
  | 'gauge'     // GaugeMeter — score / temperature
  | 'ranking'   // RankingList — ranked list w/ delta
  | 'collect'   // SaveCollect — scrap heart + product tag
  | 'editorial' // EditorialCard — full-bleed editorial
  | 'chat';     // ChatList — message bubbles

export interface ContentPack {
  domain: string;
  heroTitle: string;
  heroSub: string;
  chips: string[];
  items: PackItem[];
  listRows: PackRow[];
  detailTitle: string;
  detailMeta: string[];
  statusSteps: string[];
  snippets: string[];
  signature: SignatureKind;
  /** big value + label for BalanceCard / gauge-style signatures */
  metric?: { label: string; value: string; delta?: string };
}

/* ── domain packs ── */

const food: ContentPack = {
  domain: 'food',
  heroTitle: '지금 가장 빠른 한 끼',
  heroSub: '30분 내 도착 · 무료배달',
  chips: ['치킨', '분식', '한식', '카페·디저트', '야식'],
  items: [
    { name: '바삭 후라이드', price: '18,000', meta: '⭐ 4.8 · 1.2km', badge: '무료배달' },
    { name: '엽기 떡볶이',   price: '14,500', meta: '⭐ 4.7 · 0.8km', badge: '쿠폰' },
    { name: '마라 로제 파스타', price: '13,900', meta: '⭐ 4.6 · 1.5km' },
    { name: '수제 햄버거 세트', price: '11,000', meta: '⭐ 4.9 · 0.5km', badge: 'NEW' },
  ],
  listRows: [
    { title: 'BBQ 황금올리브',  sub: '2개 · 24,000원', meta: '배달완료' },
    { title: '김밥천국 분식세트', sub: '1개 · 8,500원',  meta: '배달완료' },
    { title: '스타벅스 딜리버리', sub: '3개 · 16,200원', meta: '취소' },
  ],
  detailTitle: '바삭 후라이드 세트',
  detailMeta: ['⭐ 4.8 (2,340)', '배달 25~35분', '최소주문 14,000원', '배달비 무료'],
  statusSteps: ['주문접수', '조리중', '배달중', '배달완료'],
  snippets: ['치킨이 달려오는 중! 🍗', '배달완료! 맛있게 드세요 😋', '리뷰 남기고 3,000원 받기'],
  signature: 'status',
  metric: { label: '이번 달 주문', value: '8건', delta: '+3건' },
};

const finance: ContentPack = {
  domain: 'finance',
  heroTitle: '내 자산 한눈에',
  heroSub: '이번 달 +2.4% 늘었어요',
  chips: ['전체', '입출금', '카드', '투자', '대출'],
  items: [
    { name: '입출금 통장',   price: '연 2.0%',    meta: '매일 이자 받기', badge: 'NEW' },
    { name: '비상금 대출',   price: '최대 300만원', meta: '1분 신청' },
    { name: '주식 모으기',   price: '+12.4%',     meta: '소수점 투자', badge: 'HOT' },
    { name: '체크카드',     price: '캐시백 1%',   meta: '실적 조건 없음' },
  ],
  listRows: [
    { title: '스타벅스 강남점', sub: '오늘 09:24',  meta: '-5,800' },
    { title: '월급',          sub: '어제',        meta: '+3,200,000' },
    { title: '넷플릭스',       sub: '3월 21일',    meta: '-17,000' },
    { title: 'GS25 편의점',    sub: '3월 20일',    meta: '-4,200' },
  ],
  detailTitle: '입출금 통장',
  detailMeta: ['연 2.0% · 매일이자', '수수료 평생 무료', '이체 한도 5,000만원'],
  statusSteps: ['송금요청', '보안인증', '이체중', '완료'],
  snippets: ['송금이 완료되었어요', '이번 주 12,400원 아꼈어요', '자동 저장되었습니다'],
  signature: 'balance',
  metric: { label: '총 자산', value: '12,480,200원', delta: '+2.4%' },
};

const fashion: ContentPack = {
  domain: 'fashion',
  heroTitle: '이번 주 신상 룩',
  heroSub: '에디터가 고른 코디 제안',
  chips: ['전체', '아우터', '상의', '하의', '슈즈', '액세서리'],
  items: [
    { name: '오버핏 울 코트',   price: '129,000', meta: '블랙 · M/L',     badge: '29% 쿠폰' },
    { name: '데님 와이드 팬츠', price: '59,000',  meta: '인디고 · 28~34' },
    { name: '캐시미어 니트',    price: '89,000',  meta: '오트밀 · 프리',  badge: 'BEST' },
    { name: '레더 첼시 부츠',   price: '149,000', meta: '브라운 · 250~280' },
  ],
  listRows: [
    { title: '오버핏 울 코트', sub: '3월 20일 주문', meta: '배송중' },
    { title: '데님 팬츠',     sub: '3월 12일 주문', meta: '배송완료' },
    { title: '캐시미어 니트',  sub: '3월 2일 주문',  meta: '교환완료' },
  ],
  detailTitle: '오버핏 울 블렌드 코트',
  detailMeta: ['브랜드 스탠다드', '소재 울 70%', '핏 오버핏', '색상 3종'],
  statusSteps: ['주문완료', '상품준비', '배송중', '배송완료'],
  snippets: ['장바구니에 담았어요', '이 브랜드 신상 알림 받기', '오늘의 코디 추천'],
  signature: 'editorial',
  metric: { label: '이번 달 구매', value: '2건', delta: '189,000원' },
};

const interior: ContentPack = {
  domain: 'interior',
  heroTitle: '오늘의 집들이',
  heroSub: '10평 신혼집 미니멀 인테리어',
  chips: ['거실', '침실', '주방', '욕실', '홈오피스'],
  items: [
    { name: '우드 4단 선반', price: '89,000', meta: '스크랩 1,204', badge: '베스트' },
    { name: '린넨 커튼',    price: '34,000', meta: '스크랩 892' },
    { name: '라탄 조명',    price: '52,000', meta: '스크랩 1,510', badge: 'HOT' },
    { name: '우드 협탁',    price: '46,000', meta: '스크랩 645' },
  ],
  listRows: [
    { title: '따뜻한 우드톤 거실', sub: '@minimal_home', meta: '❤ 2.4k' },
    { title: '북유럽 침실 꾸미기', sub: '@cozy.room',    meta: '❤ 1.8k' },
    { title: '주방 정리 노하우',   sub: '@daily_kitchen', meta: '❤ 980' },
  ],
  detailTitle: '내추럴 우드 4단 선반',
  detailMeta: ['이 사진에 8개 상품', '평점 4.9 (320)', '무료배송', '단독 판매'],
  statusSteps: ['주문완료', '상품준비', '배송중', '배송완료'],
  snippets: ['스크랩 완료!', '이런 공간 어때요?', '이 제품이 사용됐어요'],
  signature: 'collect',
  metric: { label: '이번 달 구매', value: '3건', delta: '171,000원' },
};

const portal: ContentPack = {
  domain: 'portal',
  heroTitle: '지금 이 시각 뉴스',
  heroSub: '3분 전 업데이트',
  chips: ['뉴스', '연예', '스포츠', '경제', 'IT'],
  items: [
    { name: '금리 동결 결정… 시장 반응은', meta: '연합뉴스 · 12분 전' },
    { name: 'AI 반도체 수출 사상 최대',   meta: '한국경제 · 28분 전', badge: 'HOT' },
    { name: '주말 전국 비 소식',          meta: '기상청 · 41분 전' },
    { name: '프로야구 개막전 매진',        meta: '스포츠서울 · 1시간 전' },
  ],
  listRows: [
    { title: '금리 동결 결정',     sub: '실시간 1위', meta: '▲' },
    { title: 'AI 반도체 수출',     sub: '실시간 2위', meta: '▲' },
    { title: '주말 날씨',         sub: '실시간 3위', meta: '▬' },
    { title: '프로야구 개막',      sub: '실시간 4위', meta: '▼' },
  ],
  detailTitle: '금리 동결 결정… 시장 반응은',
  detailMeta: ['연합뉴스', '2026.06.23 09:12', '댓글 1,240'],
  statusSteps: [],
  snippets: ['검색 결과 1,234개', '실시간 검색어 1위', '3분 전 업데이트'],
  signature: 'ranking',
  metric: { label: '스크랩 기사', value: '24건', delta: '+12건' },
};

const local: ContentPack = {
  domain: 'local',
  heroTitle: '우리 동네 중고거래',
  heroSub: '역삼동 · 반경 2km',
  chips: ['전체', '디지털', '가구', '유아동', '생활', '의류'],
  items: [
    { name: '아이폰 14 프로', price: '820,000', meta: '역삼동 · 3분 전',  badge: '끌올' },
    { name: '이케아 책상',    price: '30,000',  meta: '논현동 · 1시간 전', badge: '나눔' },
    { name: '캠핑 의자 2개',  price: '25,000',  meta: '삼성동 · 2시간 전' },
    { name: '유아 매트',     price: '15,000',  meta: '대치동 · 3시간 전' },
  ],
  listRows: [
    { title: '한강 러닝 모임 🏃',  sub: '역삼동 모임',   meta: '12명' },
    { title: '동네 책방 북클럽',   sub: '논현동 모임',   meta: '8명' },
    { title: '강아지 산책 메이트', sub: '삼성동 모임',   meta: '21명' },
  ],
  detailTitle: '아이폰 14 프로 256GB',
  detailMeta: ['역삼동', '끌올 3분 전', '관심 24 · 채팅 8'],
  statusSteps: ['채팅', '약속', '거래중', '거래완료'],
  snippets: ['매너온도 36.5°C', '동네 인증하고 시작하기', '이웃이 관심을 보였어요'],
  signature: 'gauge',
  metric: { label: '매너온도', value: '36.5°C', delta: '따뜻해요' },
};

const commerce: ContentPack = {
  domain: 'commerce',
  heroTitle: '오늘 도착 로켓배송',
  heroSub: '밤 12시 전 주문 시 내일 도착',
  chips: ['전체', '신선식품', '생필품', '가전', '패션', '도서'],
  items: [
    { name: '생수 2L x 12',  price: '9,900',  meta: '★ 4.8 (12,043)', badge: '로켓' },
    { name: '무선 이어폰',    price: '49,000', meta: '★ 4.6 (3,201)',  badge: '와우할인' },
    { name: '키친타올 30롤',  price: '16,900', meta: '★ 4.9 (8,510)',  badge: '로켓' },
    { name: '베스트셀러 도서', price: '13,500', meta: '★ 4.7 (1,204)' },
  ],
  listRows: [
    { title: '생수 2L x 12',  sub: '3월 21일 주문', meta: '배송완료' },
    { title: '무선 이어폰',    sub: '3월 19일 주문', meta: '배송중' },
    { title: '키친타올 30롤',  sub: '3월 15일 주문', meta: '배송완료' },
  ],
  detailTitle: '프리미엄 생수 2L 12입',
  detailMeta: ['★ 4.8 (12,043)', '로켓배송 내일도착', '와우회원 추가할인'],
  statusSteps: ['결제완료', '상품준비', '배송중', '배송완료'],
  snippets: ['내일 새벽 도착 예정', '장바구니에 담았어요', '와우회원가 적용'],
  signature: 'status',
  metric: { label: '이번 달 지출', value: '124,300원', delta: '+8.3%' },
};

const messenger: ContentPack = {
  domain: 'messenger',
  heroTitle: '친구들 소식',
  heroSub: '새 메시지 3개',
  chips: ['전체', '친구', '오픈채팅', '쇼핑', '선물하기'],
  items: [
    { name: '생일인 친구 2명',     meta: '선물하기 추천' },
    { name: 'e기프티콘 아메리카노', price: '4,500', meta: '바로 선물', badge: '선물하기' },
    { name: '오픈채팅 — 등산 모임', meta: '342명 참여' },
    { name: '이모티콘 신상',        price: '2,500', meta: '인기 1위' },
  ],
  listRows: [
    { title: '가족 단톡방',   sub: '엄마: 저녁 뭐 먹을래?', meta: '오후 6:20' },
    { title: '회사 팀방',     sub: '김대리: 내일 회의 자료', meta: '오후 5:48' },
    { title: '대학 친구들',   sub: '[사진]',              meta: '오후 3:12' },
  ],
  detailTitle: '아메리카노 T 기프티콘',
  detailMeta: ['스타벅스', '유효기간 90일', '받는 사람 지정'],
  statusSteps: ['선택', '메시지', '결제', '전송완료'],
  snippets: ['선물이 도착했어요 🎁', '읽음', '새로운 메시지가 있어요'],
  signature: 'chat',
  metric: { label: '대화 상대', value: '18명', delta: '+2명' },
};

const PACKS: Record<string, ContentPack> = {
  food, finance, fashion, interior, portal, local, commerce, messenger,
};

/** Match a brand to its content domain via serviceTypes → category. */
function resolveDomain(token: BrandToken): keyof typeof PACKS {
  const s = (token.serviceTypes ?? []).join(' ');
  if (/배달|음식|푸드/.test(s)) return 'food';
  if (/핀테크|금융|뱅킹|결제|송금|증권|보험|은행/.test(s)) return 'finance';
  if (/패션|의류|스타일|셀렉트|편집샵|큐레이션/.test(s)) return 'fashion';
  if (/인테리어|리빙|가구|집/.test(s)) return 'interior';
  if (/포털|검색|뉴스|콘텐츠/.test(s)) return 'portal';
  if (/지역|중고|동네|커뮤니티/.test(s)) return 'local';
  if (/메신저|소셜|채팅|메시지/.test(s)) return 'messenger';
  // category fallback
  if (/핀테크|금융/.test(token.category)) return 'finance';
  return 'commerce';
}

export function getContentPack(token: BrandToken): ContentPack {
  return PACKS[resolveDomain(token)] ?? commerce;
}

/** Default pack for service-level pages (Components / Patterns gallery). */
export const defaultPack: ContentPack = commerce;
