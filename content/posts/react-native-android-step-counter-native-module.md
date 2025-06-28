---
title: "ReactNative 안드로이드 만보기 네이티브로 만들어보기"
date: "2023-09-20"
description: "고객사의 요구사항으로 시작된 React Native 안드로이드 네이티브 만보기 서비스 개발 과정과 실무에서 마주한 이슈들"
tags: ["React Native", "Android", "네이티브 모듈", "만보기", "걸음수"]
category: "DEV"
---

<img src="../images/gif/step-counter/walk.gif" alt="걷기" style="width: 100%; max-width: 300px; border: 1px solid #ddd; border-radius: 8px;" />

</br>
</br>

안드로이드 자체 만보기 기능이 고객사에서 원하던 기능이었다. React Native 프로젝트에서 만보기를 구현해야 하는 상황이 되었다.

처음에는 당연히 기존 라이브러리를 사용하면 될 거라고 생각했다. React Native 생태계가 이렇게 방대한데 만보기 라이브러리 정도는 충분히 있을 거라고 생각했다.

## 왜 네이티브로 직접 구현하게 되었나

여러 라이브러리들을 찾아봤지만 상황이 생각만큼 좋지 않았다.

Android 8.0+ 백그라운드 제한으로 인해 불안정한 라이브러리들이 많았다. 앱이 백그라운드에서 종료되면 걸음 수 측정이 중단되는 치명적인 문제가 있었다.

그 외의 라이브러리들을 살펴보니 더욱 암울했다. 대부분의 라이브러리들이 업데이트가 되지않아 실무에서 사용하기 불가능한 느낌이었고, 다운로드 수도 100회 이하라 너무 리스크가 크다고 생각했다.

결국 안드로이드 네이티브에서 직접 작업해서 React Native 코드에서 네이티브 모듈로 호출하는 게 제일 괜찮은 방법이고, 이 방법밖에 없었다.

포그라운드 서비스로 24시간 안정 동작이 가능하고, Android 센서 API에 직접 접근해서 정확도를 높일 수 있었다.

이론적으로는 충분히 가능해 보였지만, 실제로 구현해보니 예상보다 복잡한 부분들이 많았다.

</br>

## 네이티브 만보기 구현 아키텍처

네이티브 만보기 시스템을 설계할 때 가장 중요하게 고려한 점들은 다음과 같았다.

**24시간 지속성 확보**  
사용자가 앱을 완전히 종료하거나 다른 앱을 사용하는 중에도 걸음 수 측정이 중단되면 안 된다. Android의 포그라운드 서비스를 활용해서 시스템이 임의로 서비스를 종료하지 못하도록 해야 했다. 특히 Android 8.0 이상에서 강화된 백그라운드 제한을 우회하는 것이 핵심이었다.

**데이터 무결성과 연속성**  
앱이 크래시되거나 기기가 재부팅되어도 그동안 측정된 걸음 수 데이터가 손실되면 안 된다. SQLite 데이터베이스에 실시간으로 저장하고, 부팅 완료 시 자동으로 서비스가 재시작되어 측정이 계속되도록 해야 했다. 또한 TYPE_STEP_COUNTER 센서의 특성상 재부팅 시 센서값이 리셋되는 문제도 해결해야 했다.

**센서 정확도와 신뢰성**  
TYPE_STEP_COUNTER 센서는 기기의 가속도계와 자이로스코프를 조합해서 정확한 걸음 수를 제공하는데, 이를 네이티브 레벨에서 직접 처리해서 정확도를 최대한 확보하려고 했다.

**React Native와의 원활한 연동**  
네이티브로 구현했지만 React Native 앱에서 쉽게 사용할 수 있어야 한다. 네이티브 모듈을 통해 JavaScript에서 걸음 수 조회, 서비스 시작/중지 등의 기능을 Promise 기반으로 호출할 수 있도록 브리지를 구현해야 했다. 복잡한 네이티브 로직을 숨기고 간단한 API로 제공하는 것이 목표였다.

