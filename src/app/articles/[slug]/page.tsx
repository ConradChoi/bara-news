import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleBody from "@/components/article/ArticleBody";
import SubscribeForm from "@/components/subscribe/SubscribeForm";
import { getArticleBySlug, getArticles } from "@/lib/cms";
import type { Category } from "@/types/article";

export const revalidate = 60;

const CATEGORY_COLORS: Record<Category, string> = {
  IT: "bg-[var(--color-cat-it)]",
  교육: "bg-[var(--color-cat-education)]",
  문화예술: "bg-[var(--color-cat-culture)]",
  종교: "bg-[var(--color-cat-religion)]",
  상생: "bg-[var(--color-cat-sangsaeng)]",
};

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "기사를 찾을 수 없습니다 — 바라 뉴스" };

  return {
    title: `${article.title} — 바라 뉴스`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.thumbnail ? [article.thumbnail] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas-soft)]">
      <Header />

      <main className="flex-1 w-full px-6 md:px-16 lg:px-[120px] py-8">
        <article className="max-w-3xl mx-auto">
          <span
            className={`inline-block px-3 py-1 rounded text-xs font-semibold text-white mb-4 ${CATEGORY_COLORS[article.category]}`}
          >
            {article.category}
          </span>

          <h1 className="text-3xl md:text-4xl font-black leading-tight text-[var(--color-ink)] mb-3">
            {article.title}
          </h1>

          <p className="text-sm text-[var(--color-mute)] mb-8">
            {article.author} · {article.publishedAt}
          </p>

          {article.thumbnail && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}

          {article.summary && (
            <div className="rounded-xl bg-[#F0F7FF] border border-[#D0E3F7] px-5 py-4 mb-8">
              <p className="text-xs font-semibold text-[#3B82F6] mb-1.5">AI 요약</p>
              <p className="text-sm text-[var(--color-body)] leading-relaxed m-0">
                {article.summary}
              </p>
            </div>
          )}

          {article.content && <ArticleBody content={article.content} />}
        </article>

        <div className="max-w-3xl mx-auto mt-12">
          <SubscribeForm source="article" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
