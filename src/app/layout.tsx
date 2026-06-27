import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "바라 뉴스",
  description:
    "IT·교육·문화예술·종교·상생 분야의 소망을 담은 이야기. 주식회사 일리아가 운영하는 온라인 신문 바라뉴스입니다.",
  keywords: ["IT", "교육", "문화예술", "종교", "상생", "바라뉴스", "온라인신문", "일리아"],
  openGraph: {
    title: "바라 뉴스",
    description: "IT·교육·문화예술·종교·상생 분야의 소망을 담은 이야기",
    url: "https://bara-new.kr",
    siteName: "바라 뉴스",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
