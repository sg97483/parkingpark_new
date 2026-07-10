# NICE 휴대폰 본인인증 **S2S(표준창) 전환** — 백엔드 구현 요청 프롬프트

NICE 휴대폰 본인인증을 **기존 “성공 URL 로딩 → WebView injectJS로 페이지 텍스트 파싱” 방식**에서  
**신규모듈(표준창) S2S 방식**으로 전환해야 합니다.

프론트(React Native)는 이제:
- 서버에서 내려주는 `auth_url`로 NICE **표준창(WebView)** 을 띄우고
- 표준창 완료 후 `return_url`로 전달되는 `web_transaction_id`를 파싱해서
- 서버에 **인증 결과 조회**를 요청하는 구조입니다.

따라서 **백엔드에서 NICE S2S 호출을 대행하는 API를 반드시 구현**해야 합니다.  
특히 **`client_secret`은 앱에 절대 포함하면 안 되므로** 앱 단독으로는 구현이 불가능합니다.

### (중요) 현재 서버 환경 이슈로 백엔드 처리가 필수인 이유

- 기존 PHP 5.3.3 서버에서 NICE S2S `auth/token` 호출을 시도했으나 **`curl errno 35 (SSL connect error)`** 로 TLS 핸드셰이크 단계에서 실패합니다. 즉, **현 서버 스택(PHP/cURL/OpenSSL)로는 `https://auth.niceid.co.kr` 호출 자체가 불가**한 상태입니다.
- 또한 NICE S2S `auth/result` 응답의 `enc_data`는 가이드 기준 **AES-256-GCM** 복호화가 필요해, PHP 5.3 환경에서는 지원/구현 난이도 측면에서 안정적인 운영이 어렵습니다.

---

## 1) 키/배경 정보

- **Client ID / Client Secret**: NICE에서 발급받은 값을 **서버 환경변수/시크릿에만 저장** (소스코드·GitHub 저장 금지)
  - 예: `NICE_CLIENT_ID`, `NICE_CLIENT_SECRET`
- NICE 공식 가이드: `https://auth-guide.niceid.co.kr/`
- NICE S2S API (v1.0)
  - `POST https://auth.niceid.co.kr/ido/intc/v1.0/auth/token`
  - `POST https://auth.niceid.co.kr/ido/intc/v1.0/auth/url`
  - `POST https://auth.niceid.co.kr/ido/intc/v1.0/auth/result`
- 전환 기한: **6/30**

---

## 2) 백엔드가 제공해야 하는 API (프론트가 호출)

프론트 base URL은 현재 `http://cafe.wisemobile.kr:8080/` 를 사용 중입니다.  
아래 2개 엔드포인트를 구현해주세요.

### (프론트 연동 관점) 프론트가 기대하는 입출력/동작

- 프론트는 회원가입 화면(`Register`)에서 “휴대폰인증”을 누르면 `VerifyPhoneNumber` 화면(WebView 기반)으로 이동합니다.
- **S2S 표준창 플로우(권장)**:
  - 백엔드에서 `POST /nice/intc/auth-url`로 내려준 `auth_url`을 프론트가 WebView로 로드
  - 표준창 인증 완료 시 `return_url`로 `web_transaction_id`가 전달됨
  - 프론트가 `web_transaction_id`를 파싱하여 `POST /nice/intc/auth-result`로 결과 조회  
    (※ NICE 가이드상 `auth/result` 호출에는 `web_transaction_id` 뿐 아니라, `auth/url` 응답으로 받은 `transaction_id`와 `request_no`도 필요하므로 프론트에서 함께 전달 필요)
  - 백엔드가 휴대폰번호를 리턴하면 프론트가 회원가입 화면의 휴대폰번호 필드를 채움

#### 프론트가 기대하는 응답 필드명(권장)

- `POST /nice/intc/auth-url` 응답:

```json
{ "auth_url": "https://auth.niceid.co.kr/...", "request_no": "...", "transaction_id": "..." }
```

- `POST /nice/intc/auth-result` 응답(최소):

```json
{ "phone": "01012345678" }
```

> 프론트는 `phone`을 1순위로 사용하고, 필요 시 `mobile`/`mobile_no`도 대응 가능합니다. 가능하면 `phone`으로 통일해주세요.

#### 실패/취소 케이스 권장

- 인증 실패/취소 시에는 `4xx/5xx` + `{ message: "..." }` 형태로 내려주면 프론트에서 사용자 메시지 처리하기 쉽습니다.

#### 통합 테스트 시나리오(백엔드 기준)

