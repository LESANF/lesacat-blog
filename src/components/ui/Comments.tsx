"use client";

import { useEffect, useRef } from "react";

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const scriptElem = document.createElement("script");
    scriptElem.src = "https://giscus.app/client.js";
    scriptElem.async = true;
    scriptElem.crossOrigin = "anonymous";

    // 임시 하드코딩 테스트
    scriptElem.setAttribute("data-repo", "LESANF/lesacat-blog");
    scriptElem.setAttribute("data-repo-id", "R_kgDOPCU21w");
    scriptElem.setAttribute("data-category", "Comments");
    scriptElem.setAttribute("data-category-id", "DIC_kwDOPCU218M6OjM4Mzg0MzA");
    scriptElem.setAttribute("data-mapping", "pathname");
    scriptElem.setAttribute("data-strict", "0");
    scriptElem.setAttribute("data-reactions-enabled", "1");
    scriptElem.setAttribute("data-emit-metadata", "0");
    scriptElem.setAttribute("data-input-position", "bottom");
    scriptElem.setAttribute("data-theme", "light");
    scriptElem.setAttribute("data-lang", "ko");

    ref.current.appendChild(scriptElem);
  }, []);

  return (
    <div className="comments-section">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-black mb-2">댓글</h3>
        <p className="text-sm text-gray-600">
          GitHub 계정으로 로그인하여 댓글을 남겨보세요
        </p>
      </div>

      <div className="giscus-wrapper">
        <section ref={ref} />
      </div>

      <style jsx global>{`
        /* Giscus 컨테이너 스타일링 */
        .giscus-wrapper {
          font-family: "GowunDodum", system-ui, sans-serif;
        }

        .giscus-wrapper .gsc-main {
          background: transparent !important;
        }

        /* 댓글 작성 영역 */
        .giscus-wrapper .gsc-comment-box {
          border: 1px solid #000 !important;
          border-radius: 0 !important;
          background: white !important;
          box-shadow: none !important;
        }

        .giscus-wrapper .gsc-comment-box-textarea {
          background: white !important;
          border: none !important;
          font-family: "GowunDodum", system-ui, sans-serif !important;
          font-size: 14px !important;
          padding: 12px !important;
          line-height: 1.5 !important;
        }

        .giscus-wrapper .gsc-comment-box-textarea:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        /* 댓글 작성 버튼들 */
        .giscus-wrapper .gsc-comment-box-buttons {
          background: white !important;
          border-top: 1px solid #e5e7eb !important;
          padding: 8px 12px !important;
        }

        .giscus-wrapper .gsc-comment-box-write-tab,
        .giscus-wrapper .gsc-comment-box-preview-tab {
          background: transparent !important;
          border: 1px solid #000 !important;
          border-radius: 0 !important;
          color: black !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          padding: 4px 12px !important;
          margin-right: 8px !important;
        }

        .giscus-wrapper .gsc-comment-box-write-tab[aria-selected="true"],
        .giscus-wrapper .gsc-comment-box-preview-tab[aria-selected="true"] {
          background: black !important;
          color: white !important;
        }

        /* GitHub 로그인 버튼 */
        .giscus-wrapper .gsc-comment-box-signin,
        .giscus-wrapper .gsc-comment-box-submit {
          background: black !important;
          border: 1px solid black !important;
          border-radius: 0 !important;
          color: white !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          padding: 8px 16px !important;
          transition: all 0.2s ease !important;
        }

        .giscus-wrapper .gsc-comment-box-signin:hover,
        .giscus-wrapper .gsc-comment-box-submit:hover {
          background: #333 !important;
        }

        /* 기존 댓글들 */
        .giscus-wrapper .gsc-comment {
          border: 1px solid #e5e7eb !important;
          border-radius: 0 !important;
          background: white !important;
          margin-bottom: 16px !important;
        }

        .giscus-wrapper .gsc-comment-header {
          background: #f9f9f9 !important;
          border-bottom: 1px solid #e5e7eb !important;
          padding: 12px !important;
        }

        .giscus-wrapper .gsc-comment-content {
          padding: 16px !important;
          font-family: "GowunDodum", system-ui, sans-serif !important;
          line-height: 1.6 !important;
        }

        /* 반응 버튼들 */
        .giscus-wrapper .gsc-reactions {
          background: white !important;
          border-top: 1px solid #e5e7eb !important;
          padding: 8px 12px !important;
        }

        .giscus-wrapper .gsc-reaction-button {
          border: 1px solid #e5e7eb !important;
          border-radius: 0 !important;
          background: white !important;
          font-size: 12px !important;
          margin-right: 8px !important;
          padding: 4px 8px !important;
        }

        .giscus-wrapper .gsc-reaction-button:hover {
          background: #f3f4f6 !important;
        }

        .giscus-wrapper .gsc-reaction-button[aria-pressed="true"] {
          background: black !important;
          color: white !important;
        }

        /* 로딩 상태 */
        .giscus-wrapper .gsc-loading {
          color: #666 !important;
          padding: 20px !important;
          text-align: center !important;
        }

        /* 에러 상태 */
        .giscus-wrapper .gsc-error {
          border: 1px solid #ef4444 !important;
          background: #fef2f2 !important;
          color: #dc2626 !important;
          padding: 12px !important;
          border-radius: 0 !important;
        }

        /* 반응형 대응 */
        @media (max-width: 768px) {
          .giscus-wrapper .gsc-comment-box-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .giscus-wrapper .gsc-comment-box-write-tab,
          .giscus-wrapper .gsc-comment-box-preview-tab {
            margin-bottom: 8px !important;
            margin-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
