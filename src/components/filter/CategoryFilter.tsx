"use client";

import type { Category } from "@/types/article";

const CATEGORIES: Array<{ label: string; value: string }> = [
  { label: "전체", value: "전체" },
  { label: "IT", value: "IT" },
  { label: "교육", value: "교육" },
  { label: "문화예술", value: "문화예술" },
  { label: "종교", value: "종교" },
  { label: "상생", value: "상생" },
];

const CATEGORY_ACTIVE_COLORS: Record<string, string> = {
  전체: "border-[var(--color-ink)] text-[var(--color-ink)]",
  IT: "border-[var(--color-cat-it)] text-[var(--color-cat-it)]",
  교육: "border-[var(--color-cat-education)] text-[var(--color-cat-education)]",
  문화예술: "border-[var(--color-cat-culture)] text-[var(--color-cat-culture)]",
  종교: "border-[var(--color-cat-religion)] text-[var(--color-cat-religion)]",
  상생: "border-[var(--color-cat-sangsaeng)] text-[var(--color-cat-sangsaeng)]",
};

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ label, value }) => {
        const isActive = selected === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors cursor-pointer
              ${isActive
                ? CATEGORY_ACTIVE_COLORS[value]
                : "border-transparent text-[var(--color-mute)] hover:text-[var(--color-body)] hover:border-[var(--color-border)]"
              }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
