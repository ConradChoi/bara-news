"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;
      // text/plain → CORS pre-flight 없이 단순 요청으로 처리됨
      const res = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ email, source: "coming-soon" }),
      });
      const text = await res.text();
      const data = JSON.parse(text);

      if (data.status === 409) {
        setStatus("error");
        setMessage(data.error ?? "이미 구독 신청된 이메일입니다.");
      } else if (data.ok) {
        setStatus("success");
        setMessage("구독 신청이 완료되었습니다. 론칭 소식을 가장 먼저 보내드릴게요!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch {
      setStatus("error");
      setMessage("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: "#e8ebe6" }}>

      {/* 배경 장식 원 */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: "min(560px, 80vw)",
          height: "min(560px, 80vw)",
          borderRadius: "50%",
          background: "#c8d4c4",
          opacity: 0.35,
          top: -80,
          left: -180,
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          width: "min(380px, 60vw)",
          height: "min(380px, 60vw)",
          borderRadius: "50%",
          background: "#b8cbb4",
          opacity: 0.25,
          bottom: -80,
          right: -100,
          zIndex: 0,
        }}
      />

      <Header showNav={false} />

      {/* 중앙 콘텐츠 */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-12 gap-8">

        {/* COMING SOON 뱃지 */}
        <span
          className="inline-block font-semibold"
          style={{
            backgroundColor: "#16a34a",
            color: "#ffffff",
            borderRadius: 20,
            padding: "7px 16px",
            fontSize: 11,
            letterSpacing: "0.08em",
          }}
        >
          COMING SOON
        </span>

        {/* 메인 타이틀 */}
        <h1
          className="text-center font-extrabold"
          style={{
            fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
            lineHeight: 1.1,
            color: "#0e0f0c",
            letterSpacing: "-0.03em",
          }}
        >
          곧 만나요,
          <br />
          BARA NEWS
        </h1>

        {/* 서브타이틀 */}
        <p
          className="text-center"
          style={{
            fontSize: "clamp(14px, 4vw, 18px)",
            lineHeight: "1.7",
            color: "#454745",
          }}
        >
          교육과 문화예술의 소망을 담은 이야기
          <br />
          곧 여러분 곁에 찾아옵니다.
        </p>

        {/* 구독 신청 카드 */}
        <div
          className="w-full"
          style={{
            maxWidth: 520,
            backgroundColor: "#ffffff",
            borderRadius: 20,
            padding: "clamp(24px, 6vw, 40px) clamp(20px, 8vw, 48px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <h2
            className="text-center font-bold"
            style={{ fontSize: "clamp(15px, 4vw, 17px)", color: "#0e0f0c" }}
          >
            론칭 소식을 가장 먼저 받아보세요
          </h2>
          <p
            className="text-center"
            style={{ fontSize: 13, color: "#868685", lineHeight: "20px" }}
          >
            구독 신청하시면 오픈 알림과 첫 호 기사를
            <br />
            바로 보내드립니다.
          </p>

          {status !== "success" ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* 모바일: 세로 스택 / 데스크톱: 가로 배치 */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소를 입력해 주세요"
                  disabled={status === "loading"}
                  className="w-full sm:flex-1"
                  style={{
                    height: 50,
                    borderRadius: 12,
                    border: "1px solid #e2e8e0",
                    backgroundColor: "#e8ebe6",
                    padding: "0 16px",
                    fontSize: 14,
                    color: "#0e0f0c",
                    outline: "none",
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full sm:w-auto"
                  style={{
                    height: 50,
                    borderRadius: 12,
                    backgroundColor: status === "loading" ? "#86d3a0" : "#16a34a",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: 14,
                    padding: "0 24px",
                    border: "none",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    transition: "background-color 150ms",
                    whiteSpace: "nowrap",
                  }}
                >
                  {status === "loading" ? "신청 중…" : "알림 신청하기"}
                </button>
              </div>
              {status === "error" && (
                <p style={{ fontSize: 12, color: "#dc2626", textAlign: "center" }}>
                  {message}
                </p>
              )}
            </form>
          ) : (
            <p
              className="text-center font-medium"
              style={{ fontSize: 14, color: "#16a34a" }}
            >
              ✓ {message}
            </p>
          )}
        </div>

        {/* 수치 정보 */}
        <div className="flex items-center gap-6 md:gap-10">
          <InfoItem value="무료" label="구독 신청" />
          <div style={{ width: 1, height: 40, backgroundColor: "#e2e8e0", flexShrink: 0 }} />
          <InfoItem value="2026.08" label="첫 발행" />
          <div style={{ width: 1, height: 40, backgroundColor: "#e2e8e0", flexShrink: 0 }} />
          <InfoItem value="교육·문화" label="취재 분야" />
        </div>

        {/* 운영사 링크 */}
        <p style={{ fontSize: 13, color: "#868685" }}>
          주식회사 일리아{" "}
          <span style={{ color: "#868685" }}>·</span>{" "}
          <a
            href="https://ylia.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0e0f0c", fontWeight: 600, textDecoration: "none" }}
          >
            ylia.io →
          </a>
        </p>
      </main>
    </div>
  );
}

function InfoItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center" style={{ gap: 4 }}>
      <span
        className="font-extrabold text-center"
        style={{ fontSize: "clamp(18px, 5vw, 28px)", color: "#0e0f0c", lineHeight: 1.2 }}
      >
        {value}
      </span>
      <span style={{ fontSize: "clamp(11px, 3vw, 13px)", color: "#868685" }}>{label}</span>
    </div>
  );
}
