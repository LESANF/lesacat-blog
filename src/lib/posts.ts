import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost } from "@/types/blog";

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getAllPosts(): BlogPost[] {
  // content/posts 폴더가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      // .md 확장자 제거하여 id 생성
      const id = fileName.replace(/\.md$/, "");

      // 마크다운 파일 읽기
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // gray-matter로 메타데이터 파싱
      const matterResult = matter(fileContents);

      // BlogPost 객체 생성
      return {
        id,
        title: matterResult.data.title,
        date: matterResult.data.date,
        category: matterResult.data.category,
        slug: matterResult.data.slug || id,
        content: matterResult.content,
        description: matterResult.data.description,
        tags: matterResult.data.tags || [],
      };
    });

  // 날짜순으로 정렬 (최신순)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  const allPosts = getAllPosts();
  return allPosts.find((post) => post.slug === slug) || null;
}

export function getAllSlugs(): string[] {
  const allPosts = getAllPosts();
  return allPosts.map((post) => post.slug);
}
