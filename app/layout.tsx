import "./globals.css";

export const metadata = {
  title: "Driving the energy highway | Stamp Tour",
  description: "QR 스캔으로 7개 스탬프를 모아 완주하고 이벤트에 응모하세요."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
