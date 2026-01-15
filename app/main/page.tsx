"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getStampMeta } from "../../lib/stampMeta";

type StampState = Record<number, { at: string }>;

const TOTAL = 7;
const STORAGE_KEY = "energy_highway_stamp_state_v1";

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
  window.location.href = `/stamp/${n}`;
}

export default function MainPage() {
  const [state, setState] = useState<StampState>({});
  const done = useMemo(() => countDone(state), [state]);
  const isComplete = done === TOTAL;

  useEffect(() => {
    setState(loadState());
  }, []);

  // state가 바뀔 때마다 저장 (스탬프 진행상황 유지)
  useEffect(() => {
    saveState(state);
  }, [state]);

  const barW = Math.round((done / TOTAL) * 100);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isComplete) return;

    const fd = new FormData(e.currentTarget);
    const payload: any = {
      company: fd.get("company"),
      name: fd.get("name"),
      title: fd.get("title"),
      phone: fd.get("phone"),
      email: fd.get("email"),
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
            에너지고속도로를 달리며,<br />전력산업의 패러다임을 바꾸다
          </h1>
          <p className="p">
            전시장 곳곳의 QR을 스캔해 7개 스탬프를 모아주세요.
            미션을 완주하면 이벤트 존에서 선물을 드립니다.
          </p>

          <div className="ctaRow">
            <a className="btn btnPrimary" href="#stamp">스탬프 투어 시작</a>
            <a className="btn" href="#story">테마 스토리 보기</a>
          </div>
        </div>
      </div>

      <div id="story" className="section">
        <div className="container">
          <div className="card">
            <div className="cardInner">
              <div style={{ fontWeight: 900, marg주했습니다.<br />
                    아래 정보를 입력하면 스탬프 투어가 완료됩니다.
                  </div>
                  <div className="lane" aria-hidden="true" />
                </div>
              )}

              <form className="form" onSubmit={submit}>
                <div className="label">소속
                  <input className="input" name="company" required placeholder="예: LS ELECTRIC" disabled={!isComplete}/>
                </div>
                <div className="label">이름
                  <input className="input" name="name" required placeholder="예: 홍길동" disabled={!isComplete}/>
                </div>
                <div className="label">직책
                  <input className="input" name="title" required placeholder="예: 매니저 / 과장 / 책임" disabled={!isComplete}/>
                </div>
                <div className="label">핸드폰번호
                  <input className="input" name="phone" required placeholder="010-1234-5678" inputMode="tel" disabled={!isComplete}/>
                </div>
                <div className="label">이메일주소
                  <input className="input" name="email" required placeholder="name@company.com" inputMode="email" disabled={!isComplete}/>
                </div>

                <button className="btn btnPrimary" type="submit" disabled={!isComplete}>
                  제출
                </button>

                <div className="small">
                  · 스탬프는 이 기기(브라우저)에 저장됩니다. 다른 기기에서는 진행 현황이 이어지지 않습니다.<br/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingBottom: 60 }}>
        <div className="container" style={{ color: "rgba(169,183,209,.92)", fontSize: 12, lineHeight: 1.7 }}>
          © LS ELECTRIC — Driving the Energy Highway (Stamp Tour Event)
        </div>
      </div>
    </>
  );
}
