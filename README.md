# Lesalog

Next.js 기반의 마크다운 블로그입니다. 종이질감 배경과 애니메이션 몬스터 캐릭터가 특징인 미니멀한 디자인의 개인 블로그입니다.

## 기능

- 📝 **마크다운 기반 포스팅**: `content/posts/` 폴더에 마크다운 파일로 포스트 작성
- 🏷️ **카테고리 필터링**: DEV, DAILY, STUDY 카테고리별 포스트 분류
- 🔍 **SEO 최적화**: 메타데이터, sitemap, robots.txt 자동 생성
- 📱 **반응형 디자인**: 모바일과 데스크톱 모두 지원
- 💬 **댓글 시스템**: Giscus를 통한 GitHub 기반 댓글
- 🎨 **독특한 디자인**: 종이질감 배경 + 애니메이션 몬스터 캐릭터

## 기술 스택

- **프레임워크**: Next.js 14.2.30
- **스타일링**: Tailwind CSS 3.4.1
- **언어**: TypeScript
- **마크다운**: react-markdown, remark-gfm
- **메타데이터**: gray-matter
- **폰트**: GowunDodum (구글 웹폰트)

## 새 포스트 작성하기

### 1. 마크다운 파일 생성

`content/posts/` 폴더에 새 `.md` 파일을 생성합니다:

```bash
touch content/posts/my-new-post.md
```

### 2. Front Matter 작성

파일 상단에 YAML front matter를 추가합니다:

```yaml
---
title: "포스트 제목"
date: "2024.12.25"
category: "DEV" # DEV, DAILY, STUDY 중 선택
slug: "my-new-post" # URL에 사용될 슬러그
description: "포스트 설명 (SEO용)"
tags: ["Next.js", "블로그", "개발"]
---
```

### 3. 마크다운 콘텐츠 작성

Front matter 아래에 마크다운 형식으로 내용을 작성합니다:

````markdown
# 제목

내용을 여기에 작성합니다.

## 섹션

- 리스트 아이템
- 또 다른 아이템

\```javascript
// 코드 블록
function hello() {
console.log("Hello, World!");
}
\```
````

### 4. 포스트 확인

개발 서버를 실행하여 포스트를 확인합니다:

```bash
npm run dev
```

http://localhost:3000/feed 에서 새 포스트를 확인할 수 있습니다.

## 프로젝트 구조

```
lesacat-blog/
├── content/
│   ├── posts/           # 마크다운 포스트 파일들
│   └── post-template.md # 새 포스트 작성용 템플릿
├── src/
│   ├── app/
│   │   ├── api/posts/   # 포스트 데이터 API
│   │   ├── feed/        # 피드 페이지
│   │   ├── posts/[slug]/ # 포스트 상세 페이지
│   │   ├── sitemap.ts   # SEO 사이트맵
│   │   └── robots.ts    # 검색엔진 크롤링 설정
│   ├── components/ui/
│   │   ├── Giscus.tsx   # 댓글 컴포넌트
│   │   └── Monster.tsx  # 애니메이션 몬스터
│   ├── lib/
│   │   └── posts.ts     # 마크다운 파일 처리 유틸리티
│   └── types/
│       └── blog.ts      # 타입 정의
```

## 카테고리

- **DEV**: 개발 관련 기술 포스트
- **DAILY**: 일상 생활과 개인적인 이야기
- **STUDY**: 학습 내용과 지식 공유

## SEO 최적화

### 메타데이터

각 포스트는 자동으로 다음 SEO 요소들이 생성됩니다:

- 제목 최적화
- 설명 (description 필드 또는 본문 일부)
- 키워드 (tags 배열)
- Open Graph 태그
- Twitter Card

### 사이트맵

`/sitemap.xml`에서 모든 페이지와 포스트의 사이트맵을 확인할 수 있습니다.

### Robots.txt

`/robots.txt`에서 검색엔진 크롤링 설정을 확인할 수 있습니다.

## 배포 전 설정

### 1. 도메인 설정

다음 파일들에서 `https://your-domain.com`을 실제 도메인으로 변경하세요:

- `src/app/layout.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`

### 2. Giscus 설정

댓글 시스템을 위해 `src/app/posts/[slug]/page.tsx`에서 Giscus 설정을 변경하세요:

```typescript
<Giscus
  repo="your-username/your-repo"
  repoId="your-repo-id"
  category="General"
  categoryId="your-category-id"
  // ... 기타 설정
/>
```

### 3. Google Search Console (선택사항)

`src/app/layout.tsx`에서 구글 사이트 인증을 추가할 수 있습니다:

```typescript
verification: {
  google: 'your-google-site-verification',
},
```

## 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 라이선스

MIT License
