import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts } from "@/data/posts";
import Giscus from "@/components/ui/Giscus";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function PostPage({ params }: PostPageProps) {
  const post = posts.find((p) => p.slug === params.slug);

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
            / HOME
          </Link>
        </div>

        {/* Post Meta */}
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">{post.date}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            {post.title}
          </h1>
          <div className="inline-block px-3 py-1 border border-black text-sm">
            {post.category}
          </div>
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
        <div className="border-t border-gray-200 pt-12">
          <h3 className="text-xl font-bold text-black mb-6">반응 5개</h3>

          {/* Giscus Comments - 실제 사용시에는 본인의 GitHub 레포 정보로 변경하세요 */}
          <div className="mb-8">
            <Giscus
              repo="your-username/your-repo" // 실제 GitHub 레포로 변경
              repoId="R_your-repo-id" // 실제 레포 ID로 변경
              category="General" // 실제 카테고리로 변경
              categoryId="DIC_your-category-id" // 실제 카테고리 ID로 변경
              mapping="pathname"
              strict="0"
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="bottom"
              theme="light"
              lang="ko"
            />
          </div>

          {/* Footer Info */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>댓글 오픈</span>
              <span>– Powered by</span>
              <Link
                href="https://giscus.app"
                className="text-black hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                giscus
              </Link>
            </div>

            <div className="mt-6 p-4 bg-white border border-gray-200 rounded">
              <div className="flex justify-between items-center mb-2">
                <button className="text-sm bg-gray-100 px-3 py-1 rounded">
                  작성하기
                </button>
                <button className="text-sm bg-gray-100 px-3 py-1 rounded">
                  미리보기
                </button>
              </div>
              <textarea
                className="w-full h-24 p-3 border border-gray-200 rounded resize-none text-sm"
                placeholder="본고인하고 댓글 작성하기"
              />
              <div className="flex justify-end mt-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                  GitHub으로 로그인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
