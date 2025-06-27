---
title: "3년 묵은 React Native 0.70.5에서 탈출하기"
date: "2024-03-12"
description: "victory-native-xl 사용을 위한 React Native 마이그레이션과 네이티브 빌드 에러 해결 과정"
tags: ["React Native", "마이그레이션", "업데이트", "버전업", "레거시"]
category: "DEV"
---

회사에 입사하고 프로젝트를 살펴보니 React Native 버전이 0.70.5였다. 처음 회의에서 "React Native 버전이 너무 오래된 것 같은데 업데이트를 고려해보면 어떨까요?"라고 말을 꺼냈지만, "일정이 빠듯하니 지금은 돌아가니까 그냥 두자"는 결론이 났다.

하지만 결국 피할 수 없는 순간이 왔다.

## 의존성 충돌의 시작

프로젝트에서 고성능 차트가 필요해졌다. victory-native-xl을 사용하려고 했는데, 라이브러리 의존성 충돌이 발생했다.

victory-native-xl이 요구하는 핵심 라이브러리들이 React Native 0.70.5와 호환되지 않았다. 특히 @shopify/react-native-skia는 React Native 0.72 이상에서만 안정적으로 동작했다.

결국 근본적인 해결책은 React Native 자체를 업그레이드하는 것뿐이었다.

</br>

## 마이그레이션 준비

[React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/?from=0.70.5&to=0.72.15)를 사용해서 0.70.5에서 0.72.15로 올리는 변경사항들을 확인했다. 하지만 이 도구도 완벽하지 않다는 걸 나중에 깨달았다.

실제로는 Helper에서 보여주지 않는 세부 설정들 때문에 빌드가 깨지는 경우가 많았다.

</br>

## 주요 빌드 에러와 해결 과정

### 문제 1: PropTypes 완전 제거 에러

**에러**: `Cannot find module 'deprecated-react-native-prop-types'`  
**해결**: React Native 0.72에서 PropTypes가 완전히 제거되어 별도 패키지가 필수가 되었다

```jsx
{
  "react": "18.2.0",
  "react-native": "0.72.15",
  "@react-native/metro-config": "^0.72.11",
  "deprecated-react-native-prop-types": "^4.2.3" // 추가 필요
}
```

### 문제 2: Android Namespace 에러

**에러**: `Namespace not specified. Please specify a namespace in the module's build.gradle file.`  
**해결**: android/app/build.gradle에 namespace 추가

```jsx
android {
    namespace "com.yourapp.name" // 필수 추가
    compileSdkVersion rootProject.ext.compileSdkVersion

    defaultConfig {
        applicationId "com.yourapp.name" // namespace와 동일해야 함
        // ...
    }
}
```

### 문제 3: Android Gradle 호환성

**에러**: Gradle 버전 호환성 문제  
**해결**: android/build.gradle에서 AGP(Android Gradle Plugin) 버전 업데이트

```jsx
buildscript {
    ext {
        // fallback 값들을 React Native 0.72 호환 버전으로 업데이트
        buildToolsVersion = findProperty('android.buildToolsVersion') ?: '33.0.0'
        compileSdkVersion = Integer.parseInt(findProperty('android.compileSdkVersion') ?: '33')
        targetSdkVersion = Integer.parseInt(findProperty('android.targetSdkVersion') ?: '33')
        kotlinVersion = findProperty('android.kotlinVersion') ?: '1.7.00'
    }
    dependencies {
        classpath('com.android.tools.build:gradle:7.4.2') // AGP 버전 업데이트
        classpath('com.facebook.react:react-native-gradle-plugin')
    }
}
```

### 문제 4: Metro 설정 충돌

**에러**: Metro 번들러 설정 오류  
**해결**: expo/metro-config 사용으로 변경

```jsx
// Before
const { getDefaultConfig } = require("metro-config");

// After
const { getDefaultConfig } = require("expo/metro-config");
const { mergeConfig } = require("@react-native/metro-config");
```

### 문제 5: iOS Pod 의존성

**에러**: iOS 빌드 실패  
**해결**: Podfile 업데이트 및 Hermes 활성화

```jsx
platform :ios, '12.4'

target 'YourApp' do
  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true
  )
end
```

</br>

## 빌드 환경 완전 초기화

마이그레이션 과정에서 빌드 환경을 완전히 초기화하는 것이 많은 문제를 해결해준다.

### Android 클린 삭제

```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
```

### iOS 클린 삭제

```bash
cd ios
rm -rf Pods Podfile.lock
cd ..
rm -rf node_modules
rm -rf ~/Library/Developer/Xcode/DerivedData
pod cache clean --all
npm install
cd ios && pod install
```

iOS는 Podfile.lock, DerivedData, Pods 폴더, Pod 캐시 등을 모두 삭제해야 한다. 특히 DerivedData는 Xcode 빌드 캐시 때문에 정체불명의 에러가 발생하는 경우가 많아서 반드시 삭제해야 한다.

</br>

## 마이그레이션 후 달라진 점

### 성능이 확실히 빨라졌다

Hermes 엔진이 기본 활성화되면서 앱 전체가 확실히 빨라졌다. 앱 시작 시간, JavaScript 실행 속도, 메모리 사용량 모두 개선되었다. 특히 리스트 스크롤링이나 복잡한 애니메이션에서 확실한 차이를 느낄 수 있었다.

### 최신 라이브러리 사용 가능

마이그레이션의 가장 큰 목적이었던 victory-native-xl을 드디어 사용할 수 있게 되었다. react-native-reanimated 3.x 버전도 문제없이 동작하면서 애니메이션 성능이 확연히 개선되었다.

### 새로운 아키텍처 준비 완료

Runtime Scheduler가 활성화되면서 향후 React Native의 새로운 아키텍처(Fabric, TurboModules)로의 전환이 수월해졌다.

</br>

"일정이 빠듯하니까 나중에"라고 미루는 것보다는, 새로운 기능 요구사항이 나오기 전에 미리 업데이트하는 게 훨씬 효율적이다.

특히 빌드 환경 완전 초기화가 정말 중요하다. iOS의 경우 Pods, DerivedData, 캐시 등을 모두 삭제하고 처음부터 시작하는 것이 대부분의 문제를 해결해준다.

3년치 기술 부채를 한 번에 갚는 건 생각보다 고된 일이었지만, 마이그레이션 후 Hermes 엔진의 성능 개선과 최신 라이브러리 활용 가능성을 보면 충분히 가치 있는 작업이었다.

핵심은 클린 삭제 → 단계별 진행 → 문제 발생 시 다시 클린 삭제의 반복이다. Helper는 시작점일 뿐, 실제 빌드 환경의 복잡성은 직접 마주해야만 해결할 수 있다.
