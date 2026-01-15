"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getStampMeta } from "../../lib/stampMeta";

type StampState = Record<number, { at: string }>;

const TOTAL = 7;
const STORAGE_KEY = "energy_highway_stamp_state_v1";

/** stampMeta.ts가 무엇을 반환하든 빌드가 깨지지 않게 안전하게 감싸는 타입 */
type SafeMeta = {
  label: string;
  iconPath?: string; // /public 아래 경로를 권장: "/icons/1.svg" 등
};

function safeGetStampMeta(n: number): SafeMeta {
  try {
    const m: any = getStampMeta(n);
    return {
      label: typeof m?.label === "string" ? m.label : `스탬프 ${n}`,
      iconPath: typeof m?.iconPath === "string" ? m.iconPath : undefined
    };
  } catch {
    return { label: `스탬프 ${n}` };
  }
}

function loadState(): StampState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as StampState;
    return {};
  } catch {
    return {};
  }
}

function saveState(state: StampState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function resetStamps() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function countDone(state: StampState) {
  return Object.keys(state).length;
}

function openScanner(n: number) {
  // 스탬프 클릭 시 해당 스캔 페이지로 이동
  if (typeof window === "undefined") return;
  window.location.href = `/stamp/${n}`;
}

export default function MainPage() {
  const [state, setState] = useState<StampState>({});

  // 초기 로드
  useEffect(() => {
    setState(loadState());
  }, []);

  // 저장
  useEffect(() => {
    saveState(state);
  }, [state]);

  const done = useMemo(() => countDone(state), [state]);
  const isComplete = done === TOTAL;
  const barW = Math.round((done / TOTAL) * 100);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isComplete) return;

    const fd = new FormData(e.currentTarget);
    const payload = {
      company: String(fd.get("company") ?? ""),
      name: String(fd.get("name") ?? ""),
      title: String(fd.get("title") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      stamp_state: JSON.stringify(state),
      completed_at: new Date().toISOString()
    };

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("응모가 완료되었습니다!");
      e.currentTarget.reset();
    } else {
      alert("제출에 실패했습니다. 운영자에게 문의해주세요.");
    }
  }

  return (
    <>
      <div className="heroWrap">
        <div className="streaks" aria-hidden="true" />
        <div className="container">
          <div className="badge">
            <span className="dot" />
            <span style={{ fontWeight: 900, letterSpacing: "-.2px" }}>EVENT</span>
            <span style={{ color: "rgba(233,242,255,.78)", fontSize: 12 }}>
              Driving the energy highway
            </span>
          </div>

          <h1 className="h1">
            에너지고속도로를 달리며,<br />
            전력산업의 패러다임을 바꾸다
          </h1>
          <p className="p">
            전시장 곳곳의 QR을 스캔해 7개 스탬프를 모아주세요.
            미션을 완주하면 이벤트 존에서 선물을 드립니다.
          </p>

          <div className="ctaRow">
            <a className="btn btnPrimary" href="#stamp">
              스탬프 투어 시작
            </a>
            <a className="btn" href="#story">
              테마 스토리 보기
            </a>
          </div>
        </div>
      </div>

      <div id="story" className="section">
        <div className="container">
          <div className="card">
            <div className="cardInner">
              <div style={{ fontWeight: 900, marginBottom: 8, letterSpacing: "-.2px" }}>THEME</div>
              <div style={{ color: "rgba(233,242,255,.9)", lineHeight: 1.65 }}>
                <b>Driving the energy highway</b> — 에너지고속도로를 달리며,
                전력 산업의 패러다임을 바꾸는 여정에 함께하세요.
              </div>
            </div>
