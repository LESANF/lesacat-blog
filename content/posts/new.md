---
title: "새로운 테스트 포스트 - 자동 댓글 시스템 확인"
date: "2024.12.26"
category: "DEV"
slug: "new"
description: "Giscus 자동 Discussion 생성 테스트를 위한 새로운 포스트입니다."
tags: ["테스트", "Giscus", "자동화", "댓글"]
---

# 새로운 테스트 포스트 🚀

이 포스트는 **Giscus 자동 Discussion 생성**을 테스트하기 위해 만들어졌습니다.

## 접근 링크

이 포스트는 다음 링크에서 확인할 수 있습니다:

- **메인 도메인**: [lesacat.me/posts/new](https://lesacat.me/posts/new)
- **Vercel 도메인**: [lesacat-blog.vercel.app/posts/new](https://lesacat-blog.vercel.app/posts/new)

## 테스트 목표

1. ✅ 포스트 자동 생성 및 라우팅
2. 🔄 **Giscus Bot 자동 Discussion 생성** (진행 중)
3. 💬 댓글 시스템 정상 작동 확인

## 기대하는 결과

이 포스트를 배포한 후 `lesacat.me/posts/new`에 접근하면:

- 댓글 영역이 정상적으로 로드
- GitHub 로그인 후 댓글 작성 시
- **giscus[bot]이 자동으로 `posts/new` 제목의 Discussion 생성**

## 코드 예시

```typescript
// Giscus 설정 예시
const giscusConfig = {
  repo: "LESANF/lesacat-blog",
  mapping: "pathname", // 핵심!
  category: "Comments",
};
```

## 마무리

아래 댓글란에서 **GitHub 계정으로 로그인하여 첫 댓글을 남겨보세요!**

그러면 자동으로 GitHub Discussions에 `posts/new` 제목으로 새로운 Discussion이 생성될 것입니다. 🎯
