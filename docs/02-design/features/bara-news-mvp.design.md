# bara-news-mvp Design Document

> **Summary**: Google Drive CMS 기반 IT·교육·문화예술·종교·상생 온라인 신문, 구독 신청 폼으로 독자 DB 확보
>
> **Project**: 바라뉴스 (Bara News)
> **Version**: 1.0.0
> **Author**: AI Team (PO·PM·Planner·Designer·Developer)
> **Date**: 2026-06-05
> **Status**: Confirmed
> **Planning Doc**: [bara-news-mvp.plan.md](../01-plan/features/bara-news-mvp.plan.md)

---

## Context Anchor

> Plan → Design 인계. 전략적 컨텍스트 유지.

| Key | Value |
|-----|-------|
| **WHY** | IT·교육·문화예술·종교·상생 분야 신뢰할 수 있는 전문 미디어 부재 → 바라뉴스로 양질의 콘텐츠 제공 |
| **WHO** | IT·교육·문화예술·종교·상생 종사자 / 일반 시민 / 관련 기관·단체 |
| **RISK** | Google Drive API 의존 (API 장애 시 콘텐츠 미표시), 구독 폼 스팸 가능성 |
| **SUCCESS** | 이메일 구독자 DB 확보 (Google Sheets 저장) |
| **SCOPE** | 콘텐츠 코어 + Google Drive CMS + 구독 폼 / 제외: SNS·검색·뉴스레터 자동발송·관리자 |

---

## 1. Overview

### 1.1 Design Goals

- Google Drive API를 서버 사이드에서만 호출하여 API 키 보안 유지
- Next.js ISR(Incremental Static Regeneration)로 SEO 최적화 + 빠른 페이지 로드
- 반응형 그리드로 모바일·태블릿·데스크톱 완전 대응
- 구독 신청을 Server Action으로 처리하여 클라이언트 JS 의존성 최소화

### 1.2 Design Principles

- **Next.js 관습 준수**: App Router 디렉토리 구조, Server Component 우선
- **관심사 분리**: lib/에 외부 API, components/에 UI, types/에 타입
- **YAGNI**: MVP 범위 외 기능은 코드에도 추가하지 않음
- **반응형 우선**: Tailwind 반응형 유틸리티 기본 사용

---

## 2. Architecture

### 2.0 Architecture Selection

**Selected: Option C — Pragmatic** | Next.js 관습 + lib/ 분리 + components/ 도메인 그룹화

| 기준 | Option A: Minimal | Option B: Clean | **Option C: Pragmatic** |
|------|:-:|:-:|:-:|
| 새 파일 수 | ~8 | ~25 | **~15** |
| 복잡도 | 낮음 | 높음 | **중간** |
| 유지보수 | 어려움 | 최상 | **좋음** |
| Next.js 관습 | △ | ✗ | **✅** |

**선택 이유**: MVP 규모에서 Clean Architecture는 과도하고, Minimal은 lib/page 결합도가 높아 유지보수 어려움. Pragmatic은 Next.js App Router 관습에 맞고 lib/components/types 분리로 확장성 유지.

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (독자)                                              │
│  bara-new.kr → CloudFront CDN → AWS Amplify                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│  Next.js App Router (Server Components)                      │
│                                                             │
│  app/page.tsx                                               │
│    └── components/filter/CategoryFilter     (Client)         │
│    └── components/article/ArticleGrid                        │
│         └── components/article/ArticleCard                   │
│    └── components/subscribe/SubscribeForm   (Client)         │
│                                                             │
│  app/articles/[slug]/page.tsx                               │
│    └── components/article/ArticleBody                        │
│                                                             │
│  app/category/[name]/page.tsx                               │
│    └── components/article/ArticleGrid                        │
│                                                             │
│  app/api/subscribe/route.ts (POST)  ←── SubscribeForm        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│  lib/                                                        │
│  ├── cms.ts           → Google Sheets API (메타데이터 읽기)   │
│  │                    → Google Drive API (Docs 본문 읽기)    │
│  └── subscribe.ts     → Google Sheets API (구독자 쓰기)      │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┴────────────┐
          ▼                        ▼
