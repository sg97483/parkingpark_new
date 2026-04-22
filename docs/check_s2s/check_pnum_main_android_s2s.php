<?php
/**
 * NICE 통합인증(표준창) S2S 방식 - 시작 페이지
 *
 * - /ido/intc/v1.0/auth/token  → access_token, iterators, ticket 획득
 * - /ido/intc/v1.0/auth/url    → auth_url, transaction_id 획득
 * - auth_url 로 302 redirect
 *
 * 참고: https://auth-guide.niceid.co.kr/
 *
 * IMPORTANT:
 * - client_secret은 절대 앱/클라이언트에 노출하면 안 됩니다.
 * - 아래 값들은 서버 환경변수로 주입하세요.
 *   - NICE_CLIENT_ID
 *   - NICE_CLIENT_SECRET
 */

header('Content-Type: text/html; charset=utf-8');
session_start();

/**
 * ===== 디버그 모드 (서버 500 원인 확인용) =====
 * - 운영 적용 시에는 $DEBUG를 false로 바꾸는 것을 권장합니다11
 * - 서버 error_log에도 남기도록 설정합니다.
 */
$DEBUG = true;
if ($DEBUG) {
  ini_set('display_errors', '1');
  ini_set('display_startup_errors', '1');
  error_reporting(E_ALL);
}
// 진단용: 인증서/SSL 문제 여부 확인(운영에서는 false 권장)
$INSECURE_SSL_FOR_DEBUG = true;

function debug_out($msg) {
  // 500 대신 화면에 원인 표시(진단 목적)
  header('HTTP/1.1 200 OK');
  header('Content-Type: text/plain; charset=utf-8');
  echo $msg;
  exit;
}

set_error_handler(function ($errno, $errstr, $errfile, $errline) use ($DEBUG) {
  if ($DEBUG) {
    debug_out("PHP Error: {$errstr}\nFile: {$errfile}\nLine: {$errline}\nErrno: {$errno}\n");
  }
  return false;
});
set_exception_handler(function ($e) use ($DEBUG) {
  if ($DEBUG) {
    debug_out("PHP Exception: " . $e->getMessage() . "\n");
  }
});

/**
 * PHP 5.3.3 운영 환경 요청에 따라 하드코딩합니다.
 * - 보안상 권장되지 않습니다. 가능하면 서버 환경변수/시크릿으로 분리하세요.
 * - Client Secret 값은 반드시 실제 값으로 교체해야 합니다.
 */
$clientId = 'NI773c028b-b26c-4597-ab6d-65529eb92e6e';
$clientSecret = 'M2ExMDZmZGUtNjMxNi00Y2Y1LTk5MTYtOWI5MTdmZGExMGM3ODJGMkRBQkU0QjIyMUM1ODdGMzZGNDIy';

// return/close URL은 실제 서버 경로에 맞춰 고정 (옵션 A: 딥링크 미사용)
$returnUrl = 'https://cafe.wisemobile.kr/imobile/check_s2s/check_pnum_return_android_s2s.php';
$closeUrl  = 'https://cafe.wisemobile.kr/imobile/check_s2s/check_pnum_close_android_s2s.php';

// 필수 확장 확인 (PHP 5.3 서버에서 가장 흔한 500 원인)
if (!function_exists('curl_init')) {
  debug_out("Missing PHP extension: curl (curl_init not found)");
}
if (!function_exists('json_encode')) {
  debug_out("Missing PHP function: json_encode (json extension not enabled)");
}

// 공통: 요청고유번호(20~50 bytes 권장)
function make_request_no() {
  // PHP 5.3 호환: random_bytes 미지원 → openssl_random_pseudo_bytes 사용
  $bytes = '';
  if (function_exists('openssl_random_pseudo_bytes')) {
    $bytes = openssl_random_pseudo_bytes(16);
  }
  if (!$bytes) {
    $bytes = uniqid('', true);
  }
  $raw = bin2hex($bytes); // 최소 32 chars 이상
  return 'PP' . substr($raw, 0, 40);
}

function base64url_encode($bin) {
  return rtrim(strtr(base64_encode($bin), '+/', '-_'), '=');
}

