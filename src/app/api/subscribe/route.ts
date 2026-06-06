import { NextRequest, NextResponse } from "next/server";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const source: string = (body.source ?? "coming-soon").trim();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 주소를 입력해 주세요." },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      console.error("[subscribe] GOOGLE_SCRIPT_URL 환경변수가 없습니다.");
      return NextResponse.json(
        { error: "서버 설정 오류입니다. 잠시 후 다시 시도해 주세요." },
        { status: 500 }
      );
    }

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });

    const data = await res.json();

    if (data.status === 409) {
      return NextResponse.json(
        { error: data.error },
        { status: 409 }
      );
    }

    if (!data.ok) {
      return NextResponse.json(
        { error: data.error ?? "오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
