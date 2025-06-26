import Monster from "@/components/ui/Monster";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesalog",
  description: "레사로그",
  openGraph: {
    title: "Lesalog",
    description: "레사로그",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lesalog",
    description: "레사로그",
    images: ["/og-image.png"],
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
