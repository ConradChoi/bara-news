"use client";

import Link from "next/link";

type HeaderProps = {
  /** 홈/교육/문화예술 네비게이션 표시 여부. Coming Soon 등에서는 false */
  showNav?: boolean;
};

export default function Header({ showNav = true }: HeaderProps) {
  return (
    <header
      className="relative z-10 w-full flex items-center justify-between px-6 md:px-16 lg:px-[120px]"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8e0",
        height: 64,
      }}
    >
      <Link
        href="/"
        className="font-bold"
        style={{ fontSize: 20, color: "#0e0f0c", textDecoration: "none" }}
      >
        BARA NEWS
      </Link>

      {showNav && (
        <nav>
          <ul className="flex gap-6" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {[
              { label: "홈", href: "/" },
              { label: "교육", href: "/category/교육" },
              { label: "문화예술", href: "/category/문화예술" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#454745",
                    textDecoration: "none",
                    transition: "color 150ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#0e0f0c")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#454745")}
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