### 데이터 흐름

**센서 데이터 수집** → **데이터 가공** → **데이터 저장** → **UI 업데이트** → **알림 표시**

- **센서 수집**: TYPE_STEP_COUNTER 센서에서 누적 걸음 수 수신
- **데이터 가공**: 초기값 보정 후 일일 걸음 수 계산
- **배치 저장**: 10걸음마다 SQLite에 효율적으로 저장
- **실시간 조회**: React Native에서 요청 시 최신 데이터 반환
- **알림 업데이트**: 포그라운드 서비스로 실시간 걸음 수 표시

### 핵심 컴포넌트 구현

**1. 데이터 모델 (MySteps.java)**

센서의 원시값과 실제 사용자에게 보여줄 걸음 수를 분리해서 관리한다. 센서 재보정이나 오류 수정 시 actualSteps만 조정할 수 있게 설계했다.

```java
public class MySteps {
    private long id;
    private int sensorSteps;    // 센서 원시값 (재부팅 시 리셋됨)
    private int actualSteps;    // 실제 걸음 수 (사용자에게 표시)
    private String date;        // 날짜 (YYYY-MM-DD)
    private long timestamp;     // 타임스탬프
}
```

**2. 만보기 서비스 (MyStepService.java)**

핵심 만보기 서비스로 TYPE_STEP_COUNTER 센서를 사용해서 24시간 지속적으로 측정한다. 10걸음마다 데이터베이스에 배치 저장하고, 포그라운드 알림으로 실시간 걸음 수를 표시한다.

```java
public class MyStepService extends Service implements SensorEventListener {
    private int initialSteps = 0;
    private boolean hasInitialValue = false;

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            int currentSteps = (int) event.values[0];

            if (!hasInitialValue) {
                initialSteps = currentSteps;
                hasInitialValue = true;
                return;
            }

            int todaySteps = currentSteps - initialSteps;

            // 10걸음마다 업데이트로 성능 최적화
            if (todaySteps % 10 == 0) {
                updateStepsInDatabase(todaySteps);
                updateNotification(todaySteps);
            }
        }
    }

    private Notification createNotification(int steps) {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("오늘의 걸음 수")
            .setContentText(steps + "걸음")
            .setSmallIcon(R.drawable.ic_steps)
            .setOngoing(true)  // 사용자가 임의로 제거 불가
            .build();
    }
}
```

**3. 부팅 리시버 (MyStepReceiver.java)**

기기 재부팅 시 자동으로 만보기 서비스를 시작시킨다. 사용자가 별도로 앱을 실행하지 않아도 자동으로 동작한다.

```java
public class MyStepReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Intent serviceIntent = new Intent(context, MyStepService.class);
            context.startForegroundService(serviceIntent);
        }
    }
}
```

**4. React Native 브리지 (MyStepServiceModule.java)**

JavaScript에서 네이티브 만보기 기능을 사용할 수 있게 해주는 브리지다. Promise 기반으로 비동기 처리를 지원한다.

```java
@ReactModule(name = MyStepServiceModule.NAME)
public class MyStepServiceModule extends ReactContextBaseJavaModule {
    @ReactMethod
    public void startStepService() {
        Intent intent = new Intent(getCurrentActivity(), MyStepService.class);
        getCurrentActivity().startForegroundService(intent);
    }

    @ReactMethod
    public void getTodaySteps(Promise promise) {
        try {
            int steps = getDatabaseSteps();
            promise.resolve(steps);
        } catch (Exception e) {
            promise.reject("STEP_ERROR", e.getMessage());
        }
    }
}
```

**5. 권한 및 서비스 설정 (AndroidManifest.xml)**

```xml
<!-- 필수 권한들 -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

<!-- 부팅 시 자동 시작 리시버 -->
<receiver android:name=".MyStepReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter android:priority="1000">
        <action android:name="android.intent.action.BOOT_COMPLETED" />
    </intent-filter>
</receiver>

<!-- 만보기 포그라운드 서비스 -->
<service android:name=".MyStepService"
    android:enabled="true"
    android:exported="false"
    android:foregroundServiceType="health" />
```

