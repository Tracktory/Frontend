# Frontend (Expo)

Expo + React Native + React Navigation + Zustand 기반 앱입니다. 진입점은 프로젝트 루트의 `App.tsx`이며, `NavigationContainer` 안에서 `src/navigation/RootNavigator`가 전체 화면 트리를 담당합니다.

## 시작하기

1. 의존성 설치

   ```bash
   npm install
   ```

2. 개발 서버 실행

   ```bash
   npx expo start
   ```

   또는 `npm start`.

실행 후 [개발 빌드](https://docs.expo.dev/develop/development-builds/introduction/), [Android 에뮬레이터](https://docs.expo.dev/workflow/android-studio-emulator/), [iOS 시뮬레이터](https://docs.expo.dev/workflow/ios-simulator/), [Expo Go](https://expo.dev/go) 등으로 앱을 열 수 있습니다.

---

## 아키텍처·폴더 규칙

이 문서에 적힌 규칙을 기본 컨벤션으로 따릅니다. 새 기능·리팩터 시 아래를 우선합니다.

### 1. 라우팅 (Navigation)

- 모든 라우팅 정의·네비게이터 구성은 **`src/navigation/`** 에서만 진행합니다.
- 루트 스택, 온보딩 스택, 메인 탭 등 화면 등록·`ParamList` 타입·`initialRouteName`은 이 폴더의 파일로 한곳에서 관리합니다.
- 화면(`pages/*`)에서는 `navigation` 객체로 이동만 하고, 새 `Navigator`나 `Screen` 트리를 페이지 파일 안에 두지 않습니다. (화면 쪽에서 네비 타입이 필요하면 `navigation`에서 타입만 import 해도 됩니다.)

### 2. 상태·Props (Zustand / Stores)

- 화면 간·기능 간으로 넘기는 상태는 가능하면 props drilling 대신 **Zustand**로 `stores`에서 관리합니다.
- 온보딩 입력값 등 여러 스크린에서 공유되는 데이터는 **스토어가 단일 소스**가 되게 합니다.
- 순수 UI 전용 상태(모달 열림, 해당 화면만 쓰는 탭 인덱스 등)는 ViewModel의 `useState` 등으로 두어도 됩니다. 다만 **다음 화면·다른 탭에서도 필요**하면 스토어로 올립니다.

### 3. 스토어 구조 (ISP + 단일 진입점)

- **인터페이스 분리 원칙(ISP)** 에 따라 도메인·관심사별로 **`src/stores/slices/`** 에 슬라이스를 각각 둡니다. (예: 입학·소속, 트랙, 관심사 등 파일·타입 분리)
- 앱 코드에서는 슬라이스를 여기저기 직접 합치지 않고, `stores` 하위의 **하나의 진입 파일**(예: `onboardingStore.ts`)에서만 `persist`·슬라이스 병합·`create` 를 수행합니다.
- **import 원칙:** 외부에서는 `useOnboardingStore` 등 스토어 훅 하나(및 필요 시 그 파일에서 re-export 하는 타입)만 쓰는 것을 원칙으로 합니다.

### 4. 색상 (Styles)

- 색상·디자인 토큰은 **`src/styles/`** 에 정의하고, 화면·컴포넌트에서는 하드코딩 대신 해당 모듈을 import 해서 사용합니다.
- 공통 팔레트 변경 시 `styles`만 수정하면 되도록 합니다.

### 5. MVVM 지향

- **View:** `pages/*` 스크린 + 컴포넌트 — 레이아웃·표현·사용자 이벤트를 ViewModel에 위임합니다.
- **ViewModel:** `src/hooks/use*ViewModel.ts` — 스토어 구독, 파생 데이터, 네비게이션, API/mock 호출·시나리오(지연 응답 등)를 둡니다.
- **Model(상태·데이터):** `stores` + (향후) API/Repository·`data` 등.
- 새 기능은 화면 파일을 얇게 유지하고, 로직은 ViewModel·스토어로 나눕니다.

### 6. 컴포넌트 위치

| 구분 | 위치 | 용도 |
|------|------|------|
| 전역 공용 | `src/components/` | 여러 도메인·여러 페이지에서 재사용하는 UI (버튼, 프로그레스바, 채팅 공용 등) |
| 페이지 전용 | `pages/<기능폴더>/components/` | 해당 기능(온보딩·추천·마이페이지 등)에서만 쓰는 UI |

전역 컴포넌트는 `src/components`에 정의 후 import 합니다. 페이지 전용 컴포넌트는 `pages` 아래 해당 기능 폴더의 `components`에 두고, 같은 기능 폴더 안의 스크린에서 import 합니다. (예: `pages/onboarding/components/*` → `pages/onboarding/*Page.tsx`)

---

## 디렉터리 개요

| 경로 | 역할 |
|------|------|
| `App.tsx` | GestureHandler, SafeArea, `NavigationContainer`, `RootNavigator` 연결 |
| `src/navigation/` | 스택·탭·ParamList·화면 등록 |
| `src/pages/` | 화면(View) — 기능별 하위 폴더 |
| `src/hooks/` | `use*ViewModel` |
| `src/stores/` | Zustand 진입점·`slices/` |
| `src/styles/` | 색·토큰 |
| `src/components/` | 공용 UI |
| `src/data/` | mock 등 정적·테스트 데이터 |

## 참고

- [Expo 문서](https://docs.expo.dev/)
- `npm run lint` — ESLint (`expo lint`)
