import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL, IS_ANDROID} from '~constants/constant';
import {ImageProps, ValetMainNoticeProps} from '~constants/types';
import RNFS from 'react-native-fs';

export const valetParkingServices = createApi({
  reducerPath: 'valetParkingServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    cancelValetParking: builder.mutation<
      string,
      Partial<{
        historyId: number;
        cancelAmt: number;
        memberId: number;
        memberPwd: string;
      }>
    >({
      query: ({historyId, cancelAmt, memberId, memberPwd}) => {
        return {
          url: `valetParking/cancelPay?historyId=${historyId}&cancelAmt=${cancelAmt}&memberId=${memberId}&memberPwd=${memberPwd}`,
          method: 'POST',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    valetMainNoticeList: builder.query<ValetMainNoticeProps[], void>({
      query: () => {
        return {
          url: 'valetMainNoticeBbs/getList?count=99999&lastId=0',
          method: 'GET',
        };
      },
      transformResponse: (response: {list: ValetMainNoticeProps[]}) => {
        return response?.list || [];
      },
    }),
    deleteValetMainNotice: builder.mutation<
      string,
      Partial<{memberId: number; memberPwd: string; id: number}>
    >({
      query: ({id, memberId, memberPwd}) => {
        return {
          url: `valetMainNoticeBbs/delete?id=${id}&memberId=${memberId}&memberPwd=${memberPwd}`,
          method: 'POST',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    createValetMainNotice: builder.mutation<
      string,
      Partial<{
        photo: ImageProps;
        memberId: number;
        memberPwd: string;
        subject: string;
        text: string;
      }>
    >({
      query: ({memberId, memberPwd, photo, subject, text}) => {
        const formData = new FormData();
        formData.append('memberId', memberId);
        formData.append('memberPwd', memberPwd);
        formData.append('subject', subject);
        formData.append('text', text);
        formData.append('deviceToken', '');
        if (photo) {
          formData.append('photo', {
            uri: IS_ANDROID ? photo?.uri : photo?.uri.replace('file://', ''),
            name: photo?.fileName,
            type: 'image/png',
          });
          formData.append('photoFullWidth', photo?.width);
          formData.append('photoFullHeight', photo?.height);
        } else {
          let path = IS_ANDROID
            ? RNFS.DocumentDirectoryPath + '/image_term.png'
            : RNFS.TemporaryDirectoryPath + '/image_term.png';

          formData.append('photo', {
            uri: IS_ANDROID ? `file:///${path}` : path,
            name: 'image_term',
            type: 'image/png',
          });
        }

        return {
          url: 'valetMainNoticeBbs/create',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response.statusCode;
      },
    }),
    createValetParkingReservation: builder.mutation<
      string,
      Partial<{
        memberId: number;
        memberPwd: string;
        parkId: number;
        payAmt: number;
        stDtm: string;
        edDtm: string;
        usePoint: number;
        usePointSklent: number;
        useCoupon: number;
        TotalTicketType: string;
        requirements: string;
        agCarNumber: string;
        inFlightAndCityName: string;
        outFlightAndCityName: string;
      }>
    >({
      query: ({
        TotalTicketType,
        agCarNumber,
        edDtm,
        inFlightAndCityName,
        memberId,
        memberPwd,
        outFlightAndCityName,
        parkId,
        payAmt,
        requirements,
        stDtm,
        useCoupon,
        usePoint,
        usePointSklent,
      }) => {
        return {
          url: `valetParking/pay?memberId=${memberId}&memberPwd=${memberPwd}&parkId=${parkId}&payAmt=${payAmt}&stDtm=${stDtm}&edDtm=${edDtm}&usePoint=${usePoint}&usePointSklent=${usePointSklent}&useCoupon=${useCoupon}&TotalTicketType=${TotalTicketType}&requirements=${requirements}&agCarNumber=${agCarNumber}&inFlightAndCityName=${inFlightAndCityName}&outFlightAndCityName=${outFlightAndCityName}`,
          method: 'POST',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        console.log('🚀 ~ file: valetParkingServices.ts:136 ~ response', response);
        return response?.statusCode;
      },
    }),
  }),
});

export const {
  useCancelValetParkingMutation,
  useValetMainNoticeListQuery,
  useDeleteValetMainNoticeMutation,
  useCreateValetMainNoticeMutation,
  useCreateValetParkingReservationMutation,
} = valetParkingServices;
