export const isValidCarNumber = (carNum: string): boolean => {
  let returnValue = false;

  try {
    // 허용 예시
    // - 12가1234 / 123가1234
    // - 서울12가1234 / 서울123가1234 (지역 prefix)
    const normalized = `${carNum ?? ''}`.replace(/\s+/g, '');

    // 1) 지역 prefix(1~4글자 한글) optional
    // 2) 숫자 2~3자리
    // 3) 한글 1자리
    // 4) 숫자 4자리
    const regex = /^([가-힣]{1,4})?(\d{2,3})([가-힣]{1})(\d{4})\/?$/;
    returnValue = regex.test(normalized);

    return returnValue;
  } catch (e) {
    return false;
  }
};
