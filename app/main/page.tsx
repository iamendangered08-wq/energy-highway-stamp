"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getStampMeta } from "../../lib/stampMeta";

type StampState = Record<number, { at: string }>;

const TOTAL = 7;
const STORAGE_KEY = "energy_highway_stamp_state_v1";

type SafeMeta = { label: string; iconPath?: string };

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

f이 완료되었습니다!");
      e.currentTarget.reset();
    } else {
      alert("제출에 실패했습니다. 운영자에게 문의해주세요.");
    }
  }

  return (
    <>
      {/* HERO */}
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
            전시장 곳곳의 QR을 스캔해 7개 스탬프를 모아주세요. 미션을 완주하면 이벤트 존에서 선물을
            드립니다.
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

      {/* THEME */}
      <div id="story" className="section">
        <div className="container">
          <div className="card">
            <div className="cardInner">
              <div style={{ fontWeight: 900, marginBottom: 8, letterSpacing: "-.2px" }}>THEME</div>
              <div style={{ color: "rgba(233,242,255,.9)", lineHeight: 1.65 }}>
                <b>Driving the energy highway</b> — 에너지고속도로를 달리며, 전력 산업의 패러다임을
                바꾸는 여정에 함께하세요.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STAMPS */}
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
                  const meta = safeGetStampMeta(n);

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

                      <div className="stampIcon" aria-hidden="true">
                        {meta.iconPath ? (
                          <img
                            src={meta.iconPath}
                            alt=""
                            width={28}
                            height={28}
                            style={{ display: "block" }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : null}
                      </div>

                      <div className="stampLabel">{meta.label}</div>
                      <div className="check">{ok ? "✓" : ""}</div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <button
                  className="btn"
                  type="button"
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

              {isComplete ? (
                <div className="completeBanner" style={{ marginTop: 16 }}>
                  <div style={{ fontWeight: 1000, letterSpacing: "-.2px", fontSize: 18 }}>
                    완주! DRIVING THE ENERGY HIGHWAY
                  </div>
                  <div style={{ color: "rgba(233,242,255,.88)", marginTop: 6, lineHeight: 1.6 }}>
                    축하합니다. 에너지고속도로 질주를 완료했습니다.
                    <br />
                    아래 정보를 입력하면 스탬프 투어가 완료됩니다.
                  </div>
                  <div className="lane" aria-hidden="true" />
                </div>
              ) : null}

              <form className="form" onSubmit={submit}>
                <div className="label">
                  회사명
                  <input
                    className="input"
                    name="company"
                    required
                    placeholder="예: LS ELECTRIC"
                    disabled={!isComplete}
                  />
                </div>
                <div className="label">
                  이름
                  <input className="input" name="name" required placeholder="예: 홍길동" disabled={!isComplete} />
                </div>
                <div className="label">
                  직책
                  <input
                    className="input"
                    name="title"
                    required
                    placeholder="예: 매니저 / 과장 / 책임"
                    disabled={!isComplete}
                  />
                </div>
                <div className="label">
                  핸드폰번호
                  <input
                    className="input"
                    name="phone"
                    required
                    placeholder="010-1234-5678"
                    inputMode="tel"
                    disabled={!isComplete}
                  />
                </div>
                <div className="label">
                  이메일주소
                  <input
                    className="input"
                    name="email"
                    required
                    placeholder="name@company.com"
                    inputMode="email"
                    disabled={!isComplete}
                  />
                </div>

                <button className="btn btnPrimary" type="submit" disabled={!isComplete}>
                  제출
                </button>

                <div className="small">
                  · 스탬프는 이 기기(브라우저)에 저장됩니다. 다른 기기에서는 진행 현황이 이어지지 않습니다.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="section" style={{ paddingBottom: 60 }}>
        <div className="container" style={{ color: "rgba(169,183,209,.92)", fontSize: 12, lineHeight: 1.7 }}>
          © LS ELECTRIC — Driving the Energy Highway (Stamp Tour Event)
        </div>
      </div>
    </>
  );
}
