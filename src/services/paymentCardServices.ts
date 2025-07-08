import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '~constants/constant';
import {IS_ACTIVE} from '~constants/enum';
import {CreditCardProps} from '~constants/types';

export const paymentCardServices = createApi({
  reducerPath: 'paymentCardServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    getCreditCardList: builder.query<
      CreditCardProps[],
      Partial<{memberId: number; memberPwd: string}>
    >({
      query: ({memberId, memberPwd}) => {
        return {
          url: `sMember/getCreditCardList?memberId=${memberId}&memberPwd=${memberPwd}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listCreditCard: CreditCardProps[]}) => {
        return response?.listCreditCard || [];
      },
    }),
    setDefaultCard: builder.mutation<
      string,
      Partial<{
        id: number;
        memberId: number;
        memberPwd: string;
        defaultYN: IS_ACTIVE;
      }>
    >({
      query: ({id, memberId, memberPwd, defaultYN}) => {
        return {
          url: `sMember/setDefaultCreditCard?id=${id}&memberId=${memberId}&memberPwd=${memberPwd}&defaultYN=${defaultYN}`,
          method: 'POST',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    deletePaymentCard: builder.mutation<
      string,
      Partial<{
        id: number;
        memberId: number;
        memberPwd: string;
      }>
    >({
      query: ({id, memberId, memberPwd}) => {
        return {
          url: `sMember/deleteCreditCard?id=${id}&memberId=${memberId}&memberPwd=${memberPwd}`,
          method: 'DELETE',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),

    getCreditCard: builder.query<CreditCardProps, {memberId: string}>({
      query: ({memberId}) => {
        return {
          url: `sDriver/readMyCard/?memberId=${memberId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listCreditCard: CreditCardProps[]}) => {
        return response?.listCreditCard[0];
      },
    }),
  }),
});

export const {
  useGetCreditCardListQuery,
  useSetDefaultCardMutation,
  useDeletePaymentCardMutation,
  useGetCreditCardQuery,
  useLazyGetCreditCardListQuery,
} = paymentCardServices;
