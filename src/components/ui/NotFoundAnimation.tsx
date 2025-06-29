"use client";

import { useEffect, useState } from "react";
import Lottie from "react-lottie";

export default function NotFoundAnimation() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // JSON 파일을 fetch로 로드
    fetch("/lotties/404-plug-lottie.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => {
        console.error("Failed to load animation:", error);
      });
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]">
      <Lottie options={defaultOptions} height="100%" width="100%" />
    </div>
  );
}
