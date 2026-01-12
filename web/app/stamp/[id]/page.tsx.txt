"use client";

import { useEffect, useMemo, useState } from "react";
import { addStamp, TOTAL, countDone } from "../../../lib/stamps";

export default function StampPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [msg, setMsg] = useState("처리 중...");
  const [done, setDone] = useState(0);

  const valid = useMemo(() => Number.isInteger(id) && id >= 1 && id <= TOTAL, [id]);

  useEffect(() => {
    if (!valid) {
      setMsg("유효하지 않은 QR입니다.");
      return;
    }
    const state = addStamp(id);
    const c = countDone(state);
    setDone(c);

    if (c === TOTAL) setMsg(`완주! (${c}/${TOTAL}) 메인으로 이동합니다…`);
    else setMsg(`#${id} 스탬프 적립 완료! (${c}/${TOTAL}) 메인으로 이동합니다…`);

    const t = setTimeout(() => {
      window.location.href = "/main#stamp";
    }, 900);

    return () => clearTimeout(t);
  }, [id, valid]);

  return (
    <div style={{ minHeight: "100vh", display:"flex", alignItems:"center", justifyContent:"center", padding: 18 }}>
      <div style={{
        maxWidth: 520,
        width: "100%",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 18,
        background: "rgba(255,255,255,.06)",
        boxShadow: "0 24px 60px rgba(0,0,0,.45)",
        padding: 16
      }}>
        <div style={{ fontWeight: 900, letterSpacing: "-.2px", marginBottom: 8 }}>
          Driving the energy highway
        </div>
        <div style={{ color: "rgba(233,242,255,.9)", lineHeight: 1.6 }}>
          {msg}
        </div>
        <div style={{ color: "rgba(169,183,209,.92)", fontSize: 12, marginTop: 10 }}>
          (진행: {done}/{TOTAL})
        </div>
      </div>
    </div>
  );
}
