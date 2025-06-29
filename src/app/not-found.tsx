import Link from "next/link";
import dynamic from "next/dynamic";

// 상대 경로로 import 시도
const NotFoundAnimation = dynamic(
  () => import("../components/ui/NotFoundAnimation"),
  {
    ssr: false,
    loading: () => <div />,
  }
);

export default function NotFound() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center max-w-4xl mx-auto">
      {/* 404 Content */}
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        {/* Lottie Animation */}
        <NotFoundAnimation />

        {/* Home Button */}
        <Link
          href="/"
          className="inline-block px-8 py-3 text-lg font-medium text-black border-2 border-black hover:bg-black hover:text-white transition-colors duration-200"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
