import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const staticPages = [
    {
      url: "https://www.lesacat.me",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: "https://www.lesacat.me/feed",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  const postPages = posts.map((post) => {
    const postDate = new Date(post.date);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 최신 포스트일수록 높은 우선순위
    const priority = daysDiff < 30 ? 0.8 : daysDiff < 90 ? 0.7 : 0.6;

    return {
      url: `https://www.lesacat.me/posts/${post.slug}`,
      lastModified: postDate,
      changeFrequency: "yearly" as const,
      priority: priority,
    };
  });

  return [...staticPages, ...postPages];
}
