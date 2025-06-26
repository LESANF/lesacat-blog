import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Lesalog",
    template: "%s | Lesalog",
  },
  description:
    "개발자의 일상과 기술 이야기를 담은 블로그입니다. Next.js, React, 알고리즘 등 다양한 개발 경험을 공유합니다.",
  keywords: [
    "개발 블로그",
    "프론트엔드",
    "Next.js",
    "React",
    "개발자",
    "기술 블로그",
  ],
  authors: [{ name: "Lesa" }],
  creator: "Lesa",
  publisher: "Lesa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://your-domain.com"), // 실제 도메인으로 변경하세요
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "Lesalog",
    description: "개발자의 일상과 기술 이야기를 담은 블로그입니다.",
    siteName: "Lesalog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lesalog",
    description: "개발자의 일상과 기술 이야기를 담은 블로그입니다.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: 'your-google-site-verification', // Google Search Console 인증 시 추가
    // other: {
    //   'naver-site-verification': 'your-naver-verification', // 네이버 웹마스터 인증 시 추가
    // },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
