# bara-news-mvp Plan Document
> Plan Plus 기반 전면 재기획 | 2026-06-05

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **문제** | IT·교육·문화예술·종교·상생 분야의 신뢰할 수 있는 전문 미디어가 부재하고, 관련 종사자·시민·기관이 분산된 정보 속에서 양질의 콘텐츠를 찾기 어려움 |
| **솔루션** | 주식회사 일리아(ylia.io)가 AI 팀으로 운영하는 IT·교육·문화예술·종교·상생 특화 온라인 신문 바라뉴스(bara-new.kr) |
| **기능 UX 효과** | Google Drive CMS로 비개발자도 즉시 기사 발행, 구독 신청 폼으로 독자 DB 자동 확보 |
| **핵심 가치** | "바라(히브리어: 창조·소망·기대)" — IT·교육·문화예술·종교·상생 저널리즘으로 사회적 소망을 전달하는 미디어 플랫폼 |

---

## 1. 사용자 의도 발견 (Phase 1 결과)

### 핵심 문제
AI 팀 기반 전면 재기획 — 확장된 팀 구조(PO·PM·기획·UX Writer·Researcher·Marketer·Designer·Publisher·Developer·QA)를 기반으로 지속 가능한 콘텐츠 운영 체계 구축

### 목표 독자
| 독자 그룹 | 설명 |
|-----------|------|
| IT·교육·문화예술·종교·상생 종사자 | IT 전문가, 교사, 예술가, 문화기획자, 종교인, 소상공인·공급사 등 |
| 일반 시민 | IT·교육·문화·종교·상생 이슈에 관심 있는 30~50대 성인 |
| 관련 기관·단체 | IT 기업, 교육청, 문화재단, 학교, 종교단체, 소상공인 협회, 연구기관 등 |

### 성공 기준
**구독자 DB 확보** — 론칭 후 이메일 구독자 수를 핵심 KPI로 설정 (Google Sheets에 저장)

---

## 2. 검토된 대안 (Phase 2 결과)

| 접근법 | 설명 | 채택 여부 |
|--------|------|-----------|
| **A: CMS-Driven + 자체 구독 DB** | Google Drive CMS + Google Sheets 구독자 저장 | ✅ 채택 |
| B: Headless CMS + 자체 DB | Notion API + Supabase | 개발 기간 +3주, 불필요 |
| C: Full Platform | 자체 백엔드 + 관리자 페이지 | MVP에 과도한 복잡성 |

**채택 이유**: 구독자 DB를 Google Sheets로 직접 관리하면 비개발자 팀도 구독자 데이터에 즉시 접근 가능. 외부 서비스(Stibee 등) 없이 자체 보유. 추가 인프라 비용 없음.

---

## 3. YAGNI 검토 결과 (Phase 3 결과)

### MVP v1 포함
- [x] 콘텐츠 코어: 메인 기사 목록 + 기사 상세 + 카테고리 필터
- [x] Google Drive CMS 연동 (Google Docs 본문 + Sheets 메타데이터)
- [x] 구독 신청 폼 → Google Sheets 저장

### v2 이후 연기
- [ ] SNS 공유 버튼 (카카오톡, X, 카피 링크)
- [ ] 검색 기능
- [ ] 뉴스레터 자동 발송 (Stibee/Mailchimp 연동)
- [ ] 관리자 페이지
- [ ] 댓글/반응 기능
- [ ] 광고 배너

---

## 4. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **서비스명** | 바라뉴스 (Bara News) |
| **운영사** | 주식회사 일리아 |
| **브랜드 의미** | 바라 = 히브리어 '창조, 소망, 기대' |
| **서비스 유형** | 온라인 신문 (IT / 교육 / 문화·예술 / 종교 / 상생) |
| **도메인** | bara-new.kr |
| **개발 레벨** | Dynamic (bkit 기준) |

---

## 5. AI 팀 구성 및 역할

| 역할 | 담당 업무 | PDCA 참여 단계 |
|------|-----------|----------------|
| **Product Owner (PO)** | 우선순위 결정, 최종 승인, 로드맵 관리 | Plan, 각 Phase 승인 |
| **Project Manager (PM)** | 일정 관리, GitHub Issues 트래킹, 이슈 조율 | 전 단계 |
| **Service Planner** | 요건 정의, 사이트맵, 콘텐츠 전략, 와이어프레임 | Plan, Design |
| **UX Writer** | UI 카피, 버튼 레이블, 에러 메시지, 메타 설명 | Design, Do |
| **Researcher** | 독자 니즈 조사, 경쟁사 분석, SEO 키워드 | Plan |
| **Marketer** | SEO 전략, 채널 운영, 독자 유치 캠페인 | Do, 론칭 후 |
| **UI/UX Designer** | Figma 디자인, 컴포넌트 가이드, DESIGN.md 작성 | Design |
| **Publisher** | Google Drive CMS 기사 발행, 메타데이터 관리 | Do, 운영 |
| **Developer** | Next.js 구현, API 연동, AWS Amplify 배포 | Do |
| **QA** | 기능 테스트, 크로스브라우저 테스트, 체크리스트 관리 | Check |

---

## 6. 기술 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| **프레임워크** | Next.js (App Router) | SSG/ISR, SEO 최적화 |
| **언어** | TypeScript | strict mode, `any` 금지 |
| **스타일링** | Tailwind CSS | 인라인 style 금지 |
| **폰트** | Pretendard (한국어) + Inter (영문) | |
| **CMS** | Google Drive API + Sheets API | 기사 본문 + 메타데이터 |
| **구독 DB** | Google Sheets API (Write) | Server Action으로 구독자 저장 |
| **배포** | AWS Amplify | CloudFront CDN, CI/CD 내장 |
| **버전 관리** | GitHub | |

