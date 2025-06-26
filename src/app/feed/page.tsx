"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Category, BlogPost } from "@/types/blog";

export default function Feed() {
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // 클라이언트에서 포스트 데이터 로드
    const loadPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const postsData = await response.json();
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to load posts:", error);
        setPosts([]);
      }
    };

    loadPosts();
  }, []);

  const toggleCategory = (category: Category) => {
    setActiveCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setActiveCategories([]);
  };

  const filteredPosts =
    activeCategories.length > 0
      ? posts.filter((post) => activeCategories.includes(post.category))
      : posts;

  const categoryNames = {
    DEV: "DEV",
    DAILY: "DAILY",
    STUDY: "STUDY",
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <Link
            href="/"
            className="text-lg font-medium text-black hover:underline decoration-2 underline-offset-4"
          >
            BACK
          </Link>
          <h1 className="text-5xl md:text-7xl font-black text-black absolute left-1/2 transform -translate-x-1/2">
            Feed
          </h1>
          <div className="w-16"></div> {/* Spacer for center alignment */}
        </div>

        {/* Filters */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
            <span className="text-black font-medium">FILTER</span>
            <button
              onClick={clearFilters}
              className="text-black font-medium hover:underline decoration-2 underline-offset-4 self-start"
            >
              CLEAR
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {(["DEV", "DAILY", "STUDY"] as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-2 py-1 border border-black transition-colors text-sm md:text-base ${
                  activeCategories.includes(category)
                    ? "bg-black text-white"
                    : "bg-transparent text-black hover:bg-gray-100"
                }`}
              >
                {categoryNames[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Table */}
        <div className="border-t border-black">
          {/* Table Header - Desktop */}
          <div className="hidden md:flex border-b border-black py-4">
            <div className="w-32 text-black font-medium">DATE</div>
            <div className="flex-1 text-black font-medium">TITLE</div>
          </div>

          {/* Posts */}
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="block border-b border-gray-400 py-3 md:py-4 hover:bg-black hover:bg-opacity-5 transition-colors"
            >
              {/* Mobile Layout */}
              <div className="md:hidden space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-black font-medium text-sm leading-tight flex-1">
                    {post.title}
                  </h3>
                  <span className="text-xs text-gray-600 whitespace-nowrap">
                    {post.date}
                  </span>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-center">
                <div className="w-32 text-black text-base font-medium">
                  {post.date}
                </div>
                <div className="flex-1 text-black text-base">{post.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