- **성공**: `/auth-url` → WebView 표준창 인증 → `web_transaction_id` 수신 → `/auth-result` → `{ phone }` 반환
- **실패**: 토큰 발급 실패/URL 발급 실패/결과 복호화 실패 시 에러 코드 및 메시지 확인

### (A) `POST /nice/intc/auth-url`

**역할**: NICE S2S로 “표준창 인증 URL(`auth_url`)”을 발급받아 프론트에 반환

#### 프론트 요청 예시 (Request Body)

```json
{
  "return_url": "https://cafe.wisemobile.kr:8080/nice/intc/return",
  "close_url": "https://cafe.wisemobile.kr:8080/nice/intc/close",
  "svc_types": ["M"],
  "method_type": "GET",
  "exp_mods": ["closeButtonOn"]
}
```

#### 서버 처리 흐름

1. **접근 토큰 발급**: `POST /auth/token`
   - Header
     - `Authorization: Basic {base64url(client_id:client_secret)}`
2. **인증 URL 발급**: `POST /auth/url`
   - Header
     - `Authorization: Bearer {access_token}`
   - Body (가이드 기준)
     - `return_url`, `close_url`, `svc_types`, `method_type`, `exp_mods`
     - `request_no` (20~50 bytes 권장; 서버에서 임의 생성 가능)
3. 프론트에 `auth_url` 반환

#### 서버 응답 예시 (Response Body)

```json
{
  "auth_url": "https://auth.niceid.co.kr/....(일회성 URL)"
}
```

---

### (B) `POST /nice/intc/auth-result`

**역할**: 표준창 완료 후 받은 `web_transaction_id`로 NICE 결과 조회 후, 프론트에 핵심 결과(최소 휴대폰번호) 반환

#### 프론트 요청 예시 (Request Body)

```json
{
  "web_transaction_id": "...."
  ,"request_no": "...."
  ,"transaction_id": "...."
}
```

#### 서버 처리 흐름

1. 토큰 확보
   - 토큰 유효 24시간이므로 **캐싱 권장**
2. **인증 결과 요청**: `POST /auth/result`
   - Header
     - `Authorization: Bearer {access_token}`
   - Body
     - `web_transaction_id`
     - `request_no` (`/auth/url`에서 사용한 `request_no`가 필요할 수 있으니 매핑/저장 정책 결정)
3. NICE 응답 검증/복호화
   - 가이드 “인증 결과” 섹션에 따라
     - `integrity_value` 검증
     - `enc_data` 복호화 후 실 데이터 추출
4. 프론트가 쓰기 쉬운 형태로 결과 반환

#### 서버 응답 예시 (Response Body, 최소)

```json
{
  "phone": "01012345678"
}
```

> 프론트는 `phone` 또는 `mobile` 필드를 우선 읽도록 구현되어 있습니다. 가능하면 `phone`으로 통일해주세요.

---

## 3) 보안/운영 요구사항

- **client_secret 앱 포함 금지**
- 접근 토큰은 서버에서 **캐싱(최대 24시간)** 권장
- NICE 측에 등록된 **Outbound IP**(운영 서버 IP/C-class 등) 권한 등록이 되어 있어야 호출 성공
- 백엔드 에러 시 프론트에서 사용자에게 “인증 시작 실패/결과 조회 실패” 메시지를 보여주므로,
  - 백엔드 응답은 가능한 한 **명확한 에러코드/메시지**를 내려주세요.

---

## 4) 프론트 동작 요약 (백엔드 참고)

프론트(React Native)는 다음처럼 동작합니다.

1. `POST /nice/intc/auth-url` → `auth_url` 수신
2. WebView로 `auth_url` 로드
3. WebView가 `return_url`로 이동하면서 `web_transaction_id`가 쿼리로 붙으면 그 순간 URL을 가로챔
4. `POST /nice/intc/auth-result`로 결과 조회 → 휴대폰 번호를 회원가입 화면에 반영

---

## 5) 백엔드에서 확정/확인해야 할 항목(중요)

- 복호화된 결과에서 **휴대폰 번호 필드가 무엇인지**를 확인하고, 백엔드 응답을 `phone`으로 내려주기
- `return_url/close_url`을 **딥링크(`parkingpark://`)로 허용 가능한지** NICE 정책/표준창 동작에서 확인
  - 만약 딥링크 return이 제한된다면:
    - `https://cafe.wisemobile.kr/...` 같은 웹 return endpoint를 만들고
    - 그 endpoint가 앱 딥링크로 리다이렉트하도록 설계 필요