┌─────────────────┐    ┌──────────────────────────┐
│  Google Sheets  │    │  Google Drive (Docs)      │
│  (기사 메타데이터) │    │  (기사 본문 HTML)          │
│  (구독자 DB)     │    │                          │
└─────────────────┘    └──────────────────────────┘
```

### 2.2 Data Flow

```
[콘텐츠 읽기 플로우]
Browser Request
  → Next.js App Router
    → lib/cms.ts
      → Google Sheets API: 기사 메타데이터 목록
      → Google Drive API: 기사 본문 HTML (기사 상세만)
    → Page Component (Server)
      → UI Render
    → ISR Cache (revalidate: 60초)
  → CloudFront CDN 응답

[구독 플로우]
Browser: SubscribeForm 이메일 입력
  → POST /api/subscribe (Route Handler)
    → lib/subscribe.ts
      → Google Sheets API: subscribers 시트에 append
    → 200 OK 또는 400 Error
  → SubscribeForm: 성공/실패 UI 피드백
```

### 2.3 Dependencies

| 컴포넌트 | 의존 | 목적 |
|---------|------|------|
| app/page.tsx | lib/cms.ts, ArticleGrid, CategoryFilter, SubscribeForm | 홈 조합 |
| app/articles/[slug]/page.tsx | lib/cms.ts, ArticleBody | 기사 상세 |
| app/category/[name]/page.tsx | lib/cms.ts, ArticleGrid | 카테고리 목록 |
| app/api/subscribe/route.ts | lib/subscribe.ts | 구독 저장 |
| lib/cms.ts | googleapis | Google API 연동 |
| lib/subscribe.ts | googleapis | 구독 저장 |

---

## 3. Data Model

### 3.1 TypeScript 타입 정의

```typescript
// src/types/article.ts
export type Category = 'IT' | '교육' | '문화예술' | '종교' | '상생'

export interface Article {
  slug: string
  title: string
  category: Category
  author: string
  publishedAt: string      // ISO 8601 날짜 문자열 "YYYY-MM-DD"
  published: boolean
  docId: string            // Google Docs 문서 ID
  thumbnail: string        // 이미지 URL
  summary: string          // 카드용 요약 (2~3줄)
  content?: string         // HTML 본문 (기사 상세 페이지만)
}

export type ArticleListItem = Omit<Article, 'content' | 'docId'>
```

```typescript
// src/types/subscriber.ts
export interface Subscriber {
  email: string
  subscribedAt: string     // ISO 8601
  source: string           // 'home' | 'article' | 'category'
}

export interface SubscribeRequest {
  email: string
  source: string
}

export interface SubscribeResponse {
  success: boolean
  message: string
}
```

### 3.2 Google Sheets 스키마

**기사 메타데이터 시트 (Sheet1 또는 "articles")**

| 컬럼 | 타입 | 필수 | 설명 |
|------|------|------|------|
| slug | string | ✅ | URL 경로 (`education-reform-2026`) |
| title | string | ✅ | 기사 제목 |
| category | `IT\|교육\|문화예술\|종교\|상생` | ✅ | 카테고리 |
| author | string | ✅ | 기자명 |
| publishedAt | YYYY-MM-DD | ✅ | 발행일 |
| published | TRUE/FALSE | ✅ | 발행 여부 |
| docId | string | ✅ | Google Docs 문서 ID |
| thumbnail | URL | ✅ | 대표 이미지 URL |
| summary | string | ✅ | 카드용 요약 (140자 이내) |

**구독자 시트 ("subscribers")**

| 컬럼 | 타입 | 설명 |
|------|------|------|
| email | string | 구독자 이메일 |
| subscribedAt | ISO 8601 | 구독 신청 일시 |
| source | string | 유입 페이지 |

---

## 4. API Specification

### 4.1 커스텀 API Endpoint

| Method | Path | 설명 | Auth |
|--------|------|------|------|
| POST | /api/subscribe | 구독 신청 저장 | 불필요 |

### 4.2 POST /api/subscribe

**Request:**
```json
{
  "email": "user@example.com",
  "source": "home"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "구독 신청이 완료되었습니다."
}
```

**Error Responses:**
- `400 Bad Request`: 이메일 형식 오류
  ```json
  { "success": false, "message": "올바른 이메일 주소를 입력해 주세요." }
  ```
- `409 Conflict`: 이미 구독한 이메일
  ```json
  { "success": false, "message": "이미 구독 중인 이메일입니다." }
  ```
- `500 Internal Server Error`: Google Sheets API 오류
  ```json
  { "success": false, "message": "일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." }
  ```

### 4.3 Google API 함수 (lib/cms.ts)

```typescript
// 기사 목록 가져오기 (published=TRUE인 것만)
getArticles(category?: Category): Promise<ArticleListItem[]>

