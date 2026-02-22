import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Vibe Coding Skills - 비개발자를 위한 AI 코딩 스킬 플랫폼",
  description: "AI 코딩 툴에 바로 붙여넣을 수 있는 스킬셋을 탐색하고 복사하세요.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="ko">
      {/* ⚠️ 수동 <head> 태그를 제거하고 Script를 <body> 안으로 이동합니다. */}
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1232237340609183"
          // React에서는 대문자 O를 사용해야 에러가 나지 않습니다.
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Navigation user={user} />
        <main className="main-container">
          {children}
        </main>
      </body>
    </html>
  );
}