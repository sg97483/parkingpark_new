// src/declarations.d.ts 또는 프로젝트 루트(declarations.d.ts)

declare module 'redux-persist/integration/react';
declare module 'react-native-flash-message';
declare module 'react-native-popup-menu';
declare module 'react-native-orientation-locker';

// 예: 아래처럼 타입이 없거나 타입이 깨지는 npm 모듈만 추가
// declare module 'my-custom-legacy-module';

// 예시: 직접 작성한 커스텀 유틸 타입, 글로벌 타입도 여기에 추가 가능
// interface MyCustomGlobalType { ... }
