import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// @mj-studio/react-native-naver-map 라이브러리에서 Coord 타입을 가져옵니다.
import {type Coord} from '@mj-studio/react-native-naver-map';
import {BASE_URL_NAVER} from '~constants/constant';
import {NaverDrivingModel} from '~model/naver-drving-model'; // NaverDrivingModel 타입 정의는 그대로 사용합니다.

export const naverMapServices = createApi({
  reducerPath: 'naverMapServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL_NAVER,
    prepareHeaders: header => {
      header.set('X-NCP-APIGW-API-KEY-ID', 'taykdvx2ps'); // 실제 키는 환경변수 등으로 관리하는 것이 안전합니다.
      header.set('X-NCP-APIGW-API-KEY', 'QG5Ne2Xb3P3MPp21N0gkJcMpmNJfNMN93S8MB8cT'); // 실제 키는 환경변수 등으로 관리하는 것이 안전합니다.
    },
  }),

  endpoints: builder => ({
    getDrivingDirection: builder.query<
      NaverDrivingModel, // 이 타입 내에 path 필드가 Coord[] 타입으로 정의되어 있거나, 아래 transformResponse에서 맞춰줍니다.
      {start: string; end: string; waypoints?: string}
    >({
      query: ({start, end, waypoints}) => {
        return {
          url: 'driving', // 네이버 지도 API의 Directions API 엔드포인트 (예: driving-5/v2/directions)를 정확히 확인해야 합니다.
          method: 'GET',
          params: {
            start: start,
            goal: end,
            option: 'trafast', // 필요에 따라 다른 옵션 사용 가능
            waypoints: waypoints,
          },
        };
      },
      transformResponse: (response: {
        route?: {trafast?: any[]};
        code: number;
        message?: string;
      }) => {
        // code가 0이 아니거나, route 또는 trafast가 없는 경우 빈 객체 또는 에러 처리
        if (
          response?.code !== 0 ||
          !response?.route?.trafast ||
          response.route.trafast.length === 0
        ) {
          console.error(
            'Naver Driving API Error or No Route:',
            response.message || 'No route found',
          );
          return {} as NaverDrivingModel; // 또는 throw new Error(response.message || 'No route found');
        }

        const responseResult = response.route.trafast[0];
        if (!responseResult) {
          return {} as NaverDrivingModel;
        }

        // API 응답의 path가 [경도, 위도] 순서의 숫자 배열 쌍으로 온다고 가정합니다.
        // @mj-studio/react-native-naver-map의 Coord 타입은 {latitude: number, longitude: number} 입니다.
        const path: Coord[] = Array.isArray(responseResult.path)
          ? responseResult.path.map((item: [number, number]) => ({
              // item이 [경도, 위도] 순서라고 가정
              longitude: item[0],
              latitude: item[1],
            }))
          : [];

        // duration은 밀리초 단위로 오므로, 분 단위로 변환 후 문자열로 만듭니다.
        // toFixed(0)은 소수점 없이 반올림합니다. 필요에 따라 parseFloat() 등으로 숫자 타입을 유지할 수 있습니다.
        const duration = responseResult.summary?.duration
          ? (responseResult.summary.duration / 1000 / 60).toFixed(0)
          : '0';

        const section = responseResult.section;

        // 네이버 API 응답에서 taxiFare와 tollFare를 합산합니다.
        // 요금 계산 로직은 API 명세 및 정책에 따라 정확히 확인해야 합니다.
        // (responseResult?.summary?.taxiFare ?? 0 + responseResult?.summary?.tollFare ?? 0) * 0.7; 이 부분은
        // ( (responseResult?.summary?.taxiFare ?? 0) + (responseResult?.summary?.tollFare ?? 0) ) * 0.7; 와 같이 괄호가 필요해 보입니다.
        // 또한, 0.7을 곱하는 이유에 대한 비즈니스 로직이 있을 것입니다.
        const taxiFareRaw =
          (responseResult.summary?.taxiFare ?? 0) + (responseResult.summary?.tollFare ?? 0);
        const taxiFare = taxiFareRaw * 0.7; // 이 0.7이 어떤 의미인지 확인 필요

        const distance = responseResult.summary?.distance
          ? responseResult.summary.distance / 1000
          : 0; // km 단위

        // NaverDrivingModel 타입에 맞게 반환합니다.
        return {
          path: path,
          duration: parseFloat(duration), // 숫자 타입으로 변경 (또는 NaverDrivingModel의 duration 타입 확인)
          section: section,
          taxiFare: taxiFare,
          distance: distance,
          // NaverDrivingModel에 정의된 다른 필드가 있다면 여기서 함께 반환해야 합니다.
        } as NaverDrivingModel; // as any 대신 구체적인 타입 단언 또는 타입 가드 사용 권장
      },
    }),
  }),
});

export const {useGetDrivingDirectionQuery, useLazyGetDrivingDirectionQuery} = naverMapServices;