function http_post_json($url, $headers, $body) {
  $ch = curl_init($url);
  if ($ch === false) {
    debug_out("curl_init failed");
  }
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  // PHP 5.3: JSON_UNESCAPED_* 상수 미지원
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
  curl_setopt($ch, CURLOPT_TIMEOUT, 20);
  // 진단용: SSL 검증/버전 (구형 환경에서 token 요청이 0으로 떨어지는 경우가 많음)
  if (isset($GLOBALS['INSECURE_SSL_FOR_DEBUG']) && $GLOBALS['INSECURE_SSL_FOR_DEBUG']) {
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
  }
  $raw = curl_exec($ch);
  $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $errno = curl_errno($ch);
  $err = curl_error($ch);
  curl_close($ch);

  if ($raw === false) {
    return array(
      'ok' => false,
      'status' => $status,
      'errno' => $errno,
      'error' => ($err ? $err : 'curl_failed'),
      'raw' => ''
    );
  }

  $json = json_decode($raw, true);
  return array(
    'ok' => ($status >= 200 && $status < 300),
    'status' => $status,
    'errno' => $errno,
    'error' => ($err ? $err : ''),
    'json' => $json,
    'raw' => $raw
  );
}

// 1) token
$tokenReqNo = make_request_no();
$basic = base64url_encode($clientId . ':' . $clientSecret);
$tokenRes = http_post_json(
  'https://auth.niceid.co.kr/ido/intc/v1.0/auth/token',
  array(
    'Content-Type: application/json',
    'Authorization: Basic ' . $basic,
    'X-Intc-DevLang: linux/php',
  ),
  array(
    'grant_type' => 'client_credentials',
    'request_no' => $tokenReqNo,
  )
);

if (!$tokenRes['ok']) {
  header('HTTP/1.1 502 Bad Gateway');
  echo "NICE token 요청 실패 (" . $tokenRes['status'] . ")\n";
  if (isset($tokenRes['errno'])) {
    echo "curl errno: " . $tokenRes['errno'] . "\n";
  }
  if (isset($tokenRes['error']) && $tokenRes['error']) {
    echo "curl error: " . $tokenRes['error'] . "\n";
  }
  echo htmlspecialchars(isset($tokenRes['raw']) ? $tokenRes['raw'] : '', ENT_QUOTES, 'UTF-8');
  exit;
}

$accessToken = (isset($tokenRes['json']) && isset($tokenRes['json']['access_token'])) ? $tokenRes['json']['access_token'] : '';
$iterators = (isset($tokenRes['json']) && isset($tokenRes['json']['iterators'])) ? $tokenRes['json']['iterators'] : null;
$ticket = (isset($tokenRes['json']) && isset($tokenRes['json']['ticket'])) ? $tokenRes['json']['ticket'] : '';
if (!$accessToken || !$ticket || $iterators === null) {
  header('HTTP/1.1 502 Bad Gateway');
  echo "NICE token 응답 누락\n";
  echo htmlspecialchars(isset($tokenRes['raw']) ? $tokenRes['raw'] : '', ENT_QUOTES, 'UTF-8');
  exit;
}

// 세션 저장 (result 복호화에 필요)
$_SESSION['NICE_ACCESS_TOKEN'] = $accessToken;
$_SESSION['NICE_TICKET'] = $ticket;
$_SESSION['NICE_ITERATORS'] = (int)$iterators;

// 2) url
$urlReqNo = make_request_no();
$urlRes = http_post_json(
  'https://auth.niceid.co.kr/ido/intc/v1.0/auth/url',
  array(
    'Content-Type: application/json',
    'Authorization: Bearer ' . $accessToken,
    'X-Intc-DevLang: linux/php',
  ),
  array(
    'request_no' => $urlReqNo,
    'return_url' => $returnUrl,
    'close_url' => $closeUrl,
    'svc_types' => array('M'),        // 휴대폰 인증만 노출
    'method_type' => 'GET',
    'exp_mods' => array('closeButtonOn'),
  )
);

if (!$urlRes['ok']) {
  header('HTTP/1.1 502 Bad Gateway');
  echo "NICE auth url 요청 실패 (" . $urlRes['status'] . ")\n";
  echo htmlspecialchars(isset($urlRes['raw']) ? $urlRes['raw'] : '', ENT_QUOTES, 'UTF-8');
  exit;
}

$authUrl = (isset($urlRes['json']) && isset($urlRes['json']['auth_url'])) ? $urlRes['json']['auth_url'] : '';
$transactionId = (isset($urlRes['json']) && isset($urlRes['json']['transaction_id'])) ? $urlRes['json']['transaction_id'] : '';
if (!$authUrl || !$transactionId) {
  header('HTTP/1.1 502 Bad Gateway');
  echo "NICE auth url 응답 누락\n";
  echo htmlspecialchars(isset($urlRes['raw']) ? $urlRes['raw'] : '', ENT_QUOTES, 'UTF-8');
  exit;
}

$_SESSION['NICE_TRANSACTION_ID'] = $transactionId;
$_SESSION['NICE_REQUEST_NO_URL'] = $urlReqNo;

// 3) redirect to standard window
header('Location: ' . $authUrl, true, 302);
exit;