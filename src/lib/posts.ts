import fs from "fs";
import path from "path";
import { parse } from "yaml";
import { cache } from "react";
import type { BlogPost } from "@/types/blog";

const postsDirectory = path.join(process.cwd(), "content/posts");

export const getAllPosts = cache((): BlogPost[] => {
  // content/posts 폴더가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName): BlogPost => {
      // .md 확장자 제거하여 id 생성
      const id = fileName.replace(/\.md$/, "");

      // 마크다운 파일 읽기
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(fileContents);
      if (!frontmatter) throw new Error(`Missing frontmatter: ${fileName}`);
      const data: unknown = parse(frontmatter[1]);
      if (
        typeof data !== "object" || data === null ||
        !("title" in data) || typeof data.title !== "string" ||
        !("date" in data) || typeof data.date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
        !("category" in data) ||
        (data.category !== "DEV" && data.category !== "DAILY" && data.category !== "STUDY")
      ) throw new Error(`Invalid post metadata: ${fileName}`);

      const slug = "slug" in data ? data.slug : id;
      const description = "description" in data ? data.description : undefined;
      const tags = "tags" in data ? data.tags : [];
      if (
        typeof slug !== "string" ||
        (description !== undefined && typeof description !== "string") ||
        !Array.isArray(tags) || !tags.every((tag: unknown) => typeof tag === "string")
      ) throw new Error(`Invalid optional post metadata: ${fileName}`);

      // BlogPost 객체 생성
      return {
        id,
        title: data.title,
        date: data.date,
        category: data.category,
        slug,
        content: fileContents.slice(frontmatter[0].length),
        description,
        tags,
      };
    });

  // 날짜순으로 정렬 (최신순)
  return allPostsData.sort((a, b) => b.date.localeCompare(a.date));
});

export function getPostBySlug(slug: string): BlogPost | null {
  const allPosts = getAllPosts();
  return allPosts.find((post) => post.slug === slug) || null;
}

export function getAllSlugs(): string[] {
  const allPosts = getAllPosts();
  return allPosts.map((post) => post.slug);
}
