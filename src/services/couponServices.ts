import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '~constants/constant';
import {ChargeProps, CouponProps, PointProps, ResponseProps} from '~constants/types';

export const couponServices = createApi({
  reducerPath: 'couponServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    getListCoupon: builder.query<CouponProps[], Partial<{id: number; pass: string}>>({
      query: ({id, pass}) => {
        return {
          url: `sMember/getCouponlistYN?memberId=${id}&memberPwd=${pass}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listCoupon: CouponProps[]}) => {
        return response.listCoupon || [];
      },
    }),
    depositMoney: builder.mutation<
      ResponseProps,
      Partial<{
        memberId: number;
        memberPwd: string;
        stDtm: string;
        edDtm: string;
        TotalTicketType: string;
        payAmt: string;
      }>
    >({
      query: ({TotalTicketType, edDtm, memberId, memberPwd, payAmt, stDtm}) => {
        return {
          url: `sTicketParking/pay?memberId=${memberId}&memberPwd=${memberPwd}&parkId=60009&stDtm=${stDtm}&edDtm=${edDtm}&usePoint=0&usePointSklent=0&agCarNumber=0&requirements=0&useCoupon=0&TotalTicketType=${encodeURIComponent(
            TotalTicketType as string,
          )}&payAmt=${payAmt}`,
          method: 'POST',
        };
      },
      transformResponse: (response: ResponseProps) => {
        return response;
      },
    }),
    getParkingCoupon: builder.query<
      CouponProps[],
      Partial<{parkingLotId: number; memberId: number; memberPwd: string}>
    >({
      query: ({memberId, memberPwd, parkingLotId}) => {
        return {
          url: `sMember/getCouponList?parkingLotId=${parkingLotId}&memberId=${memberId}&memberPwd=${memberPwd}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listCoupon: CouponProps[]}) => {
        return response?.listCoupon || [];
      },
    }),
    getPointList: builder.query<
      PointProps[],
      {memberId: number; frDate?: string; toDate?: string; noteUse: string}
    >({
      query: ({memberId, noteUse, frDate, toDate}) => {
        return {
          url: 'sMember/getPointList/',
          method: 'GET',
          params: {memberId, frDate, toDate, noteUse},
        };
      },
      transformResponse: (response: {listTPoint: PointProps[]}) => {
        return response?.listTPoint ?? [];
      },
    }),
    getChargeList: builder.query<
      ChargeProps[],
      {memberId: number; usePointSklentYN?: 0 | 1 | 2; frDate?: string; toDate?: string}
    >({
      query: ({memberId, frDate, toDate, usePointSklentYN}) => {
        return {
          url: 'sMember/getChargeList/',
          method: 'GET',
          params: {memberId, frDate, toDate, usePointSklentYN},
        };
      },
      transformResponse: (response: {listTChargeMoney: ChargeProps[]}) => {
        return response?.listTChargeMoney ?? [];
      },
    }),
  }),
});

export const {
  useGetListCouponQuery,
  useDepositMoneyMutation,
  useGetParkingCouponQuery,
  useGetPointListQuery,
  useGetChargeListQuery,
} = couponServices;
