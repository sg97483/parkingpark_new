import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {API_KEY_ID_NAVER, API_KEY_NAVER, BASE_URL_NAVER} from '~constants/constant';

export const naverServices = createApi({
  reducerPath: 'kakaoServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL_NAVER,
    headers: {
      'X-NCP-APIGW-API-KEY-ID': API_KEY_ID_NAVER,
      'X-NCP-APIGW-API-KEY': API_KEY_NAVER,
    },
  }),
  endpoints: builder => ({
    getPath: builder.mutation<any, {start: string; end: string}>({
      query: ({start, end}) => {
        return {
          url: `driving?start=${start}&goal=${end}`,
          method: 'GET',
        };
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),
  }),
});

export const {useGetPathMutation} = naverServices;
