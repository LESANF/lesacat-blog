# Giscus 댓글 시스템 설정 가이드

GitHub Discussions를 기반으로 한 댓글 시스템을 설정하는 방법입니다.

## 1. GitHub Repository에서 Discussions 활성화

1. GitHub 레포지토리로 이동
2. **Settings** 탭 클릭
3. **Features** 섹션에서 **Discussions** 체크박스 활성화

## 2. Giscus 설정 정보 생성

1. [giscus.app](https://giscus.app/ko) 방문
2. **저장소** 섹션에 `username/repository-name` 입력 (예: `lesacat/lesacat-blog`)
3. **페이지 ↔️ 토론 매핑** 선택: `pathname` 추천
4. **토론 카테고리** 선택: `General` 또는 새로 생성한 카테고리
5. **기능** 설정:
   - ✅ 반응 활성화
   - ✅ 메타데이터 전송 안함
   - 위치: 댓글 상자 상단
6. **테마**: `light` 선택

## 3. 설정 정보 복사

giscus.app에서 생성된 설정 정보를 복사하세요:

```html
<script
  src="https://giscus.app/client.js"
  data-repo="username/repository-name"
  data-repo-id="R_kgDOExample"
  data-category="General"
  data-category-id="DIC_kwDOExample"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="top"
  data-theme="light"
  data-lang="ko"
  crossorigin="anonymous"
  async
></script>
```

## 4. 블로그에 설정 적용

`src/app/posts/[slug]/page.tsx` 파일에서 다음 부분을 수정하세요:

```tsx
<Comments
  repo="username/repository-name" // 실제 레포지토리 이름
  repoId="R_kgDOExample" // data-repo-id 값
  category="General" // data-category 값
  categoryId="DIC_kwDOExample" // data-category-id 값
/>
```

## 5. 예시 설정

실제 설정 예시:

```tsx
<Comments
  repo="lesacat/lesacat-blog"
  repoId="R_kgDOL8x9zA"
  category="General"
  categoryId="DIC_kwDOL8x9zM28"
/>
```

## 6. 테스트

1. 개발 서버 실행: `npm run dev`
2. 포스트 페이지로 이동
3. GitHub 계정으로 로그인하여 댓글 작성 테스트

## 주의사항

- Repository가 **public**이어야 댓글이 작동합니다
- Discussions가 활성화되어 있어야 합니다
- giscus 앱이 repository에 설치되어 있어야 합니다 ([자동 설치 링크](https://github.com/apps/giscus))

## 스타일링

댓글 디자인은 블로그의 종이질감 테마에 맞게 커스터마이징되어 있습니다:

- 검은색 테두리와 직각 모서리
- GowunDodum 폰트 적용
- 미니멀한 버튼 디자인
- 반응형 대응

설정이 완료되면 깔끔하고 일관성 있는 댓글 시스템을 사용할 수 있습니다!
