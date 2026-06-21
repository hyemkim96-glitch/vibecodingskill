import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/Navigation";
import WikiProvider from "@/components/WikiProvider";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Design MD — AI 빌더를 위한 브랜드 디자인 토큰",
  description: "세계 유수 브랜드의 디자인 시스템을 AI에 바로 넣을 수 있는 .md 토큰으로 제공합니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const [{ data: { user } }, { data: wikiTerms }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('wiki_terms').select('*').eq('published', true),
  ]);

  return (
    <html lang="ko">
      {/* ⚠️ 수동 <head> 태그를 제거하고 Script를 <body> 안으로 이동합니다. */}
      <body>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1232237340609183"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <WikiProvider terms={wikiTerms ?? []}>
          <Navigation user={user} />
          <main className="main-container">
            {children}
          </main>
        </WikiProvider>
      </body>
    </html>
  );
}