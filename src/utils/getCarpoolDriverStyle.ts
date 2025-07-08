const getGenderOption = (value: string): string => {
  switch (value) {
    case 'A':
      return '성별무관';
    case 'B':
      return '여성만';
    case 'C':
      return '남성만';
    default:
      return '';
  }
};

const getCommuteToWorkOption = (value: string): string => {
  switch (value) {
    case 'A':
      return '자유롭게';
    case 'B':
      return '음악듣기';
    case 'C':
      return '라디오듣기';
    case 'D':
      return '대화위주';
    case 'E':
      return '조용한';
    default:
      return '';
  }
};

const getSeatBoardingOption = (value: string): string => {
  switch (value) {
    case 'A':
      return '탑승좌석 무관';
    case 'B':
      return '앞좌석 탑승';
    case 'C':
      return '뒷좌석 탑승';
    default:
      return '';
  }
};

const getOptionalItemsForRequestingAmountAdjustment = (value: string): string => {
  switch (value) {
    case 'A':
      return '금액조정 요청가능';
    case 'B':
      return '금액 조정 요청불가능';
    default:
      return '';
  }
};

export const getCarpoolDriverStyle = (style: string) => {
  return style.split('').map((item, index) => {
    if (index === 0) {
      return getGenderOption(item);
    }
    if (index === 1) {
      return getCommuteToWorkOption(item);
    }
    if (index === 2) {
      return getSeatBoardingOption(item);
    }
    if (index === 3) {
      return getOptionalItemsForRequestingAmountAdjustment(item);
    }
  });
};
