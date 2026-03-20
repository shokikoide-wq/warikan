import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ワリカン - 割り勘計算アプリ",
  description: "複数人の立て替えを簡単に精算できるアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-lg mx-auto px-4 py-3">
            <a href="/" className="text-xl font-bold text-indigo-600">
              ワリカン
            </a>
          </div>
        </header>
        <main className="max-w-lg mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
