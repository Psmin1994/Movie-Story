import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Story", // 웹사이트 제목
  description: "영화 정보 사이트", // 설명
  icons: {
    icon: "/favicon.ico", // 아이콘 설정
  },
  themeColor: "#000000", // 기본 색상 설정
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={``}>{children}</body>
    </html>
  );
}
