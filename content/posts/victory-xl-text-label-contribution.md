---
title: "오픈소스 차트 라이브러리 컨트리뷰터가 되어보자(실무를 곁들인)"
date: "2024-07-29"
description: "Victory Native XL 막대 차트에 텍스트 표시 기능이 없어서 직접 구현하고 오픈소스 커뮤니티에 기여한 과정"
tags: ["React Native", "victory-native-xl", "오픈소스", "차트", "컨트리뷰터"]
category: "DEV"
---

고객사에서 "차트 막대 위에 수치를 표시해달라"는 요청이 들어왔다. 언뜻 간단해 보이는 요구사항이었지만, 우리가 사용 중인 [victory-native-xl](https://github.com/FormidableLabs/victory-native-xl) 라이브러리에는 막대 차트 위에 텍스트를 표시하는 기능이 없었다.

기존 메인 차트 라이브러리로는 고객사가 원하는 플렉시블한 차트 인터랙션을 구현할 수 없어서 victory-native-xl을 도입했는데, 정작 가장 기본적인 텍스트 표시 기능이 빠져있었던 것이다.

## 고성능 차트가 필요했던 배경

다이트 앱에서 사용자의 건강 데이터를 차트로 보여주는 기능을 개발하고 있었다. 단순히 데이터를 보여주는 것이 아니라 사용자가 터치하고 드래그하며 데이터를 탐색할 수 있는 부드러운 인터랙션이 필요했다.

기존에 사용하던 차트 라이브러리로는 네이티브 수준의 터치 반응성을 구현할 수 없었다. 그래서 React Native 버전 업그레이드와 함께 도입한 것이 victory-native-xl이었다.

## 막대 차트 위 텍스트 표시 기능의 부재

victory-native-xl로 멋진 인터랙티브 차트는 만들 수 있었지만, 막대 위에 수치를 표시하는 기능이 없다는 치명적인 문제가 있었다. 사용자 입장에서는 막대의 높이만 보고 정확한 수치를 유추해야 하는 불편함이 있었다.

**기존 Bar 컴포넌트:**

```jsx
// 기존 코드 - 텍스트 표시 기능 없음
<Bar points={data} chartBounds={chartBounds} color="#22c55e" />
```

## 라이브러리 내부 구조 분석

문제를 해결하기 위해 victory-native-xl의 내부 구조를 분석하기 시작했다. @shopify/react-native-skia를 기반으로 한 고성능 렌더링이 핵심이었고, Bar 컴포넌트는 다음과 같은 구조였다:

```jsx
// 기존 Bar 컴포넌트 구조
export const Bar = ({ points, chartBounds, innerPadding, ... }) => {
  const { path } = useBarPath(points, chartBounds, innerPadding);

  return <Path path={path} color={color} />;
};
```

막대를 그리는 로직은 있지만, 텍스트를 배치할 위치 정보를 제공하지 않았다. 각 막대의 위치를 계산하는 useBarPath 훅을 수정해서 위치 정보를 추가로 반환하도록 해야 했다.

</br>

## 직접 구현하기

### 1단계: useBarPath 훅 수정

먼저 각 막대의 위치 정보를 추가로 반환하도록 useBarPath 훅을 수정했다:

- 기존: 막대를 그리는 path 정보만 반환
- 개선: 각 막대의 x, y 좌표 정보를 추가로 수집해서 반환
- 목적: 텍스트를 배치할 정확한 위치를 알기 위함

```jsx
// 기존 코드
export const useBarPath = (points, chartBounds, innerPadding, ...) => {
  const { path } = React.useMemo(() => {
    const path = Skia.Path.Make();

    points.forEach(({ x, y, yValue }) => {
      // 막대 그리기 로직만 존재
      path.addRect(Skia.XYWHRect(x - barWidth / 2, y, barWidth, barHeight));
    });

    return { path };
  }, [points, barWidth]);

  return { path };
};

// 수정된 코드 - 막대 위치 정보 추가
export const useBarPath = (points, chartBounds, innerPadding, ...) => {
  const { path, barPositions } = React.useMemo(() => {
    const path = Skia.Path.Make();
    const barPositions: BarPosition[] = []; // 위치 정보 배열 추가

    points.forEach(({ x, y, yValue }) => {
      const barHeight = yScale(0) - y;
      path.addRect(Skia.XYWHRect(x - barWidth / 2, y, barWidth, barHeight));

      // 막대 위치 정보 저장
      barPositions.push({
        x: x - barWidth / 2 + barWidth / 2,
        y: y
      });
    });

    return { path, barPositions }; // 위치 정보도 함께 반환
  }, [points, barWidth, yScale]);

  return { path, barPositions, barWidth };
};
```

### 2단계: Bar 컴포넌트에 텍스트 렌더링 로직 추가

위치 정보를 받아서 텍스트를 렌더링하는 로직을 Bar 컴포넌트에 추가했다:

- 막대 위치 정보를 활용해 텍스트 배치 좌표 계산
- children으로 받은 텍스트 컴포넌트에 좌표 정보 전달
- textOffsetX, textOffsetY로 미세 조정 가능하도록 구현

```jsx
// 수정된 Bar 컴포넌트
type CartesianBarProps = {
  // 기존 props...
  textOffsetX?: number; // x축 offset 추가
  textOffsetY?: number; // y축 offset 추가
  children?: ReactNode; // 텍스트 컴포넌트를 children으로 받음
};

export const Bar = ({
  points,
  chartBounds,
  textOffsetX = 0,
  textOffsetY = 0,
  children,
  ...ops
}) => {
  const { path, barPositions } = useBarPath(points, chartBounds, innerPadding, ...);

  return (
    <>
      {/* 기존 막대 렌더링 */}
      <PathComponent path={path} color={ops.color || 'black'} {...ops} />

      {/* 새로 추가된 텍스트 렌더링 로직 */}
      {barPositions.map((barPosition, index) =>
        React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            // 막대 중앙 상단에 텍스트 배치
            const textX = barPosition.x + textOffsetX;
            const textY = barPosition.y - 20 + textOffsetY + 10;

            const textWidth = child.props.text.length * 6;
            const textHeight = 12;

            return React.cloneElement(child, {
              x: textX - textWidth / 2, // 중앙 정렬
              y: textY + textHeight / 2,
            });
          }
          return child;
        }),
      )}
    </>
  );
};
```

### 3단계: 사용법 구현

이제 다음과 같이 막대 차트 위에 텍스트를 표시할 수 있게 되었다:

- Bar 컴포넌트 children으로 SkiaText 전달
- 각 데이터 포인트마다 텍스트 생성
- textOffsetY로 텍스트 위치 조정

```jsx
// 개선된 사용법
<Bar points={data} chartBounds={chartBounds} color="#22c55e" textOffsetY={-10}>
  {data.map((point, index) => (
    <SkiaText
      key={index}
      text={point.yValue.toString()}
      font={font}
      color="black"
    />
  ))}
</Bar>
```

</br>

## 결과물

<div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin: 20px 0;">
  <div style="flex: 1; min-width: 280px;">
    <img src="../images/victory-xl-contributer/victory-xl-bar-text.png" alt="Victory XL 막대 차트 텍스트 표시" style="width: 100%; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;" />
  </div>
</div>

</br>

## GitHub 이슈 등록 및 커뮤니티 공유

기능 구현을 완료한 후, 같은 문제를 겪을 다른 개발자들을 위해 [GitHub에 이슈를 등록](https://github.com/FormidableLabs/victory-native-xl/issues/318)했다.

</br>

## 커뮤니티 반응과 라이브러리 개선

이슈를 등록한 후 커뮤니티에서 긍정적인 반응을 얻었다. 다른 개발자들도 비슷한 기능이 필요했다는 댓글들이 달렸고, 라이브러리 메인테이너들도 관심을 보였다.

특히 라이브러리 개발사에서 직접 감사 인사와 함께 향후 공식 예제로 추가하고 싶다는 의견을 주었다:

<div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin: 20px 0;">
  <div style="flex: 1; min-width: 280px;">
    <img src="../images/victory-xl-contributer/thanks.png" alt="라이브러리 개발사의 감사 인사" style="width: 100%; border: 1px solid #ddd; border-radius: 8px;" />
  </div>
</div>

이렇게 오픈소스 커뮤니티에서 인정받는 기여를 할 수 있어서 뿌듯했다. 내가 겪은 문제가 다른 개발자들에게도 도움이 될 수 있다는 걸 실감했다.

이번 경험을 통해 몇 가지 중요한 걸 배웠다. 첫 번째는 오픈소스 기여가 생각보다 어렵지 않다는 것이다. 거창한 새 기능을 만들거나 복잡한 버그를 고칠 필요가 없다. 내가 실제로 겪은 문제를 해결하고 그 과정을 공유하는 것만으로도 충분히 의미 있는 기여가 된다.

단순히 "텍스트 표시 기능이 없으니까 다른 라이브러리를 찾아보자"라고 생각할 수도 있었다. 하지만 직접 문제를 파고들어 해결하면서 라이브러리 내부 구조를 이해하게 되었고, Skia 기반 렌더링에 대한 지식도 쌓을 수 있었다.

그리고 오픈소스 커뮤니티의 힘도 느꼈다. 처음엔 막막했지만 같은 문제를 겪는 개발자들과 정보를 공유하니 빠르게 해결 방향을 찾을 수 있었다. 내 해결책이 다른 개발자들에게도 도움이 되는 걸 보면서 개발자로서 보람을 느꼈다.

오픈소스 생태계는 결국 서로 도움을 주고받는 선순환 구조다. 내가 매일 사용하는 라이브러리들도 누군가의 기여로 만들어진 것들이니까, 나도 그 생태계에 조금이라도 기여할 수 있어서 의미 있었다.
