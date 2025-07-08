#!/bin/bash

# BoringSSL-GRPC 소스가 있는 디렉토리로 이동
BORINGSSL_DIR="./ios/Pods/BoringSSL-GRPC"

if [ ! -d "$BORINGSSL_DIR" ]; then
  echo "❌ BoringSSL-GRPC 폴더가 존재하지 않습니다. 먼저 pod install을 해주세요."
  exit 1
fi

echo "🚀 BoringSSL-GRPC 소스에서 '-G' 플래그 제거 작업 시작합니다..."

# tls13_*.cc, x509_*.cc, x_*.cc 파일을 찾고 수정합니다
find "$BORINGSSL_DIR" \( -name "*.cc" -or -name "*.c" \) | while read file; do
  # 파일 내에 '-G' 관련 플래그가 있는지 검사
  if grep --quiet "\-G" "$file"; then
    echo "✏️ 수정 중: $file"
    # 모든 -G 옵션을 제거
    sed -i '' 's/-G//g' "$file"
  fi
done

echo "✅ 완료되었습니다! 이제 다시 빌드하면 됩니다."
