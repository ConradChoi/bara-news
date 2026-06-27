"use client";

import Link from "next/link";

type HeaderProps = {
  showNav?: boolean;
};

const NAV_ITEMS = [
  { label: "홈", href: "/" },
  { label: "IT", href: "/category/IT" },
  { label: "교육", href: "/category/교육" },
  { label: "문화예술", href: "/category/문화예술" },
  { label: "종교", href: "/category/종교" },
  { label: "상생", href: "/category/상생" },
];

export default function Header({ showNav = true }: HeaderProps) {
  return (
    <header className="relative z-10 w-full flex items-center justify-between px-6 md:px-16 lg:px-[120px] h-16 bg-[var(--color-canvas)] border-b border-[var(--color-border)]">
      <Link
        href="/"
        className="text-xl font-bold text-[var(--color-ink)] no-underline"
      >
        BARA NEWS
      </Link>

      {showNav && (
        <nav>
          <ul className="flex gap-6 list-none m-0 p-0">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm font-medium text-[var(--color-body)] no-underline transition-colors hover:text-[var(--color-ink)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
