import Link from "next/link";
import Image from "next/image";
import type { ArticleListItem, Category } from "@/types/article";

const CATEGORY_COLORS: Record<Category, string> = {
  IT: "bg-[var(--color-cat-it)]",
  교육: "bg-[var(--color-cat-education)]",
  문화예술: "bg-[var(--color-cat-culture)]",
  종교: "bg-[var(--color-cat-religion)]",
  상생: "bg-[var(--color-cat-sangsaeng)]",
};

export default function ArticleCard({ article }: { article: ArticleListItem }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block rounded-xl bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md no-underline"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={article.thumbnail || "https://picsum.photos/seed/default/800/450"}
          alt={article.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <span
          className={`self-start px-2 py-0.5 rounded text-xs font-semibold text-white ${CATEGORY_COLORS[article.category]}`}
        >
          {article.category}
        </span>

        <h3 className="text-base font-bold text-[var(--color-ink)] leading-snug line-clamp-2 m-0">
          {article.title}
        </h3>

        <p className="text-sm text-[var(--color-body)] leading-relaxed line-clamp-2 m-0">
          {article.summary}
        </p>

        <span className="text-xs text-[var(--color-mute)]">
          {article.publishedAt}
        </span>
      </div>
    </Link>
  );
}
