<?php
/**
 * NICE 통합인증(표준창) S2S 방식 - 닫기(취소) 콜백
 *
 * 옵션 A(딥링크 미사용) 기준: 앱(WebView)로 결과를 전달하기 위해
 * ReactNativeWebView.postMessage 로 "실패(0)"를 전달합니다.
 */

header('Content-Type: text/html; charset=utf-8');

$message = '[plaindata] a:b:c:d:e:f:g:h:i:j:k:l:m:n:o:p:q:r:0|';
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
