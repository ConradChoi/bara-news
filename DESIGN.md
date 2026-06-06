# 바라뉴스 (Bara News) — DESIGN.md

> 디자이너 및 개발자가 UI 구현 시 반드시 참조해야 할 디자인 시스템 명세입니다.
> ui-ux-pro-max 스킬 + Wise 디자인 시스템 기반으로 합성.

---

## 1. 디자인 방향

| 항목 | 값 |
|------|-----|
| **스타일** | Editorial Grid / Magazine (잡지식 그리드) |
| **무드** | 차분하고 신뢰감 있는, 교육적, 문화적 |
| **레퍼런스** | Wise 디자인 시스템 + 국내 교육 미디어 |

### 핵심 원칙
- **배경 vs 카드**: 세이지 배경 `#e8ebe6` + 흰 카드 `#ffffff` — 잡지 느낌의 자연스러운 입체감
- **헤드라인**: Pretendard weight 900, font-size `clamp(2rem, 5vw, 4rem)`, letter-spacing -0.03em
- **버튼/뱃지**: `rounded-full` (pill) 또는 `rounded-xl` — 직각 금지
- **이미지**: 항상 width + height 명시 (레이아웃 시프트 방지)
- **호버**: `cursor-pointer` + 색상 전환 150~300ms (스케일 변환 금지)

---

## 2. 색상 토큰

### 배경 & 텍스트

| 토큰 | 값 | Tailwind 근사 | 용도 |
|------|----|--------------|------|
| `canvas` | `#ffffff` | `white` | 카드 내부 배경 |
| `canvas-soft` | `#e8ebe6` | `stone-100`* | 페이지 전체 배경 (세이지) |
| `ink` | `#0e0f0c` | `neutral-950` | 기본 텍스트, 헤드라인 |
| `body` | `#454745` | `neutral-700` | 부제목, 보조 텍스트 |
| `mute` | `#868685` | `neutral-500` | 날짜, 캡션, 메타 정보 |

> *`#e8ebe6`는 Tailwind 기본값 없음 → `bg-[#e8ebe6]`으로 사용

### 카테고리 & 액센트

| 토큰 | 값 | 용도 |
|------|----|------|
| `education` | `#2563EB` | 교육 카테고리 뱃지 (파랑) |
| `culture` | `#7C3AED` | 문화예술 카테고리 뱃지 (보라) |
| `accent` | `#16A34A` | CTA 버튼, 구독 버튼 (그린 — 바라뉴스 브랜드) |
| `accent-hover` | `#15803D` | accent 호버 상태 |

> 액센트 컬러는 디자이너 최종 확정 전까지 위 그린 사용 (Wise 라임 그린 조정)

### 경계선 & 그림자

| 토큰 | 값 | 용도 |
|------|----|------|
| `border` | `#e2e8e0` | 카드 테두리 (세이지 배경과 조화) |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | 카드 기본 그림자 |
| `shadow-hover` | `0 4px 12px rgba(0,0,0,0.12)` | 카드 호버 그림자 |

---

## 3. 타이포그래피

### 폰트 패밀리

```css
/* Pretendard — 한국어 (로컬 폰트) */
font-family: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;

/* Inter — 영문, 숫자 (Google Fonts) */
font-family: 'Inter', sans-serif;

/* 조합 */
--font-sans: 'Pretendard Variable', 'Inter', system-ui, sans-serif;
```

### 타입 스케일

| 역할 | Size | Weight | Line Height | 용도 |
|------|------|--------|-------------|------|
| Display | `clamp(2.5rem, 6vw, 4.5rem)` | 900 | 1.05 | 히어로 타이틀 |
| H1 | `clamp(1.75rem, 3vw, 2.5rem)` | 900 | 1.15 | 기사 상세 제목 |
| H2 | `1.5rem` (24px) | 700 | 1.25 | 섹션 제목 |
| H3 | `1.25rem` (20px) | 600 | 1.35 | 카드 제목 |
| Body | `1rem` (16px) | 400 | 1.75 | 본문 텍스트 |
| Small | `0.875rem` (14px) | 400 | 1.5 | 날짜, 캡션 |
| XSmall | `0.75rem` (12px) | 500 | 1.5 | 뱃지 레이블 |

---

## 4. 간격 시스템

4px 기반 (Tailwind spacing 사용)

| 토큰 | 값 | Tailwind | 용도 |
|------|-----|---------|------|
| xs | 4px | `p-1` | 아이콘 패딩 |
| sm | 8px | `p-2` | 뱃지 패딩 |
| md | 16px | `p-4` | 카드 내부 패딩 |
| lg | 24px | `p-6` | 섹션 패딩 |
| xl | 32px | `p-8` | 대형 섹션 |
| 2xl | 48px | `p-12` | 페이지 섹션 간격 |
| 3xl | 64px | `p-16` | 히어로 섹션 |

---

## 5. 레이아웃

### 컨테이너
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;  /* px-6 */
}
```

### 기사 그리드
```
데스크톱 (≥1024px): grid-cols-3, gap-6
태블릿 (≥768px):   grid-cols-2, gap-5
모바일 (<768px):   grid-cols-1, gap-4
```

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
```

