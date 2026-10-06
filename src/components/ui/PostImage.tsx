import { existsSync } from "node:fs";
import path from "node:path";
import type { ComponentProps } from "react";
import Image from "next/image";
import sharp from "sharp";
import { siteConfig } from "@/config/site";

type PostImageProps = Pick<ComponentProps<"img">, "src" | "alt" | "style"> & {
  preload: boolean;
};

export default async function PostImage({
  src,
  alt,
  style,
  preload,
}: PostImageProps) {
  if (typeof src !== "string") return null;

  const url = new URL(src, `${siteConfig.url}/posts/`);
  if (url.origin !== siteConfig.url || !url.pathname.startsWith("/images/")) {
    throw new Error(`Post images must use local /images/ assets: ${src}`);
  }

  let imageSrc = url.pathname;
  const webpSrc = imageSrc.replace(/\.gif$/i, ".webp");
  if (existsSync(path.join(process.cwd(), "public", webpSrc))) {
    imageSrc = webpSrc;
  }

  const imagePath = path.join(process.cwd(), "public", decodeURIComponent(imageSrc));
  const { width, height, pages = 1 } = await sharp(imagePath).metadata();
  if (!width || !height) throw new Error(`Missing image dimensions: ${src}`);

  const placeholder = pages > 1
    ? `data:image/webp;base64,${(await sharp(imagePath)
        .resize({ width: 320, height: 320, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 65 })
        .toBuffer()).toString("base64")}` as const
    : "empty";

  return (
    <Image
      src={imageSrc}
      alt={alt ?? ""}
      width={width}
      height={height}
      sizes="(max-width: 768px) 100vw, 704px"
      preload={preload}
      loading={preload ? undefined : "lazy"}
      unoptimized={pages > 1}
      placeholder={placeholder}
      className="max-w-full h-auto rounded-lg my-4 mx-auto block"
      style={{ ...style, width, maxWidth: "100%", height: "auto" }}
    />
  );
}
