"use client";
import { getStampMeta } from "../../lib/stampMeta";
import { useEffect, useMemo, useState } from "react";
import { TOTAL, loadState, countDone, resetStamps } from "../../lib/stamps";

type FormData = {
  company: string;
  name: string;
  title: string;
  phone: string;
  email: string;
};

export default function MainPage() {
  const [state, setState] = useState<Record<number, { at: string }>>({});
  const done = useMemo(() => countDone(state), [state]);
  const isComplete = done === TOTAL;

  useEffect(() => {
    setState(loadState());
  }, []);

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
              <div style={{ fontWeight: 900, marginBottom: 8, letterSpacing: "-.2px" }}>
                THEME
              </div>
              <div style={{ color: "rgba(233,242,255,.9)", lineHeight: 1.65 }}>
                <b>Driving the energy highway</b> — 에너지고속도로를 달리며,
                전력 산업의 패러다임을 바꾸는 여정에 함께하세요.
                <br />
                (여기 섹션은 전시 콘텐츠에 맞춰 3~5개 카드로 확장하면 링크 사이트 느낌이 더 살아납니다)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="stamp" className="section">
        <div className="container">
          <div className="card">
            <div className="cardInner">
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontWeight: 900, letterSpacing: "-.2px" }}>STAMP TOUR</div>
                <div style={{ color: "rgba(233,242,255,.85)" }}>
                  진행: <b>{done}/{TOTAL}</b>
                </div>
              </div>

              <div className="progress" aria-label="progress">
                <div className="bar" style={{ width: `${barW}%` }} />
              </div>

              <div className="grid" aria-label="stamp grid">
  {Array.from({ length: TOTAL }).map((_, idx) => {
    const n = idx + 1;
    const ok = !!state[n];
    const meta = getStampMeta(n);

    return (
      <button
        key={n}
        type="button"
        className={`stamp ${ok ? "done" : ""}`}
        onClick={() => openScanner(n)}
        style={{ cursor: "pointer" }}
        aria-label={`${n}번 스탬프 스캔`}
      >
        <div className="num">#{n}</div>

        {/* 아이콘 */}
        <div
          className="stampIcon"
          dangerouslySetInnerHTML={{ __html: meta?.icon({ size: 22 }) ?? "" }}
        />

        {/* 라벨 */}
        <div className="stampLabel">{meta?.label ?? ""}</div>

        {/* 완료 체크 (원하면 위치/디자인 바꿔줄 수 있어) */}
        <div className="check">{ok ? "✓" : ""}</div>
      </button>
    );
  })}
</div>

              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <button
                  className="btn"
                  onClick={() => {
                    resetStamps();
                    setState(loadState());
                  }}
                >
                  초기화
                </button>
                <div style={{ color: "rgba(169,183,209,.92)", fontSize: 13, lineHeight: 1.6 }}>
                  QR은 <b>/stamp/1 ~ /stamp/7</b> 페이지로 연결하면 됩니다.
                </div>
              </div>

              {isComplete && (
                <div className="completeBanner" style={{ marginTop: 16 }}>
                  <div style={{ fontWeight: 1000, letterSpacing: "-.2px", fontSize: 18 }}>
                    완주! DRIVING THE ENERGY HIGHWAY
                  </div>
                  <div style={{ color: "rgba(233,242,255,.88)", marginTop: 6, lineHeight: 1.6 }}>
                    축하합니다. 에너지고속도로 주행을 완료했습니다.<br />
                    아래 정보를 입력하면 스탬프 투어가 완료됩니다.
                  </div>
                  <div className="lane" aria-hidden="true" />
                </div>
              )}

              <form className="form" onSubmit={submit}>
                <div className="label">회사명
                  <input className="input" name="company" required placeholder="예: LS ELECTRIC" disabled={!isComplete}/>
                </div>
                <div className="label">이름
                  <input className="input" name="name" required placeholder="예: 홍길동" disabled={!isComplete}/>
                </div>
                <div className="label">직책
                  <input className="input" name="title" required placeholder="예: 대리 / 과장 / 책임" disabled={!isComplete}/>
                </div>
                <div className="label">핸드폰번호
                  <input className="input" name="phone" required placeholder="010-1234-5678" inputMode="tel" disabled={!isComplete}/>
                </div>
                <div className="label">이메일주소
                  <input className="input" name="email" required placeholder="name@company.com" inputMode="email" disabled={!isComplete}/>
                </div>

                <button className="btn btnPrimary" type="submit" disabled={!isComplete}>
                  응모 제출
                </button>

                <div className="small">
                  · 스탬프는 이 기기(브라우저)에 저장됩니다. 다른 기기에서는 진행 현황이 이어지지 않습니다.<br/>
                  · 제출 정보는 이벤트 운영 목적으로만 사용되도록 안내 문구를 현장 정책에 맞게 조정하세요.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingBottom: 60 }}>
        <div className="container" style={{ color: "rgba(169,183,209,.92)", fontSize: 12, lineHeight: 1.7 }}>
          © LS ELECTRIC — Driving the energy highway (Event Stamp Tour)
        </div>
      </div>
    </>
  );
}



