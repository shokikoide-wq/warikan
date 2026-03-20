import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "トントン - 割り勘計算アプリ",
  description: "複数人の立て替えを簡単に精算できるアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen text-gray-800 relative">
        <header className="glass-header z-50">
          <div className="max-w-lg mx-auto px-4 py-1.5">
            <a href="/">
              <img
                src="/tonton.png"
                alt="tonton"
                className="h-20 -my-6"
              />
            </a>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-8 relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
