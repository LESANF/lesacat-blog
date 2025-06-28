---
title: "iOS 17 최신 업데이트로 인한 긴급 이슈 대응기"
date: "2023-11-27"
description: "iOS 17 출시 후 발생한 카메라 크래시 문제를 오픈소스 커뮤니티와 함께 해결한 과정과 향후 iOS 업데이트 대응 전략"
tags: ["iOS", "React Native", "문제해결", "장애대응", "오픈소스", "긴급배포"]
category: "DEV"
---

<img src="../images/gif/ios17-camera-crash-fix/nervous.gif" alt="초조" style="width: 100%; max-width: 300px; border: 1px solid #ddd; border-radius: 8px;" />

</br>
</br>

월요일 아침, 고객사 대응팀에서 연락이 왔다. 아이폰 유저들이 갑자기 식단을 기록하기 위해 촬영을 했는데 사진 촬영 버튼을 눌러도 응답이 없다는 이슈가 다발적으로 들어왔다는 것이었다.

"어제까지 잘 됐는데요?"라는 말이 계속 반복되는 걸 보니 뭔가 큰 변화가 있었던 것 같았다.

원인을 찾기위해 프로젝트를 실행하여 개발쪽부터 테스트하기 시작했지만, 큰 이슈는 없었다.

실기기 테스트를 위해 나와 동료 그리고 테스트용 아이폰 모두 테스트를 해봤다. 그런데 이상했다.

되는 기종이 있고 안 되는 기종이 있었다. 같은 아이폰인데 왜?

기기별로 iOS 버전을 확인해보니 패턴이 보였다. iOS 17로 업데이트한 기기에서만 카메라가 작동하지 않았다.

실제로 어떤 문제였는지 확인해보면

<div style="display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap; margin: 20px 0;">
  <div style="flex: 1; min-width: 280px;">
    <h4 style="margin-top: 0;"><strong>iOS 17에서 실패하는 경우</strong></h4>
    <img src="../images/gif/ios17-camera-crash-fix/fail.gif" alt="iOS 17 카메라 실패" style="width: 100%; max-width: 300px; border: 1px solid #ddd; border-radius: 8px;" />
  </div>
  <div style="flex: 1; min-width: 280px;">
    <h4 style="margin-top: 0;"><strong>iOS 16에서 정상 작동하는 경우</strong></h4>
    <img src="../images/gif/ios17-camera-crash-fix/success.gif" alt="iOS 16 카메라 성공" style="width: 100%; max-width: 300px; border: 1px solid #ddd; border-radius: 8px;" />
  </div>
</div>

</br>
</br>

iOS 17에서는 카메라 버튼을 눌러도 아예 반응이없는 상황이었다. iOS 17로 올라가면서 공식 문서에서 카메라 관련 설정이 변경된 게 틀림없었다.

나는 [`react-native-vision-camera`](https://github.com/mrousavy/react-native-vision-camera) 라이브러리를 사용하고 있었는데, 문제를 해결하기위해 Github 이슈탭에서 찾아봤으나 나와 같은 사례는 없어서 [이슈를 등록](https://github.com/mrousavy/react-native-vision-camera/issues/1986)했다.

해당 이슈가 첫 이슈였던 것 같다. 금세 많은 관심을 받았고 비슷한 문제를 겪는 개발자들이 댓글을 달기 시작했다.

사용자들은 계속해서 카메라를 사용하지 못하고 있는 상황이라 라이브러리를 일시적으로 버리고 기본 카메라 메서드를 사용해서 빠르게 수정한 뒤, [빠른 앱 심사 요청](https://developer.apple.com/contact/topic/SC1103/subtopic/30025/solution/select)을 이용해서 재배포하기로 했다.

다행히 몇 시간 내에 심사가 통과됐고, 강제 업데이트 기능을 통해 카메라가 작동하지 않는 상황을 막을 수 있었다.

### react-native-vision-camera 임시 복구

기본 카메라로 급한 불은 껐지만, 여전히 아쉬웠다. react-native-vision-camera의 성능과 기능이 훨씬 좋았기 때문이다.

계속 Github 이슈를 모니터링하던 중, iOS 17에서 발생하는 구체적인 에러를 확인할 수 있었다.

```bash
Error Domain=AVFoundationErrorDomain Code=-11800
The operation could not be completed
UserInfo={
  NSUnderlyingError=0x28006b360 {
    Error Domain=NSOSStatusErrorDomain
    Code=-16800 "(null)"
  },
  NSLocalizedFailureReason=An unknown error occurred (-16800),
  AVErrorRecordingFailureDomainKey=4,
  NSLocalizedDescription=The operation could not be completed
}
```

이 문제는 **iOS 17 이상**에서만 발생했다. iOS 16에서는 정상 작동했다. 라이브러리 메인테이너가 [Apple Developer Forum](https://developer.apple.com/forums/thread/717565)의 사례를 언급하며 "이건 애플 자체 버그일 가능성도 있다"고 했다. iOS 17 출시 직후라 애플의 AVFoundation 프레임워크에 변경사항이 있었을 가능성이 높았다.

실제로 다음과 같은 간단한 코드에서도 무반응이 발생했다.

```javascript
const device = useCameraDevice("back");

try {
  if (tempPath === "") {
    setIsActive(false);
    const photo = await cameraRef.current.takePhoto({
      flash: "off",
    });

    let rotatedUri = photo.path;
    await foodLensProcess(rotatedUri);
  }
} catch (err) {
  alert(err);
  console.log("takePhoto catch :", err);
}
```

이슈의 정보를 참고해서 네이티브 카메라 설정을 조정해보니 react-native-vision-camera가 iOS 17에서도 작동했다.

```swift
// 카메라 성능 우선순위 변경으로 iOS 17에서 react-native-vision-camera 임시 사용
photoSettings.photoQualityPrioritization = .speed // instead of .quality
```

이 설정으로 react-native-vision-camera를 iOS 17에서도 사용할 수 있게 되었다. 하지만 여전히 임시방편이라는 느낌이 강했다. 네이티브 설정을 변경해서 라이브러리를 억지로 사용하는 것이 실무적으로는 불안했고, 언제 다시 문제가 생길지 모르는 상황이었다.

결국 react-native-vision-camera 라이브러리에서 iOS 17 호환성을 개선한 새 버전이 배포되었다. 라이브러리 메인테이너와 커뮤니티가 함께 여러 워크어라운드를 찾아내고 테스트한 결과였다. 그제서야 네이티브 설정 변경 없이 원래대로 라이브러리를 사용할 수 있게 되었다.

이번 경험을 통해 iOS 메이저 업데이트 때는 항상 예상치 못한 문제가 기다리고 있다는 걸 다시 한번 느꼈다. 특히 카메라, 마이크 같은 하드웨어 관련 API는 더욱 그렇다.

오픈소스 커뮤니티의 힘도 다시 한번 느꼈다. 혼자 끙끙댔다면 원인 파악에 훨씬 오래 걸렸을 것이다. 같은 문제를 겪는 개발자들과 정보를 공유하니 빠르게 해결 방향을 찾을 수 있었다.

그리고 무엇보다 빠른 임시 대응과 근본적 해결의 균형이 중요하다는 걸 배웠다. 사용자 경험을 위해서는 우선 임시 방편으로라도 문제를 해결하고, 병행해서 근본적인 해결책을 찾아가는 것이 현실적이다.
