# 바라뉴스 (Bara News) — CLAUDE.md

> Claude Code가 이 프로젝트에서 작업할 때 반드시 먼저 읽어야 할 컨텍스트 문서입니다.

---

## ⚠️ 작업 시작 전 필독 파일 목록

> **규칙**: 아래 파일들은 Claude Code가 자동으로 읽지 않습니다.  
> **모든 작업 전** 해당 파일을 Read 도구로 직접 열어 확인한 후 작업을 시작하세요.

### 항상 읽어야 할 파일

| 우선순위 | 파일 | 목적 | 업데이트 시점 |
|----------|------|------|--------------|
| 1 | `CLAUDE.md` ← 지금 이 파일 | 프로젝트 전체 컨텍스트 | 결정사항 변경 시 |
| 2 | `DESIGN.md` | 디자인 토큰, 색상, 타이포, 컴포넌트 명세 | 디자인 확정 시 (미생성) |

### Plan 문서 (기능별)

| 파일 | 기능 | 상태 |
|------|------|------|
| `docs/01-plan/features/bara-news-mvp.plan.md` | 바라뉴스 MVP 전체 기획 (Plan Plus 기반) | ✅ 완료 |

### Design 문서 (기능별)

| 파일 | 기능 | 상태 |
|------|------|------|
| `docs/02-design/features/bara-news-mvp.design.md` | 바라뉴스 MVP 전체 설계 (Option C: Pragmatic) | ✅ 완료 |

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **서비스명** | 바라뉴스 (Bara News) |
| **운영사** | 주식회사 일리아 |
| **브랜드 의미** | 바라 = 히브리어로 '소망, 기대' |
| **서비스 유형** | 온라인 신문 (교육 / 문화·예술 특화) |
| **도메인** | bara-new.kr |
| **개발 레벨** | Dynamic (bkit 기준) |

### 타깃 독자
교육·문화예술 종사자 / 일반 시민 / 관련 기관·단체

---

## 2. AI 팀 구성

| 역할 | 주요 업무 |
|------|-----------|
| Product Owner (PO) | 우선순위 결정, 최종 승인 |
| Project Manager (PM) | 일정·이슈 관리, GitHub Issues |
| Service Planner | 요건 정의, 콘텐츠 전략 |
| UX Writer | UI 카피, 버튼 레이블, 에러 메시지 |
| Researcher | 독자 조사, 경쟁사 분석, SEO 키워드 |
| Marketer | SEO 전략, 채널 운영, 독자 유치 |
| UI/UX Designer | Figma, 컴포넌트 가이드 |
| Publisher | Google Drive CMS 기사 발행 |
| Developer | Next.js 구현, API 연동 |
| QA | 기능·크로스브라우저 테스트 |

---

## 3. 기술 스택 (확정)

| 레이어 | 기술 | 비고 |
|--------|------|------|
| **프레임워크** | Next.js (App Router) | SSG/ISR, SEO 최적화 |
| **언어** | TypeScript | strict mode, `any` 금지 |
| **스타일링** | Tailwind CSS | 인라인 style 금지 |
| **폰트** | Pretendard (한국어) + Inter (영문) | |
| **CMS** | Google Drive API + Sheets API | 기사 본문 + 메타데이터 |
| **구독 DB** | Google Sheets API | Server Action으로 구독자 저장 |
| **배포** | AWS Amplify | CloudFront CDN, CI/CD 내장 |

---

## 4. MVP v1 기능 범위

### 포함 (v1)
- 메인 기사 목록 (홈) — 최신 기사 카드 그리드 + 카테고리 필터
- 기사 상세 페이지 — 제목, 본문, 이미지, 날짜, 기자명
- 구독 신청 폼 — 이메일 → Google Sheets 구독자 DB 저장
- 반응형 디자인 — 모바일/태블릿/데스크톱 완전 대응 (필수)

### 제외 (v2 이후)
- SNS 공유 버튼
- 검색 기능
- 뉴스레터 자동 발송
- 관리자 페이지 (CMS 대체: Google Drive)
- 댓글/반응 기능
- 광고 배너

