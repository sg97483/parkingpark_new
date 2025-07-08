import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '~constants/constant';
import {PaymentHistoryProps, RevocableProps} from '~constants/types';

export const usageHistoryServices = createApi({
  reducerPath: 'usageHistoryServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    getPaymentHistoryList: builder.query<
      PaymentHistoryProps[],
      Partial<{id: number; pass: string; parkId?: number}>
    >({
      query: ({id, pass, parkId}) => {
        if (!parkId) {
          return {
            url: `valetParking/getPaymentHistoryList?memberId=${id}&memberPwd=${pass}`,
            method: 'GET',
          };
        }
        return {
          url: `valetParking/getPaymentAdminHistoryList?parkId=${parkId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {list: PaymentHistoryProps[]}) => {
        return response?.list;
      },
    }),
    requestRevocable: builder.query<
      RevocableProps,
      Partial<{
        historyID: number;
        memberID: number;
        memberPass: string;
      }>
    >({
      query: ({historyID, memberID, memberPass}) => {
        return {
          url: `valetParking/getRevocableAmt?historyId=${historyID}&memberId=${memberID}&memberPwd=${memberPass}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {item: RevocableProps}) => {
        return response?.item;
      },
    }),
    getPaymentAdminHistoryList: builder.query<any, Partial<{id: number; pass: string}>>({
      query: ({id, pass}) => {
        return {
          url: 'valetParking/getPaymentAdminHistoryList',
          method: 'GET',
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
    updateStatusCarpoolHistory: builder.query<any, Partial<{id: string; rStatusCheck: string}>>({
      query: ({id, rStatusCheck}) => {
        return {
          url: `sDriver/updateStatusCheck?id=${id}&rStatusCheck=${rStatusCheck}`,
          method: 'GET',
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
  }),
});

export const {
  useGetPaymentHistoryListQuery,
  useGetPaymentAdminHistoryListQuery,
  useRequestRevocableQuery,
  useUpdateStatusCarpoolHistoryQuery,
  useLazyUpdateStatusCarpoolHistoryQuery,
} = usageHistoryServices;
