import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "WALLABY FACTORY - キャンプギア・オーダーメイド",
  description: "あなただけのキャンプ用品収納袋を自由に設計。職人が一つずつ手作業で仕立てる、一生モノのギアケース。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