// 기사 상세 가져오기 (메타 + 본문)
getArticleBySlug(slug: string): Promise<Article | null>

// 카테고리별 기사 목록
getArticlesByCategory(category: Category): Promise<ArticleListItem[]>
```

---

## 5. UI/UX Design

### 5.1 디자인 토큰

```css
/* 배경 */
--canvas: #ffffff;           /* 카드 배경 */
--canvas-soft: #e8ebe6;      /* 페이지 전체 배경 (세이지) */

/* 텍스트 */
--ink: #0e0f0c;              /* 제목, 기본 텍스트 */
--body: #454745;             /* 부제목, 보조 텍스트 */
--mute: #868685;             /* 날짜, 캡션, 메타 */

/* 카테고리 컬러 (임시, 디자이너 확정 전) */
--it: #06b6d4;               /* IT — 시안 */
--education: #3b82f6;        /* 교육 — 파란색 */
--culture: #8b5cf6;          /* 문화예술 — 보라색 */
--religion: #f59e0b;         /* 종교 — 앰버 */
--sangsaeng: #10b981;        /* 상생 — 에메랄드 */
```

### 5.2 화면 레이아웃

#### 홈 페이지 (/)

```
┌─────────────────────────────────────────────┐
│  Header                                     │
│  [바라뉴스 로고]  [홈] [IT] [교육] [문화예술] [종교] [상생] │
├─────────────────────────────────────────────┤
│  CategoryFilter                             │
│  [전체] [IT] [교육] [문화예술] [종교] [상생]      │
├─────────────────────────────────────────────┤
│  ArticleGrid (3열)                          │
│  ┌──────┐ ┌──────┐ ┌──────┐               │
│  │Card  │ │Card  │ │Card  │               │
│  │썸네일│ │썸네일│ │썸네일│               │
│  │제목  │ │제목  │ │제목  │               │
│  │요약  │ │요약  │ │요약  │               │
│  │날짜  │ │날짜  │ │날짜  │               │
│  └──────┘ └──────┘ └──────┘               │
├─────────────────────────────────────────────┤
│  SubscribeForm                              │
│  바라뉴스 소식을 이메일로 받아보세요            │
│  [이메일 입력____________] [구독 신청]          │
├─────────────────────────────────────────────┤
│  Footer                                     │
│  © 2026 주식회사 일리아   ylia.io 링크         │
└─────────────────────────────────────────────┘
```

#### 기사 상세 (/articles/[slug])

```
┌─────────────────────────────────────────────┐
│  Header                                     │
├─────────────────────────────────────────────┤
│  [카테고리 뱃지]                              │
│  제목 제목 제목 제목 (Pretendard 900)          │
│  기자명 · 2026-06-05                          │
│  ┌────────────────────────────────┐          │
│  │       대표 이미지               │          │
│  └────────────────────────────────┘          │
│  본문 본문 본문... (Google Docs HTML)          │
├─────────────────────────────────────────────┤
│  SubscribeForm (기사 하단)                    │
├─────────────────────────────────────────────┤
│  Footer                                     │
└─────────────────────────────────────────────┘
```

### 5.3 컴포넌트 목록

| 컴포넌트 | 위치 | 타입 | 책임 |
|---------|------|------|------|
| Header | components/layout/Header.tsx | Server | 로고 + 네비게이션 |
| Footer | components/layout/Footer.tsx | Server | 저작권 + ylia.io 링크 |
| ArticleCard | components/article/ArticleCard.tsx | Server | 기사 카드 (썸네일+제목+요약+날짜+뱃지) |
| ArticleGrid | components/article/ArticleGrid.tsx | Server | 기사 카드 그리드 레이아웃 |
| ArticleBody | components/article/ArticleBody.tsx | Server | Google Docs HTML 본문 렌더링 |
| CategoryFilter | components/filter/CategoryFilter.tsx | **Client** | 카테고리 탭 (URL params 연동) |
| SubscribeForm | components/subscribe/SubscribeForm.tsx | **Client** | 이메일 입력 + 구독 API 호출 |

> Client Component는 CategoryFilter, SubscribeForm만 — 인터랙션이 필요한 최소한만

### 5.4 Page UI Checklist

> Gap Detector가 이 항목들을 기준으로 구현 완성도를 검증합니다.

#### 홈 페이지 (/)

- [ ] Header: 바라뉴스 로고 텍스트 또는 이미지
- [ ] Header: 네비게이션 링크 — 홈(/), IT(/category/IT), 교육(/category/교육), 문화예술(/category/문화예술), 종교(/category/종교), 상생(/category/상생)
- [ ] CategoryFilter: 탭 버튼 6개 — 전체, IT, 교육, 문화예술, 종교, 상생
- [ ] CategoryFilter: 선택된 탭 활성화 스타일 (underline 또는 배경색 변경)
- [ ] ArticleGrid: 기사 카드 반복 렌더링 (published=TRUE인 기사만)
- [ ] ArticleCard: 썸네일 이미지 (`<img>` 또는 `<Image>`)
- [ ] ArticleCard: 카테고리 뱃지 (IT=시안, 교육=파랑, 문화예술=보라, 종교=앰버, 상생=에메랄드)
- [ ] ArticleCard: 기사 제목 (클릭 시 /articles/[slug] 이동)
- [ ] ArticleCard: 기사 요약 (2~3줄 truncate)
- [ ] ArticleCard: 날짜 표시 (YYYY-MM-DD 형식)
- [ ] SubscribeForm: 이메일 입력 필드 (`type="email"`, placeholder)
- [ ] SubscribeForm: 구독 신청 버튼
- [ ] SubscribeForm: 성공 메시지 ("구독 신청이 완료되었습니다.")
- [ ] SubscribeForm: 오류 메시지 (이메일 형식 오류 시)
- [ ] Footer: 저작권 문구 (© 2026 주식회사 일리아)
- [ ] Footer: ylia.io 외부 링크 (`target="_blank"`)

#### 기사 상세 (/articles/[slug])

- [ ] Header: 공통 헤더
- [ ] 카테고리 뱃지 (IT/교육/문화예술/종교/상생)
- [ ] 기사 제목 (h1, Pretendard weight 900)
- [ ] 기자명 + 발행일 표시
- [ ] 대표 이미지 (thumbnail URL 사용)
- [ ] 기사 본문 (Google Docs HTML 렌더링, `dangerouslySetInnerHTML` 또는 sanitize)
- [ ] SubscribeForm (기사 하단)
- [ ] Footer: 공통 푸터

#### 카테고리 목록 (/category/[name])

- [ ] 카테고리 제목 표시 ("IT 기사" / "교육 기사" / "문화예술 기사" / "종교 기사" / "상생 기사")
- [ ] 해당 카테고리 기사 카드 그리드
- [ ] 빈 상태 UI (해당 카테고리 기사 없을 때)
- [ ] Footer: 공통 푸터

---

## 6. Error Handling

### 6.1 에러 케이스 정의

| 상황 | 에러 | 처리 방법 |
|------|------|----------|
| Google Sheets API 실패 | 기사 목록 미로드 | 빈 배열 반환 + 콘솔 에러 로그 |
| Google Docs API 실패 | 본문 미로드 | "내용을 불러올 수 없습니다." 메시지 |
| 존재하지 않는 slug | 404 | Next.js `notFound()` 호출 |
| 구독 이메일 형식 오류 | 400 | 클라이언트 유효성 검사 메시지 |
| 구독 중복 이메일 | 409 | "이미 구독 중인 이메일입니다." |
| Google Sheets 쓰기 실패 | 500 | "잠시 후 다시 시도해 주세요." |

### 6.2 에러 응답 포맷

```typescript
// /api/subscribe 에러 응답
interface ApiError {
  success: false
  message: string  // 사용자에게 보여줄 한국어 메시지
}
```

---

## 7. Security Considerations

- [x] **Google API 키 서버 사이드 전용**: `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_SHEETS_ID`, `GOOGLE_SUBSCRIBE_SHEETS_ID` 환경변수를 `NEXT_PUBLIC_` 없이 설정
- [x] **이메일 유효성 검사**: 클라이언트(정규식) + 서버(zod 또는 수동 검사) 이중 검사
- [x] **HTML Sanitization**: Google Docs HTML 본문을 `dangerouslySetInnerHTML` 사용 시 `DOMPurify` 또는 `sanitize-html`로 XSS 방지
- [x] **Rate Limiting**: `/api/subscribe` 엔드포인트 IP당 분당 3회 제한 (Next.js middleware 또는 간단한 메모리 카운터)
- [x] **CORS**: AWS Amplify 배포 후 bara-new.kr 도메인만 허용

---

## 8. Test Plan

### 8.1 Test Scope

| 타입 | 대상 | 도구 | 단계 |
|------|------|------|------|
| L1: API | POST /api/subscribe | curl | Do |
| L2: UI Action | 홈/상세/카테고리 페이지 UI 요소 | Playwright | Do |
| L3: E2E | 기사 탐색 → 구독 신청 전체 플로우 | Playwright | Do |

### 8.2 L1: API Test Scenarios

| # | Endpoint | Method | 설명 | 예상 Status | 예상 Response |
|---|----------|--------|------|:-----------:|---------------|
| 1 | /api/subscribe | POST | 유효한 이메일 구독 신청 | 200 | `{ success: true }` |
| 2 | /api/subscribe | POST | 이메일 없이 요청 | 400 | `{ success: false, message: "..." }` |
| 3 | /api/subscribe | POST | 이메일 형식 오류 | 400 | `{ success: false, message: "..." }` |
| 4 | /api/subscribe | POST | 이미 존재하는 이메일 | 409 | `{ success: false, message: "..." }` |

### 8.3 L2: UI Action Test Scenarios

| # | 페이지 | 액션 | 예상 결과 |
|---|--------|------|----------|
| 1 | / | 페이지 로드 | §5.4 홈 체크리스트 모든 항목 표시 |
| 2 | / | "교육" 탭 클릭 | 교육 카테고리 기사만 표시 |
| 3 | / | 기사 카드 클릭 | /articles/[slug] 이동 |
| 4 | / | 유효 이메일 입력 후 구독 신청 | 성공 메시지 표시 |
| 5 | / | 잘못된 이메일 입력 후 구독 신청 | 에러 메시지 표시 |
| 6 | /articles/[slug] | 페이지 로드 | §5.4 기사 상세 체크리스트 모든 항목 표시 |
| 7 | /category/교육 | 페이지 로드 | 교육 카테고리 기사만 표시 |

### 8.4 L3: E2E Scenario Test Scenarios

| # | 시나리오 | 단계 | 성공 기준 |
|---|----------|------|----------|
| 1 | 기사 탐색 + 읽기 | 홈 → 교육 탭 → 기사 카드 클릭 → 상세 본문 확인 | 본문 HTML 렌더링, 에러 없음 |
| 2 | 구독 신청 성공 | 홈 → 이메일 입력 → 구독 신청 → 성공 메시지 | UI 피드백 표시 |
| 3 | 카테고리 탐색 | 헤더 "문화예술" 클릭 → /category/문화예술 → 기사 목록 확인 | 해당 카테고리 기사만 표시 |

### 8.5 Seed Data Requirements

| 엔티티 | 최소 수 | 필수 필드 |
|--------|:------:|----------|
| Article (IT) | 2 | slug, title, category=IT, thumbnail, summary |
| Article (교육) | 2 | slug, title, category=교육, thumbnail, summary |
| Article (문화예술) | 2 | slug, title, category=문화예술, thumbnail, summary |
| Article (종교) | 2 | slug, title, category=종교, thumbnail, summary |
| Article (상생) | 2 | slug, title, category=상생, thumbnail, summary |
| Article (본문) | 1 | docId (실제 Google Docs ID, 본문 있음) |

> 테스트 전 Google Sheets에 위 데이터를 수동으로 입력하거나, Mock 데이터로 lib/cms.ts를 교체하여 테스트

---

## 9. Clean Architecture (Simplified)

### 9.1 레이어 구조

| 레이어 | 책임 | 위치 |
|-------|------|------|
| **Presentation** | UI 컴포넌트, 페이지 | `src/components/`, `src/app/` |
| **Infrastructure** | Google API 클라이언트 | `src/lib/cms.ts`, `src/lib/subscribe.ts` |
| **Domain** | 타입 정의 | `src/types/` |

> Application 레이어는 MVP 규모에서 생략 — lib/에서 직접 처리

### 9.2 레이어 규칙

```
Presentation (components, app)
  → Infrastructure (lib)
  → Domain (types)

