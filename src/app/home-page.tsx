"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleGrid from "@/components/article/ArticleGrid";
import CategoryFilter from "@/components/filter/CategoryFilter";
import SubscribeForm from "@/components/subscribe/SubscribeForm";
import type { ArticleListItem } from "@/types/article";

export default function HomePage({ articles }: { articles: ArticleListItem[] }) {
  const [category, setCategory] = useState("전체");
  const filtered =
    category === "전체"
      ? articles
      : articles.filter((a) => a.category === category);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-canvas-soft)]">
      <Header />

      <main className="flex-1 w-full px-6 md:px-16 lg:px-[120px] py-8 flex flex-col gap-8">
        <section>
          <h1 className="text-2xl md:text-3xl font-black text-[var(--color-ink)] mb-4">
            최신 기사
          </h1>
          <CategoryFilter selected={category} onChange={setCategory} />
        </section>

        <ArticleGrid articles={filtered} />

        <SubscribeForm source="home" />
      </main>

      <Footer />
    </div>
  );
}
