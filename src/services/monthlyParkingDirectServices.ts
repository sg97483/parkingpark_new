import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL, IS_ANDROID} from '~constants/constant';
import {IS_ACTIVE} from '~constants/enum';
import {
  ImageProps,
  MonthlyParkingDirectImageProps,
  MonthlyParkingDirectProps,
  MonthlyParkingDirectReplyProps,
} from '~constants/types';

export const monthlyParkingDirectServices = createApi({
  reducerPath: 'monthlyParkingDirectServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    getMonthlyParkingDirectList: builder.query<
      MonthlyParkingDirectProps[],
      Partial<{count?: number; lastID: number}>
    >({
      query: ({count = 10, lastID}) => {
        return {
          url: `shareMonthQnaBbs/getList?count=${count}&lastId=${lastID}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {list: MonthlyParkingDirectProps[]}) => {
        return response.list || [];
      },
    }),
    getMonthlyParkingDirectImage: builder.query<
      MonthlyParkingDirectImageProps[],
      Partial<{userID: number}>
    >({
      query: ({userID}) => {
        return {
          url: `MonthShare/selectMonthShareImage?s_memberId=${userID}`,
        };
      },
      transformResponse: (response: {listMonthShare: MonthlyParkingDirectImageProps[]}) => {
        return response?.listMonthShare || [];
      },
    }),
    createMonthlyParkingDirect: builder.mutation<
      {bbsId: number; statusCode: string},
      Partial<{
        s_memberId: number;
        s_garageAddress: string;
        s_subject: string;
        s_garageName: string;
        s_garagePay: string;
        s_rSpace: string;
        s_gtime: string;
        s_gday: string;
        s_garageInfo: string;
        pnum: string;
      }>
    >({
      query: ({
        pnum,
        s_garageAddress,
        s_garageInfo,
        s_garageName,
        s_garagePay,
        s_gday,
        s_gtime,
        s_memberId,
        s_rSpace,
        s_subject,
      }) => {
        const formData = new FormData();
        formData.append('s_memberId', s_memberId);
        formData.append('s_garageAddress', s_garageAddress);
        formData.append('s_subject', s_subject);
        formData.append('s_garageName', s_garageName);
        formData.append('s_garagePay', s_garagePay);
        formData.append('s_rSpace', s_rSpace);
        formData.append('s_gtime', s_gtime);
        formData.append('s_gday', s_gday);
        formData.append('s_garageInfo', s_garageInfo);
        formData.append('pnum', pnum);

        return {
          url: 'MonthShare/MonthShareInsert',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {bbsId: number; statusCode: string}) => {
        return response;
      },
    }),
    uploadMonthlyParkingDirectImages: builder.mutation<
      string,
      Partial<{
        BBSID: number;
        userID: number;
        carImage1: ImageProps | null;
        carImage2: ImageProps | null;
        carImage3: ImageProps | null;
        carImage4: ImageProps | null;
      }>
    >({
      query: ({BBSID, carImage1, carImage2, carImage3, carImage4, userID}) => {
        const formData = new FormData();
        formData.append('bbsId', BBSID);
        formData.append('s_memberId', userID);
        if (carImage1?.uri) {
          formData.append('carImage1', {
            uri: IS_ANDROID ? carImage1?.uri : carImage1?.uri.replace('file://', ''),
            name: carImage1?.fileName,
            type: 'image/png',
          });
        }

        if (carImage2?.uri) {
          formData.append('carImage2', {
            uri: IS_ANDROID ? carImage2?.uri : carImage2?.uri.replace('file://', ''),
            name: carImage2?.fileName,
            type: 'image/png',
          });
        }

        if (carImage3?.uri) {
          formData.append('carImage3', {
            uri: IS_ANDROID ? carImage3?.uri : carImage3?.uri.replace('file://', ''),
            name: carImage3?.fileName,
            type: 'image/png',
          });
        }

        if (carImage4?.uri) {
          formData.append('carImage4', {
            uri: IS_ANDROID ? carImage4?.uri : carImage4?.uri.replace('file://', ''),
            name: carImage4?.fileName,
            type: 'image/png',
          });
        }

        return {
          url: 'MonthShare/updateMonthShareImage',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    createMonthlyParkingDirectComment: builder.mutation<
      string,
      Partial<{
        bbsId: number;
        memberId: number;
        memberPwd: string;
        text: string;
        deviceToken: string;
      }>
    >({
      query: ({bbsId, deviceToken, memberId, memberPwd, text}) => {
        const formData = new FormData();
        formData.append('bbsId', bbsId);
        formData.append('memberId', memberId);
        formData.append('memberPwd', memberPwd);
        formData.append('text', text);
        formData.append('deviceToken', deviceToken);

        return {
          url: 'shareMonthQnaBbsReply/create',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    deleteMonthlyParkingDirectPost: builder.mutation<string, Partial<{id: number; userID: number}>>(
      {
        query: ({id, userID}) => {
          return {
            url: `shareMonthQnaBbs/delete?memberId=${userID}&id=${id}`,
            method: 'DELETE',
          };
        },
        transformResponse: (response: {statusCode: string}) => {
          return response.statusCode;
        },
      },
    ),
    completeMonthlyParkingDirect: builder.mutation<
      string,
      Partial<{id: number; c_appYN: IS_ACTIVE; memberId: number}>
    >({
      query: ({c_appYN, id, memberId}) => {
        return {
          url: `shareMonthQnaBbs/updateingEnd?id=${id}&memberId=${memberId}&c_appYN=${c_appYN}`,
          method: 'POST',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    getMonthlyParkingDirectReply: builder.query<
      MonthlyParkingDirectReplyProps[],
      Partial<{id: number; lastID: number}>
    >({
      query: ({id, lastID}) => {
        return {
          url: `shareMonthQnaBbsReply/getList?lastId=${lastID}&bbsId=${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {list: MonthlyParkingDirectReplyProps[]}) => {
        return response?.list || [];
      },
    }),
    createMonthShareBBSReply: builder.mutation<
      string,
      Partial<{
        BBSID: number;
        text: string;
        memberID: number;
        memberPass: string;
      }>
    >({
      query: ({BBSID, memberID, memberPass, text}) => {
        return {
          url: `shareMonthQnaBbsReply/create?bbsId=${BBSID}&text=${text}&deviceToken=''&memberId=${memberID}&memberPwd=${memberPass}`,
          method: 'POST',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    deleteMonthShareBBSReply: builder.mutation<
      string,
      Partial<{BBSID: number; userID: number; userPass: string}>
    >({
      query: ({BBSID, userID, userPass}) => {
        return {
          url: `shareMonthQnaBbsReply/delete?id=${BBSID}&memberId=${userID}&memberPwd=${userPass}`,
          method: 'DELETE',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
  }),
});

export const {
  useGetMonthlyParkingDirectListQuery,
  useLazyGetMonthlyParkingDirectListQuery,
  useGetMonthlyParkingDirectImageQuery,
  useCreateMonthlyParkingDirectMutation,
  useUploadMonthlyParkingDirectImagesMutation,
  useCreateMonthlyParkingDirectCommentMutation,
  useDeleteMonthlyParkingDirectPostMutation,
  useCompleteMonthlyParkingDirectMutation,
  useLazyGetMonthlyParkingDirectReplyQuery,
  useGetMonthlyParkingDirectReplyQuery,
  useCreateMonthShareBBSReplyMutation,
  useDeleteMonthShareBBSReplyMutation,
} = monthlyParkingDirectServices;
