"use client";

import dynamic from "next/dynamic";
import animationData from "../../../public/lotties/404-plug-lottie.json";

const Lottie = dynamic(() => import("lottie-react").then((module) => module.Lottie), { ssr: false });

export default function NotFoundAnimation() {
  return (
    <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]">
      <Lottie
        src={animationData}
        loop
        autoplay
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
