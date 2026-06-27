"use client";

import { useState, type FormEvent } from "react";

interface SubscribeFormProps {
  source?: string;
}

export default function SubscribeForm({ source = "home" }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("올바른 이메일 주소를 입력해 주세요.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message || "구독 신청이 완료되었습니다.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch {
      setStatus("error");
      setMessage("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <section className="w-full bg-[var(--color-footer)] rounded-2xl px-6 py-10 md:px-12 md:py-14">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          바라뉴스 소식을 이메일로 받아보세요
        </h2>
        <p className="text-sm text-[var(--color-mute)] mb-6">
          IT·교육·문화예술·종교·상생 분야의 소망을 담은 이야기를 전해드립니다.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle" && status !== "loading") setStatus("idle");
            }}
            placeholder="이메일 주소를 입력하세요"
            disabled={status === "loading"}
            className="flex-1 h-12 px-4 rounded-lg bg-white text-[var(--color-ink)] text-sm
              placeholder:text-[var(--color-mute)] outline-none
              focus:ring-2 focus:ring-[var(--color-accent)]
              disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="h-12 px-6 rounded-lg bg-[var(--color-accent)] text-white text-sm font-semibold
              hover:bg-[var(--color-accent-hover)] transition-colors
              disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
              whitespace-nowrap"
          >
            {status === "loading" ? "신청 중..." : "구독 신청"}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-sm text-emerald-400">{message}</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-400">{message}</p>
        )}
      </div>
    </section>
  );
}
