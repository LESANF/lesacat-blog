"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Lottie from "react-lottie";

export default function NotFound() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // JSON 파일을 fetch로 로드
    fetch("/lotties/404-plug-lottie.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data));
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // 애니메이션 데이터가 로드되지 않았으면 로딩 표시
  if (!animationData) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center max-w-4xl mx-auto">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center max-w-4xl mx-auto">
      {/* 404 Content */}
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        {/* Lottie Animation */}
        <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]">
          <Lottie options={defaultOptions} height="100%" width="100%" />
        </div>

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
