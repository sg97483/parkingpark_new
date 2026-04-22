<?php
/**
 * NICE 통합인증(표준창) S2S 방식 - 성공 콜백(return_url)
 *
 * 1) querystring으로 넘어온 web_transaction_id 수신
 * 2) /ido/intc/v1.0/auth/result 호출
 * 3) integrity_value 검증 + enc_data 복호화(AES-256-GCM)
 * 4) 최종 결과(mobile_no) 를 ReactNativeWebView.postMessage 로 전달
 *
 * 참고: https://auth-guide.niceid.co.kr/
 */

header('Content-Type: text/html; charset=utf-8');
session_start();

function http_post_json($url, $headers, $body) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  // PHP 5.3: JSON_UNESCAPED_* 상수 미지원
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
  curl_setopt($ch, CURLOPT_TIMEOUT, 20);
  $raw = curl_exec($ch);
  $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err = curl_error($ch);
  curl_close($ch);

  if ($raw === false) {
    return array('ok' => false, 'status' => $status, 'error' => ($err ? $err : 'curl_failed'), 'raw' => '');
  }
  $json = json_decode($raw, true);
  return array('ok' => ($status >= 200 && $status < 300), 'status' => $status, 'json' => $json, 'raw' => $raw);
}

function base64url_decode($data) {
  $data = strtr($data, '-_', '+/');
  $pad = strlen($data) % 4;
  if ($pad) {
    $data .= str_repeat('=', 4 - $pad);
  }
  return base64_decode($data);
}

/**
 * PHP 5.3: hash_pbkdf2가 없는 경우가 많아서, PBKDF2-HMAC-SHA256을 직접 구현합니다.
 * - dkLen: 64 bytes (512bit)
 */
function pbkdf2_sha256($password, $salt, $iterations, $dkLen) {
  $hLen = 32; // sha256 bytes
  $l = (int)ceil($dkLen / $hLen);
  $dk = '';
  for ($i = 1; $i <= $l; $i++) {
    $u = hash_hmac('sha256', $salt . pack('N', $i), $password, true);
    $f = $u;
    for ($j = 1; $j < $iterations; $j++) {
      $u = hash_hmac('sha256', $u, $password, true);
      $f = $f ^ $u;
    }
    $dk .= $f;
  }
  return substr($dk, 0, $dkLen);
}

function getKeyValue($ticket, $transactionID, $iterators) {
  $key = pbkdf2_sha256($ticket, $transactionID, (int)$iterators, 64);
  $base64 = rtrim(strtr(base64_encode($key), '+/', '-_'), '=');
  return $base64;
}

function getSha256MacBase64Value($value, $hmacKey) {
  $hashValue = hash_hmac('sha256', $value, $hmacKey, true);
  $base64Value = base64_encode($hashValue);
  $urlSafeBase64 = strtr($base64Value, '+/', '-_');
  return rtrim($urlSafeBase64, '=');
}

function timing_safe_equals($a, $b) {
  if (strlen($a) !== strlen($b)) return false;
  $res = 0;
  for ($i = 0; $i < strlen($a); $i++) {
    $res |= ord($a[$i]) ^ ord($b[$i]);
  }
  return $res === 0;
}

function aesGcmDec($enc_data, $Key) {
  // PHP 5.3 + OpenSSL 환경에서는 aes-256-gcm이 없을 가능성이 큽니다.
  if (!function_exists('openssl_decrypt')) {
    return null;
  }
  if (function_exists('openssl_get_cipher_methods')) {
    $methods = openssl_get_cipher_methods(true);
    if (is_array($methods) && !in_array('aes-256-gcm', $methods)) {
      return null;
    }
  }

  $cipherEnc = base64url_decode($enc_data);
  if ($cipherEnc === false || strlen($cipherEnc) < 16 + 16) {
    return null;
  }
  $iv = substr($cipherEnc, 0, 16);
  $cipherAndTag = substr($cipherEnc, 16);
  $cipherLen = strlen($cipherAndTag) - 16;
  if ($cipherLen <= 0) {
    return null;
  }
  $cipherText = substr($cipherAndTag, 0, $cipherLen);
  $tag = substr($cipherAndTag, $cipherLen, 16);
  $plain = openssl_decrypt($cipherText, 'aes-256-gcm', $Key, OPENSSL_RAW_DATA, $iv, $tag);
  if ($plain === false) {
    return null;
  }
  return $plain;
}