특히 `ACTIVITY_RECOGNITION` 권한은 Android 10부터 런타임에 사용자가 직접 허용해야 해서 별도 권한 요청 로직이 필요하다.

</br>

## 데이터베이스 설계와 최적화

SQLite를 사용해서 걸음 수 데이터를 저장했다. 테이블 설계는 단순하게 했지만, 성능 최적화를 위한 인덱스 설정이 중요했다.

```sql
CREATE TABLE step_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensor_steps INTEGER NOT NULL,
    actual_steps INTEGER NOT NULL,
    date TEXT NOT NULL,
    timestamp INTEGER NOT NULL
);

CREATE INDEX idx_date ON step_data(date);
CREATE INDEX idx_timestamp ON step_data(timestamp);
```

데이터베이스 작업은 별도 스레드에서 처리하도록 했다. 메인 스레드에서 DB 작업을 하면 센서 이벤트 처리가 지연되고 ANR(Application Not Responding)이 발생할 수 있기 때문이다.

```java
private void updateStepsInDatabase(int steps) {
    executorService.execute(() -> {
        try {
            SQLiteDatabase db = dbHelper.getWritableDatabase();
            ContentValues values = new ContentValues();
            values.put("actual_steps", steps);
            values.put("timestamp", System.currentTimeMillis());

            db.insertOrThrow("step_data", null, values);
        } catch (Exception e) {
            Log.e(TAG, "DB 업데이트 실패", e);
        }
    });
}
```

</br>

## React Native에서 네이티브 모듈 호출

React Native에서는 다음과 같이 간단하게 사용할 수 있도록 했다.

```javascript
import { NativeModules } from "react-native";
const { MyStepService } = NativeModules;

// 서비스 시작
const startStepCounter = async () => {
  try {
    await MyStepService.startStepService();
    console.log("만보기 서비스 시작됨");
  } catch (error) {
    console.error("서비스 시작 실패:", error);
  }
};

// 오늘 걸음 수 조회
const getTodaySteps = async () => {
  try {
    const steps = await MyStepService.getTodaySteps();
    setSteps(steps);
  } catch (error) {
    console.error("걸음 수 조회 실패:", error);
  }
};
```

</br>

## 실무에서 마주한 이슈들

### 센서 정확도 문제

가장 큰 문제는 센서 정확도였다. 기기마다, 사용자의 걸음 패턴마다 측정값이 달랐다.

```java
// 걸음 수 보정 로직 추가
private int calibrateSteps(int rawSteps, float sensitivity) {
    // 사용자별 보정 계수 적용
    return Math.round(rawSteps * sensitivity);
}
```

실제로 100걸음을 걸어서 센서값과 비교 테스트를 여러 번 했다. 기기별로 5-10% 정도의 오차가 있었지만, 사용자가 직접 보정할 수 있는 기능을 추가해서 해결했다.

### 메모리 누수

장시간 실행되는 서비스라서 메모리 누수가 치명적이었다. Handler나 다른 객체들이 Service를 강하게 참조하면 가비지 컬렉터가 서비스를 메모리에서 해제하지 못해서 메모리 누수가 발생한다. WeakReference로 약한 참조를 만들어서 서비스가 종료될 때 메모리가 정상적으로 해제되도록 했다.

```java
private static class StepHandler extends Handler {
    private final WeakReference<MyStepService> serviceRef;

    StepHandler(MyStepService service) {
        this.serviceRef = new WeakReference<>(service);
    }
}
```

### 배터리 최적화로 인한 종료

일부 제조사의 배터리 최적화 기능 때문에 서비스가 임의로 종료되는 문제가 있었다. 삼성, 샤오미 등은 자체적인 배터리 최적화 정책이 있어서 포그라운드 서비스라도 강제로 종료시키는 경우가 있었다. 사용자에게 배터리 최적화 해제를 직접 안내해서 앱이 화이트리스트에 포함되도록 유도했다.