### 기사 상세 레이아웃
```
본문 최대 너비: max-w-3xl (768px)
이미지: aspect-ratio 16:9, width 100%
```

---

## 6. 컴포넌트 명세

### 6.1 Header

```
배경: canvas-soft(#e8ebe6) 또는 white + border-bottom
높이: h-16 (64px)
로고: 바라뉴스 (Pretendard 700, ink 색상)
네비게이션: 홈 / 교육 / 문화예술
```

```html
<header class="sticky top-0 z-50 bg-white border-b border-[#e2e8e0]">
  <nav class="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
    <a class="font-bold text-xl text-[#0e0f0c]">바라뉴스</a>
    <ul class="flex gap-6 text-sm font-medium text-[#454745]">
      <li><a href="/" class="hover:text-[#0e0f0c] transition-colors">홈</a></li>
      <li><a href="/category/교육" class="hover:text-[#0e0f0c] transition-colors">교육</a></li>
      <li><a href="/category/문화예술" class="hover:text-[#0e0f0c] transition-colors">문화예술</a></li>
    </ul>
  </nav>
</header>
```

### 6.2 ArticleCard

```
배경: white (#ffffff)
테두리 반경: rounded-xl (12px)
그림자: shadow-sm → shadow-md (호버)
썸네일: aspect-ratio 16:9
뱃지: rounded-full, text-xs, font-medium
제목: H3 (Pretendard 600, ink)
요약: 2줄 truncate (body 색상)
날짜: Small (mute 색상)
호버: shadow 증가 + 제목 색상 accent
```

```html
<article class="bg-white rounded-xl overflow-hidden shadow-sm
                hover:shadow-md transition-shadow duration-200 cursor-pointer">
  <img class="aspect-video w-full object-cover" width="400" height="225" />
  <div class="p-5">
    <span class="inline-block px-3 py-1 rounded-full text-xs font-medium
                 bg-blue-100 text-blue-700">교육</span>
    <h3 class="mt-2 font-semibold text-[#0e0f0c] line-clamp-2">기사 제목</h3>
    <p class="mt-1 text-sm text-[#454745] line-clamp-2">기사 요약...</p>
    <time class="mt-3 block text-xs text-[#868685]">2026-06-05</time>
  </div>
</article>
```

### 6.3 CategoryFilter

```
탭 스타일: pill 버튼
기본: bg-transparent, border border-[#e2e8e0]
활성: bg-[#0e0f0c] text-white
호버(비활성): bg-[#f4f6f3]
```

```html
<div class="flex gap-2">
  <button class="px-4 py-2 rounded-full text-sm font-medium
                 bg-[#0e0f0c] text-white">전체</button>
  <button class="px-4 py-2 rounded-full text-sm font-medium border border-[#e2e8e0]
                 text-[#454745] hover:bg-[#f4f6f3] transition-colors cursor-pointer">교육</button>
</div>
```

### 6.4 SubscribeForm

```
배경: white 또는 canvas-soft
버튼: accent(#16A34A) + rounded-xl
입력: border border-[#e2e8e0] rounded-xl
성공 메시지: 그린 텍스트
오류 메시지: 레드 텍스트
```

### 6.5 Footer

```
배경: #1a1c18 (dark ink)
텍스트: #868685 (mute)
링크: ylia.io → 흰색, hover underline
```

---

## 7. 반응형 브레이크포인트

| 이름 | 너비 | 용도 |
|------|------|------|
| sm | 640px | 소형 모바일 분기 |
| md | 768px | 태블릿 (2열 그리드) |
| lg | 1024px | 데스크톱 (3열 그리드) |
| xl | 1280px | 와이드 스크린 |

---

## 8. 이미지 가이드

- 항상 `width`, `height` 속성 명시 (CLS 방지)
- 썸네일: 400×225px (16:9) 최소 크기
- Next.js `<Image>` 컴포넌트 사용 (`next/image`)
- `sizes` 속성: `"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`

---

## 9. 접근성 체크리스트 (Pre-Delivery)

- [ ] 모든 이미지 `alt` 텍스트 있음
- [ ] 폼 입력에 `<label>` 연결
- [ ] `cursor-pointer` on 모든 클릭 요소
- [ ] 호버 상태 시각적 피드백 (150~300ms transition)
- [ ] 포커스 상태 키보드 탐색 가능
- [ ] `prefers-reduced-motion` 대응
- [ ] 텍스트 대비 4.5:1 이상

---

## 10. 아이콘

- Lucide React (`lucide-react`) 사용
- 이모지 아이콘 금지
- 크기: `w-4 h-4` (sm), `w-5 h-5` (md), `w-6 h-6` (lg)

---

## 업데이트 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| 1.0 | 2026-06-05 | 초안 (ui-ux-pro-max + Wise 시스템 기반) |

> 액센트 컬러 (#16A34A)는 디자이너 최종 확정 후 업데이트 예정