규칙:
- app/page.tsx는 lib/cms.ts만 직접 import
- components/는 types/만 import (lib 직접 접근 금지)
- lib/는 types/만 import
```

### 9.3 This Feature's Layer Assignment

| 컴포넌트 | 레이어 | 위치 |
|---------|-------|------|
| page.tsx, layout.tsx | Presentation | `src/app/` |
| Header, Footer, ArticleCard, ArticleGrid, ArticleBody, CategoryFilter, SubscribeForm | Presentation | `src/components/` |
| cms.ts, subscribe.ts | Infrastructure | `src/lib/` |
| Article, Subscriber | Domain | `src/types/` |

---

## 10. Coding Convention Reference

### 10.1 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase.tsx | `ArticleCard.tsx` |
| 유틸/훅 파일 | camelCase.ts | `cms.ts`, `subscribe.ts` |
| 페이지 디렉토리 | kebab-case | `/articles/[slug]` |
| 타입/인터페이스 | PascalCase | `Article`, `Subscriber` |
| 함수 | camelCase | `getArticles()`, `handleSubmit()` |

### 10.2 환경변수

| 변수명 | 용도 | Client 노출 |
|--------|------|:-----------:|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Google API 인증 JSON | ❌ |
| `GOOGLE_SHEETS_ID` | 기사 메타데이터 스프레드시트 ID | ❌ |
| `GOOGLE_SUBSCRIBE_SHEETS_ID` | 구독자 스프레드시트 ID | ❌ |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (bara-new.kr) | ✅ |

### 10.3 CSS 규칙

- Tailwind 유틸리티 클래스만 사용 (인라인 `style` 금지)
- 반응형: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- 그리드: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- 카드: `rounded-xl bg-white shadow-sm`

---

## 11. Implementation Guide

### 11.1 File Structure

```
src/
├── app/
│   ├── layout.tsx                    ← Root layout (Header + Footer)
│   ├── page.tsx                      ← 홈 페이지
│   ├── globals.css                   ← Tailwind import + 기본 스타일
│   ├── articles/
│   │   └── [slug]/
│   │       └── page.tsx              ← 기사 상세
│   ├── category/
│   │   └── [name]/
│   │       └── page.tsx              ← 카테고리 목록
│   └── api/
│       └── subscribe/
│           └── route.ts              ← POST /api/subscribe
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── article/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleGrid.tsx
│   │   └── ArticleBody.tsx
│   ├── filter/
│   │   └── CategoryFilter.tsx        ← 'use client'
│   └── subscribe/
│       └── SubscribeForm.tsx         ← 'use client'
├── lib/
│   ├── cms.ts                        ← Google Sheets + Docs API
│   └── subscribe.ts                  ← Google Sheets 구독자 저장
└── types/
    ├── article.ts
    └── subscriber.ts
