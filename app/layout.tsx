import type { Metadata } from "next";
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
      <body>
        <Navigation user={user} />
        <main className="main-container">
          {children}
        </main>
      </body>
    </html>
  );
}
