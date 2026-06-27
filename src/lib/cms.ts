import { google } from "googleapis";
import type { Article, ArticleListItem, Category } from "@/types/article";

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) return null;

  try {
    const credentials = JSON.parse(key);
    if (!credentials.client_email || !credentials.private_key) return null;
    return new google.auth.GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });
  } catch {
    return null;
  }
}

function rowToArticleListItem(row: string[]): ArticleListItem | null {
  const [slug, title, category, author, publishedAt, published, , thumbnail, summary] = row;
  if (published?.toUpperCase() !== "TRUE") return null;
  if (!slug || !title) return null;

  return {
    slug,
    title,
    category: category as Category,
    author: author || "바라뉴스",
    publishedAt: publishedAt || new Date().toISOString().slice(0, 10),
    published: true,
    thumbnail: thumbnail || "",
    summary: summary || "",
  };
}

async function fetchSheetRows(): Promise<string[][]> {
  const auth = getAuth();
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  if (!auth || !sheetId) return [];

  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "articles!A2:I",
  });

  return (res.data.values as string[][]) || [];
}

export async function getArticles(category?: Category): Promise<ArticleListItem[]> {
  const rows = await fetchSheetRows();
  if (rows.length === 0) return getMockArticles(category);

  const articles = rows
    .map(rowToArticleListItem)
    .filter((a): a is ArticleListItem => a !== null);

  const filtered = category
    ? articles.filter((a) => a.category === category)
    : articles;

  return filtered.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getArticlesByCategory(category: Category): Promise<ArticleListItem[]> {
  return getArticles(category);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const rows = await fetchSheetRows();

  if (rows.length === 0) {
    const mock = getMockArticles().find((a) => a.slug === slug);
    if (!mock) return null;
    return { ...mock, docId: "", content: getMockContent(mock.title) };
  }

  const row = rows.find((r) => r[0] === slug && r[5]?.toUpperCase() === "TRUE");
  if (!row) return null;

  const [, title, category, author, publishedAt, , docId, thumbnail, summary] = row;

  let content = "";
  if (docId) {
    try {
      content = await fetchDocContent(docId);
    } catch (err) {
      console.error(`[cms] Google Docs 본문 로드 실패 (docId: ${docId})`, err);
      content = "<p>내용을 불러올 수 없습니다.</p>";
    }
  }

  return {
    slug,
    title,
    category: category as Category,
    author: author || "바라뉴스",
    publishedAt: publishedAt || new Date().toISOString().slice(0, 10),
    published: true,
    docId: docId || "",
    thumbnail: thumbnail || "",
    summary: summary || "",
    content,
  };
}

async function fetchDocContent(docId: string): Promise<string> {
  const auth = getAuth();
  if (!auth) return "<p>내용을 불러올 수 없습니다.</p>";

  const drive = google.drive({ version: "v3", auth });
  const res = await drive.files.export({
    fileId: docId,
    mimeType: "text/html",
  });

  return res.data as string;
}

// --- Mock Data (개발용, Google API 미설정 시 사용) ---

const MOCK_ARTICLES: ArticleListItem[] = [
  {
    slug: "ai-startup-trend-2026",
    title: "2026년 AI 스타트업 투자 트렌드, 어디로 향하나",
    category: "IT",
    author: "김테크",
    publishedAt: "2026-06-20",
    published: true,
    thumbnail: "https://picsum.photos/seed/it1/800/450",
    summary: "생성형 AI를 넘어 에이전트 AI로 이동하는 글로벌 투자 흐름과 국내 스타트업 생태계의 변화를 분석합니다.",
  },
  {
    slug: "cloud-native-security",
    title: "클라우드 네이티브 보안, 기업이 놓치는 5가지",
    category: "IT",
    author: "박클라우드",
    publishedAt: "2026-06-18",
    published: true,
    thumbnail: "https://picsum.photos/seed/it2/800/450",
    summary: "컨테이너·서버리스 환경에서 발생하는 보안 사각지대와 대응 전략을 정리했습니다.",
  },
  {
    slug: "education-ai-classroom",
    title: "AI 튜터가 교실에 들어오다 — 교사의 역할은?",
    category: "교육",
    author: "이러닝",
    publishedAt: "2026-06-19",
    published: true,
    thumbnail: "https://picsum.photos/seed/edu1/800/450",
    summary: "개인 맞춤형 AI 튜터 도입 학교의 현장 사례와 교사 역할 변화를 취재했습니다.",
  },
  {
    slug: "digital-literacy-gap",
    title: "디지털 리터러시 격차, 교육 현장의 과제",
    category: "교육",
    author: "최교육",
    publishedAt: "2026-06-15",
    published: true,
    thumbnail: "https://picsum.photos/seed/edu2/800/450",
    summary: "도시와 농촌 간 디지털 교육 인프라 격차 실태와 해결 방안을 모색합니다.",
  },
  {
    slug: "immersive-art-exhibition",
    title: "몰입형 미디어아트, 관객 경험을 재정의하다",
    category: "문화예술",
    author: "정아트",
    publishedAt: "2026-06-17",
    published: true,
    thumbnail: "https://picsum.photos/seed/cul1/800/450",
    summary: "디지털 기술과 예술의 융합이 만드는 새로운 전시 경험을 조명합니다.",
  },
  {
    slug: "local-culture-revival",
    title: "지역 문화 콘텐츠 부활, 로컬 크리에이터의 시대",
    category: "문화예술",
    author: "한문화",
    publishedAt: "2026-06-12",
    published: true,
    thumbnail: "https://picsum.photos/seed/cul2/800/450",
    summary: "지방소멸 위기 속에서 문화 콘텐츠로 지역을 살리는 크리에이터들의 이야기.",
  },
  {
    slug: "interfaith-dialogue-peace",
    title: "종교 간 대화, 평화의 다리를 놓다",
    category: "종교",
    author: "오평화",
    publishedAt: "2026-06-16",
    published: true,
    thumbnail: "https://picsum.photos/seed/rel1/800/450",
    summary: "다종교 사회에서 상호 이해와 평화를 위한 종교 간 대화 사례를 소개합니다.",
  },
  {
    slug: "youth-spiritual-wellness",
    title: "MZ세대의 영성 탐구, 새로운 흐름을 읽다",
    category: "종교",
    author: "윤영성",
    publishedAt: "2026-06-10",
    published: true,
    thumbnail: "https://picsum.photos/seed/rel2/800/450",
    summary: "전통 종교를 넘어 명상·요가·커뮤니티로 영성을 찾는 젊은 세대의 트렌드.",
  },
  {
    slug: "social-enterprise-growth",
    title: "소셜 임팩트 투자, 상생 경제의 새 지평",
    category: "상생",
    author: "강상생",
    publishedAt: "2026-06-14",
    published: true,
    thumbnail: "https://picsum.photos/seed/sang1/800/450",
    summary: "사회적 기업과 임팩트 투자가 만드는 지속 가능한 상생 경제 모델을 분석합니다.",
  },
  {
    slug: "cooperative-platform-economy",
    title: "플랫폼 협동조합, 독점을 넘는 대안 경제",
    category: "상생",
    author: "마협동",
    publishedAt: "2026-06-08",
    published: true,
    thumbnail: "https://picsum.photos/seed/sang2/800/450",
    summary: "글로벌 플랫폼 독점에 대항하는 협동조합형 플랫폼 비즈니스를 취재했습니다.",
  },
];

function getMockArticles(category?: Category): ArticleListItem[] {
  const filtered = category
    ? MOCK_ARTICLES.filter((a) => a.category === category)
    : MOCK_ARTICLES;
  return filtered.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

function getMockContent(title: string): string {
  return `
    <h2>${title}</h2>
    <p>이 기사는 개발 환경에서 표시되는 샘플 콘텐츠입니다. 실제 Google Docs 연동 후 기사 본문이 표시됩니다.</p>
    <p>바라뉴스는 IT·교육·문화예술·종교·상생 분야의 소망을 담은 이야기를 전합니다. 주식회사 일리아가 운영하는 온라인 신문으로, 양질의 전문 콘텐츠를 독자에게 제공하는 것을 목표로 합니다.</p>
    <h3>주요 내용</h3>
    <p>각 분야 전문가의 깊이 있는 분석과 현장 취재를 통해 독자에게 가치 있는 정보를 전달합니다. 바라(בָּרָא)는 히브리어로 '창조, 소망, 기대'를 의미하며, 새로운 가치를 창조하는 미디어를 지향합니다.</p>
    <blockquote>"좋은 저널리즘은 사회의 거울이자 나침반입니다."</blockquote>
    <p>바라뉴스는 신뢰할 수 있는 전문 미디어로서, 독자와 함께 성장하는 플랫폼이 되겠습니다.</p>
  `.trim();
}
