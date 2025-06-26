import Monster from "@/components/ui/Monster";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesalog - 개발자의 일상과 기술 이야기",
  description:
    "개발자의 일상과 기술 이야기를 담은 블로그입니다. Next.js, React, 알고리즘 등 다양한 개발 경험을 공유합니다.",
  openGraph: {
    title: "Lesalog - 개발자의 일상과 기술 이야기",
    description:
      "개발자의 일상과 기술 이야기를 담은 블로그입니다. Next.js, React, 알고리즘 등 다양한 개발 경험을 공유합니다.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lesalog - 개발자의 일상과 기술 이야기",
    description:
      "개발자의 일상과 기술 이야기를 담은 블로그입니다. Next.js, React, 알고리즘 등 다양한 개발 경험을 공유합니다.",
  },
};

export default function Home() {
  return (
    <>
      <div className="min-h-screen p-8 flex flex-col items-start justify-between max-w-4xl mx-auto">
        {/* Header */}
        <div className="w-full flex justify-between items-start pt-32">
          <div>
            <h1 className="text-6xl md:text-8xl font-bold text-black mb-2">
              Lesalog
            </h1>
          </div>
          <div className="text-right space-y-1">
            <Link
              href="/feed"
              className="block text-lg font-medium text-black hover:underline decoration-2 underline-offset-4"
            >
              Feed
            </Link>
            <Link
              href="https://www.rallit.com/hub/resumes/44766/%EA%B9%80%EB%8F%99%ED%95%9C"
              className="block text-lg font-medium text-black hover:underline decoration-2 underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </Link>
            <Link
              href="https://lesacat.site"
              className="block text-lg font-medium text-black hover:underline decoration-2 underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </div>
      <Monster />
    </>
  );
}
