import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // TODO: 여기서 실제 저장처로 보내면 됩니다.
  // 옵션 A) 구글시트(Apps Script 웹앱)로 fetch
  // 옵션 B) Vercel KV / Supabase / Firebase 등에 저장
  // 옵션 C) 사내 서버로 전달

  console.log("SUBMIT:", body);

  return NextResponse.json({ ok: true });
}