// web_transaction_id 수신 (GET default)
$webTransactionId = isset($_GET['web_transaction_id']) ? $_GET['web_transaction_id'] : '';
if (!$webTransactionId && isset($_POST['web_transaction_id']) && $_POST['web_transaction_id'] !== '') {
  $webTransactionId = $_POST['web_transaction_id'];
}

// 세션에서 필요한 값 가져오기
$accessToken = isset($_SESSION['NICE_ACCESS_TOKEN']) ? $_SESSION['NICE_ACCESS_TOKEN'] : '';
$ticket = isset($_SESSION['NICE_TICKET']) ? $_SESSION['NICE_TICKET'] : '';
$iterators = isset($_SESSION['NICE_ITERATORS']) ? $_SESSION['NICE_ITERATORS'] : null;
$transactionId = isset($_SESSION['NICE_TRANSACTION_ID']) ? $_SESSION['NICE_TRANSACTION_ID'] : '';
$requestNoUrl = isset($_SESSION['NICE_REQUEST_NO_URL']) ? $_SESSION['NICE_REQUEST_NO_URL'] : '';

// 기본 실패 메시지
$phone = '0';
$message = '[plaindata] a:b:c:d:e:f:g:h:i:j:k:l:m:n:o:p:q:r:0|';

if ($webTransactionId && $accessToken && $ticket && $transactionId && $requestNoUrl && $iterators !== null) {
  $resultRes = http_post_json(
    'https://auth.niceid.co.kr/ido/intc/v1.0/auth/result',
    array(
      'Content-Type: application/json',
      'Authorization: Bearer ' . $accessToken,
      'X-Intc-DevLang: linux/php',
    ),
    array(
      'web_transaction_id' => $webTransactionId,
      'transaction_id' => $transactionId,
      'request_no' => $requestNoUrl,
    )
  );

  if ($resultRes['ok']) {
    $encData = (isset($resultRes['json']['enc_data']) ? $resultRes['json']['enc_data'] : '');
    $integrityValue = (isset($resultRes['json']['integrity_value']) ? $resultRes['json']['integrity_value'] : '');

    if ($encData && $integrityValue) {
      $keyString = getKeyValue($ticket, $transactionId, (int)$iterators);
      $Key = substr($keyString, 0, 32);
      $hmacKey = substr($keyString, 48, 32);

      $mac = getSha256MacBase64Value($encData, $hmacKey);
      if ($mac !== null && timing_safe_equals($integrityValue, $mac)) {
        $plainJson = aesGcmDec($encData, $Key);
        if ($plainJson) {
          $data = json_decode($plainJson, true);
          $mobileNo = (is_array($data) && isset($data['mobile_no'])) ? $data['mobile_no'] : '';
          if ($mobileNo) {
            // 숫자만
            $phone = preg_replace('/[^0-9]/', '', (string)$mobileNo);
          }
        }
      }
    }
  }
}

if ($phone && $phone !== '0') {
  // 구버전 앱 파싱 로직(verify-phone-number.tsx) 호환:
  // split(':') 했을 때 index 18이 phone이어야 함 + 마지막 char 제거 로직 대응('|')
  $message = '[plaindata] a:b:c:d:e:f:g:h:i:j:k:l:m:n:o:p:q:r:' . $phone . '|';
}
?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>파킹박 본인인증</title>
  </head>
  <body>
    <pre><?php echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8'); ?></pre>
    <script type="text/javascript">
      (function () {
        try {
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage('<?php echo addslashes($message); ?>');
          }
        } catch (e) {}
      })();
    </script>
  </body>
</html>
