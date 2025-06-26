"use client";

import Link from "next/link";
import { useState } from "react";
import { posts } from "@/data/posts";
import { Category } from "@/types/blog";

export default function Feed() {
  const [activeCategories, setActiveCategories] = useState<Category[]>([]);

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

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-black">Feed</h1>
          <Link
            href="/"
            className="text-lg font-medium text-black hover:underline decoration-2 underline-offset-4"
          >
            / HOME
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-black font-medium">/ FILTER</span>
            <button
              onClick={clearFilters}
              className="text-black hover:underline decoration-2 underline-offset-4"
            >
              CLEAR FILTER
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["LIFE", "DEV", "CAREER"] as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1 border border-black transition-colors ${
                  activeCategories.includes(category)
                    ? "bg-black text-white"
                    : "bg-transparent text-black hover:bg-gray-100"
                }`}
              >
                ( ) {category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Table */}
        <div className="border-t border-black">
          {/* Table Header */}
          <div className="flex border-b border-black py-4">
            <div className="w-32 text-black font-medium">/ DATE</div>
            <div className="flex-1 text-black font-medium">/ TITLE</div>
          </div>

          {/* Posts */}
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="flex border-b border-gray-200 py-4 hover:bg-gray-100 transition-colors"
            >
              <div className="w-32 text-black text-sm">{post.date}</div>
              <div className="flex-1 text-black">{post.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