```java
// 배터리 최적화 해제 안내
Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
intent.setData(Uri.parse("package:" + getPackageName()));
startActivity(intent);
```

</br>

## 테스트와 검증

개발 완료 후 다양한 테스트를 진행했다. 특히 실제 사용 환경에서의 정확도와 안정성을 검증하는 것이 중요했다.

**1. 정확도 테스트**

삼성 헬스, 구글 핏 같은 대표적인 워크아웃 앱들과 걸음 수를 비교해서 측정했다. 동일한 경로를 걸으며 오차 범위를 확인했는데, 대부분 5% 이내의 차이를 보였다.

**2. 배터리 테스트**

걸음 수 측정을 활성화한 상태에서 퇴근 후 자연스러운 사용 패턴으로 24시간 테스트했다. 일반적으로 하루 3-4% 정도의 추가 배터리 소모가 있었지만 사용자가 체감할 정도는 아니었다.

**3. 백그라운드 지속성 테스트**

단순히 앱을 종료하는 것이 아니라 푸시 알림에서 서비스를 강제로 종료시키면 측정이 중단되는 문제가 있었다. 이런 예외 상황들을 파악해서 서비스 재시작 로직을 보완했다.

가장 중요한 테스트는 실제 사용자들과 함께 한 베타 테스트였다. 일주일간 실제로 사용해보면서 정확도와 배터리 소모량을 확인했다.

</br>

## 프로덕션 배포 시 고려사항

실제 서비스에 적용할 때는 단순히 기능 구현만으로는 부족했다.

**사용자 온보딩**이 특히 중요했다. 권한 요청 시 "걸음 수 측정을 위해 필요합니다"라는 명확한 설명을 제공하고, 배터리 최적화 해제 가이드도 별도로 만들었다.

**에러 처리**도 꼼꼼하게 했다. 센서 접근 권한이 없거나 기기에 센서가 없는 경우, 예상치 못한 시스템 오류 등 다양한 예외 상황에 대비해서 앱이 크래시되지 않도록 방어 로직을 추가했다.

```java
try {
    // 센서 작업
} catch (SecurityException e) {
    // 권한 부족
    requestPermissions();
} catch (Exception e) {
    // 기타 에러는 로그 수집 후 기본값 반환
    logError(e);
    return getDefaultSteps();
}
```

**데이터 백업**도 고려했다. 앱 삭제 시 걸음 수 데이터가 모두 사라진다는 점을 사용자에게 미리 안내하고, 향후 클라우드 동기화 기능 추가를 계획했다.

</br>
</br>

## 마무리하며..

처음에는 "구글 핏을 연동한 써드파티 앱에서 걸음수 정보를 가져와서 처리하면 되지 않을까?"라고 생각했다. 하지만 고객사의 완고한 요청으로 기획이 급하게 변경되면서 짧은 기간에 네이티브 구현을 해야 했다.

생각보다 복잡한 부분들이 많았다. 센서 정확도, 배터리 최적화, 메모리 관리, 권한 처리 등 고려해야 할 것들이 산더미였다. 특히 24시간 지속 실행되는 서비스라서 작은 실수 하나가 사용자 경험에 큰 영향을 주었다.

하지만 라이브러리 의존을 피하고 직접 구현한 덕분에 고객사의 요구사항을 충족시킬 수 있었다. 외부 의존성 없이 순수하게 Android 센서 API만 사용해서 안정적으로 동작시킬 수 있었다.

React Native에서 네이티브 모듈을 직접 개발하는 경험을 쌓을 수 있어서 나쁘지 않은 시간이었다. 안드로이드 시스템에 대한 이해도가 깊어지는 좋은 기회였고, 앞으로 비슷한 요구사항이 들어와도 대응할 수 있는 경험이 되었다.
