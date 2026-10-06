import type { Metadata } from "next";
import Feed from "@/components/ui/Feed";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Feed",
  description: "레사로그의 개발 이야기와 일상",
};

export default function FeedPage() {
  const posts = getAllPosts().map(({ id, title, date, category, slug }) => ({
    id,
    title,
    date,
    category,
    slug,
  }));

  return <Feed posts={posts} />;
}