```

### 11.2 Implementation Order

#### Module 1: 프로젝트 세팅 (Session 1 전반)

1. [ ] Next.js 프로젝트 초기화 (`create-next-app --typescript --tailwind --app`)
2. [ ] Pretendard 폰트 설정 (`next/font/local` 또는 CDN)
3. [ ] globals.css: canvas-soft 배경색(`#e8ebe6`) 설정
4. [ ] types/article.ts + types/subscriber.ts 작성
5. [ ] `.env.local` 파일 생성 (Google API 환경변수 placeholder)

#### Module 2: 콘텐츠 코어 (Session 2)

6. [ ] lib/cms.ts: `getArticles()`, `getArticleBySlug()`, `getArticlesByCategory()` 구현
7. [ ] components/layout/Header.tsx + Footer.tsx
8. [ ] app/layout.tsx (Header + Footer 포함)
9. [ ] components/article/ArticleCard.tsx
10. [ ] components/article/ArticleGrid.tsx
11. [ ] app/page.tsx (기사 목록, CategoryFilter 연동)
12. [ ] components/filter/CategoryFilter.tsx (`'use client'`, URL searchParams 연동)
13. [ ] components/article/ArticleBody.tsx (HTML sanitize 포함)
14. [ ] app/articles/[slug]/page.tsx (기사 상세)
15. [ ] app/category/[name]/page.tsx (카테고리 목록)

