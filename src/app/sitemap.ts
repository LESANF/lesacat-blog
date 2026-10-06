import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url },
    { url: `${siteConfig.url}/feed` },
    ...getAllPosts().map((post) => ({
      url: `${siteConfig.url}/posts/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