---

## 5. 아키텍처

### 페이지 구조
```
/                    → 메인 (기사 목록 + 카테고리 필터 + 구독 폼)
/articles/[slug]     → 기사 상세
/category/[name]     → 카테고리별 목록 (교육 / 문화예술)
(About 페이지 없음 → Footer에 ylia.io 링크)
```

### 컴포넌트 구조
```
components/
├── layout/
│   ├── Header.tsx        → 바라뉴스 로고 + 네비게이션
│   └── Footer.tsx        → 저작권 + 연락처 + ylia.io 링크
├── article/
│   ├── ArticleCard.tsx   → 썸네일, 제목, 요약, 날짜, 카테고리 뱃지
│   └── ArticleBody.tsx   → Google Docs 본문 렌더링
├── filter/
│   └── CategoryFilter.tsx
└── subscribe/
    └── SubscribeForm.tsx → 이메일 구독 신청 → Google Sheets

lib/
├── cms.ts                → Google Drive API + Sheets API
└── subscribe.ts          → 구독자 저장 Server Action
```

### 데이터 흐름
```
[Publisher] → Google Docs 기사 작성
            → Google Sheets 메타데이터 입력 (published=TRUE)
                ↓ ISR (revalidate: 60초)
[Next.js] → AWS Amplify (CloudFront)
                ↓
[독자 — bara-new.kr]

[구독 플로우]
독자 이메일 → SubscribeForm → Server Action → Google Sheets "subscribers"
```

---

## 6. 디자인 시스템

> 상세: `DESIGN.md` (Design 단계에서 작성 예정)

### 핵심 원칙
- **배경**: 세이지 캔버스 `#e8ebe6`
- **카드**: 흰색 `#ffffff` + `rounded-xl`
- **헤드라인**: Pretendard weight 900 (lighter 금지)
- **액센트 컬러**: 디자이너 확정 예정

---

## 7. 개발 규칙

- TypeScript strict mode, `any` 금지
- 컴포넌트: 함수형 (React FC)
- CSS: Tailwind 클래스만 사용 (인라인 style 금지)
- 환경 변수: `process.env.NEXT_PUBLIC_*` 패턴

---

## 8. PDCA 상태

| 단계 | 상태 | 파일 |
|------|------|------|
| Plan | ✅ 완료 | `docs/01-plan/features/bara-news-mvp.plan.md` |
| Design | ✅ 완료 | `docs/02-design/features/bara-news-mvp.design.md` |
| Do | ⬜ 대기 | — |
| Analyze | ⬜ 대기 | — |
| Report | ⬜ 대기 | — |

---

## 9. 주요 결정 사항 (변경 금지)

| 결정 | 내용 | 변경 불가 이유 |
|------|------|--------------|
| 서비스명 | 바라뉴스 | 브랜드 확정 |
| 도메인 | bara-new.kr | 도메인 확정 |
| 배포 플랫폼 | AWS Amplify | 인프라 일원화 |
| CMS | Google Drive + Sheets | 팀 친숙도, 비용 0 |
| 구독 DB | Google Sheets (자체 보유) | 외부 서비스 불필요 |
| 개발 방식 | Next.js SSG/ISR | SEO + 속도 우선 |
| 폰트 | Pretendard + Inter | 한국어 최적화 |
| About 페이지 | 없음 (Footer → ylia.io) | YAGNI 적용 |

---

## 10. CLAUDE.md 유지보수 규칙

1. **Plan 문서 생성 시** → 상단 "Plan 문서" 테이블 업데이트
2. **Design 문서 생성 시** → 상단 "Design 문서" 테이블 업데이트
3. **기술 스택 변경 시** → 섹션 3, 5, 9 동시 업데이트

| 표기 | 의미 |
|------|------|
| ✅ 완료 | 문서 작성 및 승인 완료 |
| 🔄 작성 중 | 현재 작업 진행 중 |
| ⬜ 대기 | 아직 시작 전 |
