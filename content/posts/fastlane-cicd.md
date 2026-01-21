---
title: "EAS 필요 없어!"
date: "2025-12-19"
description: "스크립트 하나로 개발, 운영 빌드 배포 모두 한방에 !"
tags:
  [
    "fastlane",
    "expo",
    "mobile-release",
    "firebase-app-distribution",
    "google-play",
    "testflight",
    "ci-cd",
    "zx",
  ]
category: "DEV"
---

<div style="display: flex; flex-direction: column; align-items: center;">
  <img src="../images/gif/fastlane-cicd/rick-dance.gif" alt="rick-dance" style="width: 100%; max-width: 320px; border: 1px solid #ddd; border-radius: 8px;" />
  <span style="display: block; text-align: center; margin-top: 8px;">(파이프라인 구축 후, 스토어 업로드 검증까지 마친 나의 기분...)</span>
</div>

</br>
</br>
</br>
</br>

Expo Continuous Native Generation(CNG) 환경에서 보통 빌드, 배포, OTA까지 EAS를 사용하면 누구나 손쉽게 프로젝트에대한 자동화 환경구축을 할 수 있다.

하지만 [`Expo.dev`](https://expo.dev/)의 서비스에 문제가 생기면 우리의 빌드, 배포과정에도 문제가 생긴다.

강력한 기능을 제공하는 것은 좋지만 너무 높은 의존성을 가지고있다고 생각하여 Fastlane을 이용한 자동화 환경을 구축하는 방향으로 작업을 진행했다.

관련 레퍼런스를 찾아보다 MJ님이 작성하신 [`Expo CNG 환경에서 로컬 환경의 Build & Submit 자동화하기 #1 - 개요`](https://medium.com/mj-studio/expo-cng-%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C-%EB%A1%9C%EC%BB%AC-%ED%99%98%EA%B2%BD%EC%9D%98-build-submit-%EC%9E%90%EB%8F%99%ED%99%94%ED%95%98%EA%B8%B0-1-%EA%B0%9C%EC%9A%94-9aa48a0ad8d3) 글을 읽게되었고 편하게 구축하나 싶었으나

군대가신후 2편이 나오지않고 있다 😭

하지만 전반적인 플로우나 힌트를 많이 얻었고, 이를 대한 지식을 바탕으로 자동화를 구축하면서 해맸던 부분과 끝내 성공한 구축기를 작성해본다.

글의 이해를 돕기위해서는 `Expo(CNG), ZX 스크립트, Fastlane에` 대한 전반지식이 있으면 좋다.

우선 바로 개발하기에 앞서 큰단위로 할일을 쪼개서 작업을 진행했다.

</br>

### - 개발, 운영의 환경 분리

### - 인증에대한 Key 관리(개발, 운영)

### - 배포 혹은 제출 완료 후 알림을 위한 자동화 메시지 처리

</br>

## 1. 개발, 운영의 환경 분리

CNG는 `prebuild`를 돌릴 때마다 ios/, android/가 다시 생성된다. 그래서 Fastlane을 네이티브 폴더 안에 직접 유지하면 언제든 덮어씌워질 위험이 있다. 해결책은 “템플릿은 루트에, 필요한 순간에만 주입”이다.

플랫폼을 구분하여 `fastlane-ios`, `fastlane-android` 폴더를 만들고 내부에 `development`, `production`으로 구분한다.

폴더구조로 표현한다면 아래와 같다.

```json
project-root/
├── fastlane-ios/
│   ├── development/
│   │   ├── Gemfile
│   │   ├── Gemfile.lock
│   │   ├── fastlane/
│   │   │   ├── Fastfile
│   │   │   ├── Matchfile
│   │   │   └── Pluginfile
│   │   └── .env.local      # export KEY=... (gitignore)
│   └── production/
│       ├── Gemfile
│       ├── Gemfile.lock
│       ├── fastlane/
│       │   ├── Fastfile
│       │   ├── Matchfile
│       │   └── Pluginfile
│       └── .env.local
├── fastlane-android/
│   ├── development/
│   │   ├── Gemfile
│   │   ├── Gemfile.lock
│   │   ├── fastlane/
│   │   │   ├── Fastfile
│   │   │   └── Pluginfile
│   │   └── .env.local
│   └── production/
│       ├── Gemfile
│       ├── fastlane/
│       │   └── Fastfile
│       └── .env.local
└── scripts/
    └── release.mjs         # prebuild → inject → fastlane 실행

```

네이티브 폴더에 주입시킬 요소들을 관리하고, `ZX 스크립트`를 사용하여 스크립트를 `JavaScript`로 쉽게 작성할 수 있다.

나는 프로젝트에서 `APP_ENV`를 사용하여 개발, 운영을 구분하고있는데 이 또한 스크립트로 작성하여 간단하게 멀티환경 구성을 할 수 있다.

우리는 기본적으로 `CNG`환경에서 작업하기 때문에, `Xcode`의 스키마에서 `pre-action`을 하지않아도되는 장점도 가지고 있다.

`prebuild`에서 올바르게 환경변수가 주입됐다하더라도, `expo-constants`에 의해 패키징 단계에서 환경변수가 주입안될 수 있으니 주의하자.

아래는 iOS 플랫폼에서 `prebuild`와 템플릿을 주입시키는 스크립트이다.

```js
async function injectIosTemplate(env) {
  const tpl = path.join("fastlane-ios", env);
  loadExportEnvFile(path.join(tpl, ".env.local"));
  await remove("ios/fastlane");
  await remove("ios/Gemfile");
  await remove("ios/Gemfile.lock");
  await $`cp -R ${path.join(tpl, "fastlane")} ios/fastlane`;
  await $`cp ${path.join(tpl, "Gemfile")} ios/Gemfile`;
  await $`cp ${path.join(tpl, "Gemfile.lock")} ios/Gemfile.lock`;
}

async function prepareIos(env) {
  process.env.APP_ENV = env;
  if (process.env.SKIP_PREBUILD !== "1") {
    await $`pnpm run prebuild:${env} -- -p ios --no-install`;
  }
  await injectIosTemplate(env);
  cd("ios");
  await $`bundle install`;
  cd(projectRoot);
}
```

</br>

## 2. 인증에대한 Key 관리(환경, 로컬|빌드 러너)

`CI/CD`에 있어서 인증에 대한 `Key`는 핵심요소이다. 전반적인 흐름을 모르거나 인증에대한 관리가 제대로 이루어지지 않으면, 파이프라인은 무너진다.

현재 개발기에대한 테스트 환경은 두 플랫폼 모두 `Firebase App Distribution`으로 통일하고있다.

사실 자동화 구축을 위해 많은 요소가 필요한데 개발 환경과 빌드 환경을 구분하여 정리해본다.

### Development

<img alt="image" src="../images/fastlane-cicd/fastlane02.png" />

개발 환경에서의 구축은 생각보다 간단하다. Fastlane을 사용하기위해 iOS의 정보를 조직의 `Private Repo`에서 관리하면된다.

그리고 `Firebase App Distribution`에대한 인증을 자동화하기 위하여 인증에대한 서비스 계정을 생성하고 관리한다.

`로컬`에서는 `JSON`형태로 관리하고, `빌드 러너`를 위하여 해당 값을 `base64`형태로 `GitHub Organization Actions Secrets/Variables`에 관리한다.

러너에서는 해당 요소를 다시 파일로 돌리는 작업이 필요하다.

- Fastlane iOS Match(adhoc) - Github Private Repo
- Google Cloud Platform(GCP) Service Account - Firebase 접근용 서비스 계정(JSON)

### Production

<img alt="image" src="../images/fastlane-cicd/fastlane01.png" />

운영 환경에서는 각 플랫폼 별로 스토어에 올리는 부분부터 분기점이 생기기때문에 해당 인증에대한 키도 별도로 관리해주어야한다.

완전 자동화를 위하여 업로드 단계에서 나오는 프롬포트들을 스킵하기위하여 운영환경에서 `App Store Connect API Key`를 사용한다.

전반적으로 `로컬`은 `.ignore`로 파일을 관리하던가 더 안전하게 관리하고싶다면 `빌드 러너`와 마찬가지로 조직에 등록한 키를 받아 파일로 변환하는 과정이 필요하다.

- Fastlane iOS Match(appstore) - Github Private Repo
- Android release-upload.jsk - AOS 운영 환경 서명
- App Store Connect API Key(ISSUER, CONNECT_KEY_ID, STORE_KEY) - iOS testFlight 업로드 인증
- Google Cloud Platform(GCP) Service Account - 내부 테스트 트랙 업로드 인증

</br>

## 3. 배포 혹은 제출 완료 후 알림을 위한 자동화 메시지 처리

이제 환경별로 빌드, 배포가 끝나게되면 팀원들에게 공지로 알림을 보내고싶었다.

우리회사는 슬랙을 사용하기 때문에, `Slack Webhook`을 사용한 공지를 자동화 했다.

앞선 폴더구조에서 각 배포에대한 `release.txt`파일을 관리하고있고 이는 메시지에 들어갈 단순 텍스트의 릴리즈노트이다.

Fastlane에서 `Slack Notify`메서드를 제공하지만 못생겼다...

슬랙에서 [Slack Block-kit](https://docs.slack.dev/block-kit/)이라는 메시지를 커스텀할 수 있는 빌더를 제공한다(로그인 필요)

각 조직에 있는 유저의 멘션또한 만들면서 테스트 할 수 있다.

빌더를 통하여 일관된 형태의 UI를 제공했다.

**[Block Kit 적용 전]**
<img alt="image" src="../images/fastlane-cicd/fastlane04.png" />

**[Block Kit 적용 후]**
<img alt="image" src="../images/fastlane-cicd/fastlane03.png" />

</br>

## 마무리 하며..

사실 `Expo(CNG)` + `Fastlane`을 구축한 레퍼런스가 많지않아 MJ님의 글이 많은 도움이 되었다.

이전도 그렇고 지금도 많은 사람들이 AOS에서 `gradle clean, build -> PlayConsole 접속 -> 테스트 트랙 이동 -> aab, apk 파일 업로드`

그리고 iOS에서는 `Xcode -> Scheme, Target 설정 -> Archive -> appStore | testFlight 업로드` 이렇게 진행할텐데

나역시 자동화를 구축하지 않은 환경에선 이렇게 작업을 많이했고 이는 실제로 기계나 사람이나 너무 피곤을 느끼게하는 작업이었다.

하지만 단 하나의 명령어 실행으로 `(개발 환경, 플랫폼 업로드, 푸쉬 알림)`을 구축하니 수동으로 빌드하고, 제출하던 시대로 못돌아갈 것 같다.

구축에 대한 비용은 높았지만 개인적으로 이러한 자동화 과정은 개발자의 스트레스뿐만 아니라 작업 시간까지 보장해주니 다들 한번씩 구축해봤으면 좋겠다.
