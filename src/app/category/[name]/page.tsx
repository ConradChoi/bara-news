import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleGrid from "@/components/article/ArticleGrid";
import { getArticlesByCategory } from "@/lib/cms";
import type { Category } from "@/types/article";

export const revalidate = 60;

const VALID_CATEGORIES: Category[] = ["IT", "교육", "문화예술", "종교", "상생"];

const CATEGORY_TITLES: Record<Category, string> = {
  IT: "IT 기사",
  교육: "교육 기사",
  문화예술: "문화예술 기사",
  종교: "종교 기사",
  상생: "상생 기사",
};

export function generateStaticParams() {
  return VALID_CATEGORIES.map((name) => ({ name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const title = CATEGORY_TITLES[decoded as Category] || decoded;
  return {
    title: `${title} — 바라 뉴스`,
    description: `바라뉴스 ${decoded} 분야의 최신 기사를 확인하세요.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decoded = decodeURIComponent(name) as Category;

  if (!VALID_CATEGORIES.includes(decoded)) notFound();

  const articles = await getArticlesByCategory(decoded);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas-soft)]">
      <Header />

      <main className="flex-1 w-full px-6 md:px-16 lg:px-[120px] py-8">
        <h1 className="text-2xl md:text-3xl font-black text-[var(--color-ink)] mb-6">
          {CATEGORY_TITLES[decoded]}
        </h1>

        <ArticleGrid articles={articles} />
      </main>

      <Footer />
    </div>
  );
}
