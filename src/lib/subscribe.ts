import { google } from "googleapis";
import type { SubscribeResponse } from "@/types/subscriber";

function getAuth() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) return null;

  try {
    const credentials = JSON.parse(key);
    if (!credentials.client_email || !credentials.private_key) return null;
    return new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  } catch {
    return null;
  }
}

export async function addSubscriber(
  email: string,
  source: string
): Promise<SubscribeResponse> {
  const auth = getAuth();
  const sheetId = process.env.GOOGLE_SUBSCRIBE_SHEETS_ID;

  if (!auth || !sheetId) {
    console.warn("[subscribe] Google Sheets 미설정 — 구독 저장 건너뜀");
    return { success: true, message: "구독 신청이 완료되었습니다. (개발 모드)" };
  }

  const sheets = google.sheets({ version: "v4", auth });

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "subscribers!A:A",
  });

  const emails = (existing.data.values || []).flat();
  if (emails.includes(email)) {
    return { success: false, message: "이미 구독 중인 이메일입니다." };
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "subscribers!A:C",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[email, new Date().toISOString(), source]],
    },
  });

  return { success: true, message: "구독 신청이 완료되었습니다." };
}
