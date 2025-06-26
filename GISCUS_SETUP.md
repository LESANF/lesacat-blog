# Giscus 댓글 시스템 설정 가이드

GitHub Discussions를 기반으로 한 댓글 시스템을 설정하는 방법입니다.

## 1. GitHub Repository에서 Discussions 활성화

1. **LESANF/lesacat-blog** 레포지토리로 이동
2. **Settings** 탭 클릭
3. **Features** 섹션에서 **Discussions** 체크박스 활성화

## 2. Discussions 카테고리 생성 (필수)

1. 레포지토리의 **Discussions** 탭으로 이동
2. **Categories** 섹션에서 새 카테고리 생성
3. 추천 설정:
   - **Name**: `Comments` 또는 `Blog Comments`
   - **Description**: `블로그 포스트 댓글`
   - **Format**: `Open-ended discussion`

## 3. Giscus 설정 정보 생성

1. [giscus.app](https://giscus.app/ko) 방문
2. **저장소** 섹션에 `LESANF/lesacat-blog` 입력
3. **페이지 ↔️ 토론 매핑** 선택: `pathname` (현재 설정됨)
4. **토론 카테고리** 선택: 위에서 생성한 `Comments` 카테고리 선택
5. **기능** 설정:
   - ✅ 반응 활성화 (현재 설정됨)
   - ✅ 메타데이터 전송 안함 (현재 설정됨)
   - 위치: 댓글 상자 하단 (현재 설정됨)
6. **테마**: `light` (현재 설정됨)

## 4. 카테고리 ID 확인 및 적용

giscus.app에서 카테고리를 선택하면 다음과 같은 설정이 생성됩니다:

```html
<script
  src="https://giscus.app/client.js"
  data-repo="LESANF/lesacat-blog"
  data-repo-id="R_kgDOPCU21w"
  data-category="Comments"
  data-category-id="DIC_kwDOPCU21xxxxx"
  ...
></script>
```

생성된 `data-category-id` 값을 복사하여 `src/components/ui/Comments.tsx` 파일의 다음 부분을 수정하세요:

```tsx
scriptElem.setAttribute("data-category", "Comments"); // 실제 카테고리 이름
scriptElem.setAttribute("data-category-id", "DIC_kwDOPCU21xxxxx"); // 실제 카테고리 ID
```

## 5. 현재 설정 상태

✅ **완료된 설정:**

- Repository: `LESANF/lesacat-blog`
- Repository ID: `R_kgDOPCU21w`
- Mapping: `pathname`
- Theme: `light`
- Language: `ko`
- Reactions: 활성화됨

⚠️ **설정 필요:**

- Discussions 카테고리 생성
- 카테고리 ID 입력

## 6. 테스트 방법

1. GitHub에서 Discussions 활성화 및 카테고리 생성
2. giscus.app에서 카테고리 ID 확인
3. `Comments.tsx`에 카테고리 ID 적용
4. 개발 서버 실행: `npm run dev`
5. 포스트 페이지로 이동하여 댓글 영역 확인
6. GitHub 계정으로 로그인하여 댓글 작성 테스트

## 7. 스타일링

댓글 디자인은 블로그의 종이질감 테마에 맞게 커스터마이징되어 있습니다:

- 검은색 테두리와 직각 모서리
- GowunDodum 폰트 적용
- 미니멀한 버튼 디자인
- 반응형 대응

## 8. 주의사항

- Repository가 **public**이어야 댓글이 작동합니다
- Discussions가 활성화되어 있어야 합니다
- giscus 앱이 repository에 설치되어 있어야 합니다 ([자동 설치 링크](https://github.com/apps/giscus))

설정이 완료되면 깔끔하고 일관성 있는 댓글 시스템을 사용할 수 있습니다!