---

## 7. MVP 기능 범위

### 7-1. 페이지 구조

```
/                    → 홈 (기사 카드 그리드 + 카테고리 필터 + 구독 폼)
/articles/[slug]     → 기사 상세 (제목, 본문, 이미지, 날짜, 기자명)
/category/[name]     → 카테고리별 목록 (IT / 교육 / 문화예술 / 종교 / 상생)
```

> `/about` 페이지 없음 — Footer에 ylia.io 링크로 대체

### 7-2. 컴포넌트 구조

```
components/
├── layout/
│   ├── Header.tsx        → 바라뉴스 로고 + 네비게이션 (홈/IT/교육/문화예술/종교/상생)
│   └── Footer.tsx        → 저작권 + 연락처 + ylia.io 외부 링크
│
├── article/
│   ├── ArticleCard.tsx   → 썸네일, 제목, 요약, 날짜, 카테고리 뱃지
│   └── ArticleBody.tsx   → Google Docs HTML 본문 렌더링
│
├── filter/
│   └── CategoryFilter.tsx → 전체 / IT / 교육 / 문화예술 / 종교 / 상생 탭
│
└── subscribe/
    └── SubscribeForm.tsx  → 이메일 입력 + 구독 신청 버튼

lib/
├── cms.ts                 → Google Drive API (Docs 본문) + Sheets API (메타데이터)
└── subscribe.ts           → Google Sheets API Write (구독자 저장)

types/
├── article.ts             → Article, Category 타입
└── subscriber.ts          → Subscriber 타입
```

### 7-3. Google Sheets 메타데이터 컬럼

| 컬럼 | 타입 | 설명 |
|------|------|------|
| slug | string | URL 경로 식별자 |
| title | string | 기사 제목 |
| category | enum | IT / 교육 / 문화예술 / 종교 / 상생 |
| author | string | 기자명 |
| publishedAt | date | 발행일 |
| published | boolean | 발행 여부 (TRUE/FALSE) |
| docId | string | Google Docs 문서 ID |
| thumbnail | string | 대표 이미지 URL |
| summary | string | 기사 요약 (카드용, 2~3줄) |

### 7-4. 구독자 Sheets 컬럼

| 컬럼 | 타입 | 설명 |
|------|------|------|
| email | string | 구독자 이메일 |
| subscribedAt | datetime | 구독 신청 일시 |
| source | string | 유입 페이지 (홈/기사상세 등) |

---

## 8. 데이터 흐름

### 콘텐츠 발행 플로우
```
[Publisher/기자]
    ↓ Google Docs에서 기사 작성
    ↓ Google Sheets에 메타데이터 입력 (published=TRUE 설정)
[Google Drive]
    ↓ Google Drive API + Sheets API
[Next.js ISR 빌드] → revalidate: 60초
    ↓
[AWS Amplify (CloudFront CDN)]
    ↓
[독자 — bara-new.kr]
```

### 구독 플로우
```
[독자] → 이메일 입력 → SubscribeForm
       ↓ Server Action (Next.js API)
[Google Sheets "subscribers" 시트] ← email, subscribedAt, source 저장
```

---

## 9. 디자인 방향

> 상세 디자인은 `/pdca design bara-news-mvp` 단계에서 DESIGN.md로 정의

### 핵심 원칙 (미리 확정)
- **배경**: 세이지 캔버스 `#e8ebe6` — 잡지 느낌의 차분한 전체 배경
- **카드**: 흰색 `#ffffff` + `rounded-xl` (24px)
- **헤드라인**: Pretendard weight 900, lighter 금지
- **액센트**: 디자이너 확정 예정

### 반응형 그리드
- 데스크톱: 기사 3열 → 태블릿: 2열 → 모바일: 1열
- 컨테이너 최대 너비: 1200px

---

## 10. 개발 규칙

- TypeScript strict mode, `any` 금지
- 컴포넌트: 함수형 (React FC)
- CSS: Tailwind 클래스만 사용 (인라인 style 금지)
- 환경 변수: `process.env.NEXT_PUBLIC_*` 패턴

---

## 11. PDCA 상태

| 단계 | 상태 | 비고 |
|------|------|------|
| Plan | ✅ 완료 | 이 문서 |
| Design | ⬜ 대기 | `/pdca design bara-news-mvp` |
| Do | ⬜ 대기 | |
| Analyze | ⬜ 대기 | |
| Report | ⬜ 대기 | |

---

## 12. 브레인스토밍 로그 (Phase 1~4 결정 사항)

| 결정 | 선택 | 이유 |
|------|------|------|
| 플래닝 방식 | AI 팀 기반 전면 재기획 | 확장된 팀 구조 반영 필요 |
| 독자 타깃 | 종사자 + 일반 시민 + 기관 | 학부모보다 전문 독자층 우선 |
| 성공 기준 | 구독자 DB 확보 | 독자 관계 자산 구축 |
| CMS 방식 | Google Drive (변경 없음) | 비개발자 팀 친숙도, 비용 0 |
| 구독 DB | Google Sheets (자체 보유) | 외부 서비스 불필요, 즉시 접근 |
| About 페이지 | 제거 → ylia.io 링크 | 불필요한 페이지 제거 (YAGNI) |
| 도메인 | bara-new.kr | 확정 도메인 |
| SNS 공유 | v2 연기 | MVP 범위 초과 |
