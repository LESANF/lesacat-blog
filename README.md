# Zero.log - 개인 블로그

[zerolog.vercel.app](https://zerolog.vercel.app/posts)를 모티브로 한 Next.js + Tailwind CSS 기반의 개인 블로그입니다.

## 🚀 기능

- **메인 페이지**: 깔끔한 랜딩 페이지
- **피드 페이지**: 카테고리별 글 필터링 기능
- **글 상세 페이지**: 마크다운 지원 및 GitHub Discussions 댓글
- **이력서 페이지**: 간단한 프로필 페이지
- **반응형 디자인**: 모바일 친화적 UI

## 🛠 기술 스택

- **Framework**: Next.js 14.2.30
- **Styling**: Tailwind CSS 3.4.1
- **Language**: TypeScript
- **Comments**: Giscus (GitHub Discussions)
- **Markdown**: react-markdown + remark-gfm

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── feed/                 # 피드 페이지
│   ├── posts/[slug]/        # 글 상세 페이지 (동적 라우팅)
│   ├── resume/              # 이력서 페이지
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 메인 페이지
│   └── globals.css          # 전역 스타일
├── components/
│   └── ui/
│       └── Giscus.tsx       # GitHub Discussions 댓글 컴포넌트
├── data/
│   └── posts.ts             # 블로그 포스트 데이터
├── types/
│   └── blog.ts              # 타입 정의
└── lib/                     # 유틸리티 함수들
```

## 🚦 실행 방법

### 개발 환경 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## ⚙️ 설정

### GitHub Discussions 댓글 설정

1. GitHub 저장소에서 Discussions 활성화
2. [giscus.app](https://giscus.app)에서 설정 정보 생성
3. `src/app/posts/[slug]/page.tsx`에서 Giscus 컴포넌트의 props 수정:

```tsx
<Giscus
  repo="your-username/your-repo" // 본인의 GitHub 저장소
  repoId="R_your-repo-id" // 저장소 ID
  category="General" // 카테고리 이름
  categoryId="DIC_your-category-id" // 카테고리 ID
  // ... 기타 설정
/>
```

### 블로그 포스트 추가

`src/data/posts.ts` 파일에 새로운 포스트를 추가하세요:

```typescript
{
  id: 'unique-id',
  title: '포스트 제목',
  date: '2024.01.01',
  category: 'DEV', // 'LIFE' | 'DEV' | 'CAREER'
  slug: 'post-url-slug',
  content: `# 마크다운 형식의 내용`
}
```

## 📝 커스터마이징

- **스타일**: `src/app/globals.css`에서 Tailwind CSS 클래스 수정
- **카테고리**: `src/types/blog.ts`에서 Category 타입 수정
- **레이아웃**: 각 페이지 컴포넌트에서 레이아웃 조정
- **브랜딩**: 메인 페이지의 타이틀과 소개글 변경

## �� 라이선스

MIT License
