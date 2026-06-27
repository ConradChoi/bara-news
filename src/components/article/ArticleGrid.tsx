import type { ArticleListItem } from "@/types/article";
import ArticleCard from "./ArticleCard";

export default function ArticleGrid({ articles }: { articles: ArticleListItem[] }) {
  if (articles.length === 0) {
    return (
      <div className="py-16 text-center text-[var(--color-mute)]">
        <p className="text-lg">아직 등록된 기사가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
