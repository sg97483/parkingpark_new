import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const weatherServices = createApi({
  reducerPath: 'weatherServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://oapi.wisemobile.co.kr/',
  }),
  endpoints: builder => ({
    getWeatherInfo: builder.query<string, Partial<{code: number}>>({
      query: ({code}) => {
        return {
          url: `iOS_Data/DFS_${code}.dat`,
          method: 'GET',
        };
      },
      transformResponse: (response: any) => {
        return response?.data;
      },
    }),
  }),
});

export const {useLazyGetWeatherInfoQuery} = weatherServices;
