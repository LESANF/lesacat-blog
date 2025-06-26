import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import Comments from "@/components/ui/Comments";
import { Metadata } from "next";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: `${post.title} | Lesalog`,
    description: post.description || post.content?.substring(0, 160) + "...",
    keywords: post.tags?.join(", "),
    openGraph: {
      title: post.title,
      description: post.description || post.content?.substring(0, 160) + "...",
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || post.content?.substring(0, 160) + "...",
    },
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <Link
            href="/feed"
            className="text-lg font-medium text-black hover:underline decoration-2 underline-offset-4"
          >
            ← Feed
          </Link>
          <Link
            href="/"
            className="text-lg font-medium text-black hover:underline decoration-2 underline-offset-4"
          >
            HOME
          </Link>
        </div>

        {/* Post Meta */}
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">{post.date}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="inline-block px-3 py-1 border border-black text-sm">
              {post.category}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {post.description && (
            <p className="text-gray-700 leading-relaxed">{post.description}</p>
          )}
        </div>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-16">
          <div className="text-gray-800 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content || ""}
            </ReactMarkdown>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-12 mb-8">
          <Comments />
        </div>

        {/* Footer - 심플한 공유 링크 */}
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center text-gray-600">
            <p className="mb-4">이 글이 도움이 되었다면 공유해주세요</p>
            <div className="flex justify-center gap-4">
              <Link
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  post.title
                )}&url=${encodeURIComponent(
                  `https://your-domain.com/posts/${post.slug}`
                )}`}
                className="text-black hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter로 공유
              </Link>
              <span className="text-gray-400">·</span>
              <Link
                href="mailto:your-email@example.com"
                className="text-black hover:underline"
              >
                이메일로 연락
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
