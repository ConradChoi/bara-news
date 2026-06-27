"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full px-6 md:px-16 lg:px-[120px] py-8 bg-[var(--color-footer)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-base font-bold text-white">BARA NEWS</span>
          <span className="text-[13px] text-[var(--color-mute)]">
            IT·교육·문화예술·종교·상생 전문 온라인 신문
          </span>
          <span className="text-xs text-[var(--color-mute)]">
            &copy; {year} 주식회사 일리아. All rights reserved.
          </span>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1">
          <span className="text-xs text-[var(--color-mute)]">운영사</span>
          <a
            href="https://ylia.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-white no-underline hover:underline"
          >
            ylia.io &rarr;
          </a>
        </div>
      </div>
    </footer>
  );
}
