import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/Navigation";
import WikiProvider from "@/components/WikiProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  const { data: wikiTerms } = await supabase
    .from('wiki_terms')
    .select('*')
    .eq('published', true);

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Runs synchronously before first paint — sets data-theme to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var s=localStorage.getItem('ds-theme'),d=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=s||d;}catch(e){}` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" rel="stylesheet" />
      </head>
      <body>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1232237340609183"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <WikiProvider terms={wikiTerms ?? []}>
            <Navigation />
            <main className="main-container">
              {children}
            </main>
          </WikiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}