#### Module 3: 구독 폼 + 배포 설정 (Session 3)

16. [ ] lib/subscribe.ts: `addSubscriber()` 구현
17. [ ] app/api/subscribe/route.ts (유효성 검사 + 중복 검사 + Sheets 저장)
18. [ ] components/subscribe/SubscribeForm.tsx (`'use client'`, fetch + 상태 관리)
19. [ ] app/page.tsx에 SubscribeForm 추가
20. [ ] app/articles/[slug]/page.tsx에 SubscribeForm 추가
21. [ ] amplify.yml 또는 AWS Amplify 배포 설정

### 11.3 Session Guide

> `/pdca do bara-news-mvp --scope module-N` 으로 세션별 구현

#### Module Map

| 모듈 | 스코프 키 | 설명 | 예상 턴 |
|------|----------|------|:------:|
| 프로젝트 세팅 | `module-1` | Next.js 초기화, 폰트, 타입 정의 | 15~20 |
| 콘텐츠 코어 | `module-2` | CMS 연동, 기사 목록/상세/카테고리 | 30~40 |
| 구독 폼 + 배포 | `module-3` | 구독 API, SubscribeForm, Amplify | 20~25 |

#### Recommended Session Plan

| 세션 | 단계 | 스코프 | 예상 턴 |
|------|------|--------|:------:|
| Session 1 | Plan + Design | 전체 | 완료 |
| Session 2 | Do | `--scope module-1,module-2` | 45~55 |
| Session 3 | Do | `--scope module-3` | 25~30 |
| Session 4 | Check + Report | 전체 | 30~40 |

---

## Version History

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0 | 2026-06-05 | 초안 작성 (Option C: Pragmatic) | AI Team |
