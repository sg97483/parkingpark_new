# NICE PASS(AppLink) - React Native(WebView) 대응 가이드

## 배경 (NICE 답변 요약)
- 2025-12-30 이후 모바일에서 **PASS App PUSH 방식 종료**
- 모바일에서 PASS 인증을 사용하려면 **AppLink(App to App / Deeplink) 방식**을 앱에서 처리해야 함
- AppLink 처리가 없으면 PASS 선택 시 즉시 실패하고 **SMS 인증만 가능**

## 목표
NICE 표준창(WebView)에서 PASS를 누를 때 발생하는 `intent://`, `market://` 등의 URL을 앱이 가로채서 **외부 앱(PASS/PlayStore)으로 정상 이동**시키기.

---

## 1) React Native `react-native-webview` 딥링크 처리

### 적용 위치
NICE 본인인증을 띄우는 `WebView` 컴포넌트 (회원가입/본인인증 화면).

### 구현 포인트
- Android에서 `onShouldStartLoadWithRequest`로 URL을 인터셉트
- 아래 스킴이면 `Linking.openURL(url)`로 외부 앱 실행 후 **WebView 로드는 막음(return false)**
  - `intent://`, `intent:`
  - `market://`, `market:`
  - (추가로 필요하면 PASS 관련 커스텀 스킴도 동일 방식으로 처리)

### 예시 코드(핵심만)

```tsx
import React, { useRef } from 'react';
import { Linking, Platform } from 'react-native';
import WebView from 'react-native-webview';

export function NiceCheckplusWebView() {
  const webviewRef = useRef<WebView>(null);

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: 'https://cafe.wisemobile.kr/imobile/check/check_pnum_main_android_t.php' }}
      onShouldStartLoadWithRequest={(req) => {
        const url = req.url ?? '';

        if (
          Platform.OS === 'android' &&
          (url.startsWith('intent:') ||
            url.startsWith('intent://') ||
            url.startsWith('market:') ||
            url.startsWith('market://'))
        ) {
          Linking.openURL(url).catch(() => {});
          return false;
        }

        return true;
      }}
      onLoadEnd={(e) => {
        // 성공 URL 감지 후 기존 로직 수행 (예: injectJavaScript)
        if (
          e?.nativeEvent?.url ===
          'https://cafe.wisemobile.kr/imobile/check/check_pnum_success_android_t.php'
        ) {
          // webviewRef.current?.injectJavaScript(jsCode);
        }
      }}
    />
  );
}
```

### 테스트 체크
- 동일 기기에서 **SMS 인증은 계속 정상**
- PASS 선택 시 즉시 “PASS앱을 실행할 수 없는 환경”이 뜨던 문제가,
  - PASS 앱으로 전환되거나(또는 앱 내부 인증 진행)  
  - 미설치 시 PlayStore로 이동  
  중 하나로 바뀌면 딥링크 처리가 된 것임

---

## 2) AndroidManifest.xml (Android 11+) PASS 3사 패키지 등록(queries)

NICE가 요청한 “이동통신 3사의 패키지명 등록”에 해당.

### 적용 파일
`android/app/src/main/AndroidManifest.xml`

### 적용 위치
`<manifest ...>` 내부, 보통 `<application>` 바깥에 추가.

```xml
<queries>
  <package android:name="com.sktelecom.pass" />
  <package android:name="com.kt.pass" />
  <package android:name="com.lguplus.pass" />
</queries>
```

---

## 3) NICE에 회신할 내용(체크리스트)

NICE가 요청한 회신 항목:
- [ ] **AndroidManifest.xml**에 3사 PASS 패키지 등록 여부(위 `queries`)
- [ ] WebView의 **`shouldOverrideUrlLoading`/딥링크 처리** 구현 여부
  - RN에서는 `onShouldStartLoadWithRequest`로 대체
- [ ] 구현 완료 후, **인증창 진입 시 EncodeData + 진입 시간** 제공

### EncodeData / 진입시간 제공 방법(권장)
- 서버(PHP) `check_pnum_main_android_t.php`에서 `$enc_data` 생성 직후 서버시간과 함께 로그 저장
- NICE에:
  - 생성 시간(서버시간 KST)
  - EncodeData(전체 또는 앞/뒤 일부 + 길이)
  를 전달하면 이력 확인이 쉬움

---

## 참고 정보(현재 운영 값)
- 호출 페이지(표준창 진입): `https://cafe.wisemobile.kr/imobile/check/check_pnum_main_android_t.php`
- 성공 return URL: `https://cafe.wisemobile.kr/imobile/check/check_pnum_success_android_t.php`
- SITECODE: 서버 PHP 환경변수로 관리 (소스코드·GitHub 저장 금지)

