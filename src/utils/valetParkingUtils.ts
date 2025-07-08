export const getValetParkingNameByID = (id: number): string => {
  switch (id) {
    case 70005:
      return '인천공항 직접주차 - 웨스턴프리미어호텔';

    case 70004:
      return '인천공항 직접주차 - 메가스타영종 (운서역)';

    case 70006:
      return '동익드미라벨 (마곡역 부근)';

    case 70007:
      return '힐스테이트에코 (마곡역 2번출구 1분거리)';

    case 70008:
      return 'GMG주차타워 (마곡역 2번출구 2분거리)';

    case 70009:
      return '발산 파크프라자 (발산역 9번출구 앞 위치)';

    case 70010:
      return '*추천* 마곡 스프링타워 (마곡나루역 2분거리)';

    case 70011:
      return '*추천* 공항중학교 주차장 (송정역 3분거리)';

    default:
      return '';
  }
};
