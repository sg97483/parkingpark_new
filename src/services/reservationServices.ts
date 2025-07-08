import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '~constants/constant';
import {
  ParkLinkProps,
  ParkingRestrictionProps,
  PayInfoProps,
  ResponseProps,
} from '~constants/types';

export const reservationServices = createApi({
  reducerPath: 'reservationServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    requestPayInfo: builder.query<
      PayInfoProps,
      Partial<{id: number; pass: string; parkingID: number}>
    >({
      query: ({id, pass, parkingID}) => {
        return {
          url: `parkingTicket/getPaymentInfo?parkingLotId=${parkingID}&memberId=${id}&memberPwd=${pass}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {item: PayInfoProps}) => {
        return response?.item;
      },
    }),
    requestParkingRestriction: builder.query<ParkingRestrictionProps[], Partial<{parkId: number}>>({
      query: ({parkId}) => {
        return {
          url: `sMember/getRestriction?parkId=${parkId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {parkingRestriction: ParkingRestrictionProps[]}) => {
        return response?.parkingRestriction || [];
      },
    }),
    submitParkingReservation: builder.mutation<
      ResponseProps,
      Partial<{
        memberId: number;
        memberPwd: string;
        parkId: number;
        stDtm: string;
        edDtm: string;
        usePoint: number;
        usePointSklent: number;
        useCoupon: number;
        payAmt: number;
        agCarNumber: string;
        requirements: string;
        TotalTicketType: string;
        payLocation?: string;
      }>
    >({
      query: ({
        TotalTicketType,
        agCarNumber,
        edDtm,
        memberId,
        memberPwd,
        parkId,
        payAmt,
        payLocation = '',
        requirements,
        stDtm,
        useCoupon,
        usePoint,
        usePointSklent,
      }) => {
        return {
          url: `sTicketParking/pay?memberId=${memberId}&memberPwd=${memberPwd}&parkId=${parkId}&stDtm=${stDtm}&edDtm=${edDtm}&usePoint=${usePoint}&usePointSklent=${usePointSklent}&useCoupon=${useCoupon}&payAmt=${payAmt}&agCarNumber=${agCarNumber}&requirements=${requirements}&TotalTicketType=${TotalTicketType}&payLocation=${payLocation}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },
      transformResponse: (response: ResponseProps) => {
        return response;
      },
    }),
    requestGetParkLinkInfo: builder.query<
      ParkLinkProps,
      Partial<{parkingLotId: number; memberId: number; memberPwd: string}>
    >({
      query: ({memberId, memberPwd, parkingLotId}) => {
        return {
          url: `parkingTicket/getParkLinkInfo?memberId=${memberId}&memberPwd=${memberPwd}&parkingLotId=${parkingLotId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {item: ParkLinkProps}) => {
        return response?.item;
      },
    }),
  }),
});

export const {
  useRequestPayInfoQuery,
  useRequestParkingRestrictionQuery,
  useSubmitParkingReservationMutation,
  useRequestGetParkLinkInfoQuery,
} = reservationServices;
