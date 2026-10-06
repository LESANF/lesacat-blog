import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import Comments from "@/components/ui/Comments";
import PostImage from "@/components/ui/PostImage";
import { CodeBlockAssets, MarkdownCodeBlock } from "@/components/ui/CodeBlock";
import { BlogPostStructuredData } from "@/components/ui/StructuredData";
import { Metadata } from "next";

const articleSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Inline presentation is authored locally; scripts and event handlers stay blocked.
    img: [...(defaultSchema.attributes?.img || []), "style"],
    div: [...(defaultSchema.attributes?.div || []), "style"],
    span: [...(defaultSchema.attributes?.span || []), "style"],
  },
};

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: post.title,
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

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const firstImageSrc = /<img\b[^>]*\bsrc=["']([^"']+)/i.exec(
    post.content || "",
  )?.[1];

  return (
    <div className="post-page min-h-screen">
      <CodeBlockAssets />
      <BlogPostStructuredData
        title={post.title}
        description={
          post.description || post.content?.substring(0, 160) + "..."
        }
        datePublished={post.date}
        author="Lesa"
        url={`https://www.lesacat.me/posts/${post.slug}`}
        imageUrl="https://www.lesacat.me/images/og-image.png"
        tags={post.tags}
      />
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
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded whitespace-nowrap"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-16">
          <div className="text-gray-800 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, [rehypeSanitize, articleSchema]]}
              components={{
                pre: MarkdownCodeBlock,
                a(props) {
                  const { href, children } = props;
                  if (
                    href &&
                    (href.startsWith("http") || href.startsWith("https"))
                  ) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {children}
                      </a>
                    );
                  }
                  return (
                    <a href={href} className="text-blue-600 hover:underline">
                      {children}
                    </a>
                  );
                },
                img(props) {
                  return (
                    <PostImage {...props} preload={props.src === firstImageSrc} />
                  );
                },
              }}
            >
              {post.content || ""}
            </ReactMarkdown>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-12 mb-8">
          <Comments key={post.slug} />
        </div>
      </div>
    </div>
  );
}
