import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '~constants/constant';
import {NoticeEventProps, ReplyNoticeProps, ValetQnaBbsProps} from '~constants/types';

export const noticeServices = createApi({
  reducerPath: 'noticeServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    getNoticeEvent: builder.query<NoticeEventProps, void>({
      query: () => {
        return {
          url: 'check/getNoticeEvent',
          method: 'GET',
        };
      },
      transformResponse: (response: {noticeEvent: NoticeEventProps}) => {
        return response.noticeEvent;
      },
    }),
    getListReplyNotice: builder.query<
      ReplyNoticeProps[],
      Partial<{lastId: number; noticeId: number}>
    >({
      query: ({lastId, noticeId}) => {
        return {
          url: `reply/listNotice?lastId=${lastId}&noticeId=${noticeId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listReply: ReplyNoticeProps[]}) => {
        return response?.listReply || [];
      },
    }),
    replyNotice: builder.mutation<
      string,
      Partial<{
        noticeId: number;
        memberId: number;
        memberPwd: string;
        text: string;
      }>
    >({
      query: ({memberId, memberPwd, noticeId, text}) => {
        const formData = new FormData();
        formData.append('noticeId', String(noticeId));
        formData.append('memberId', String(memberId));
        formData.append('memberPwd', memberPwd ?? '');
        formData.append('text', text ?? '');
        formData.append('deviceToken', '');

        return {
          url: 'reply/create',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    deleteBBSNotice: builder.mutation<
      string,
      Partial<{memberId: number; memberPwd: string; id: number}>
    >({
      query: ({id, memberId, memberPwd}) => {
        return {
          url: `bbsNotice/delete?id=${id}&memberId=${memberId}&memberPwd=${memberPwd}`,
          method: 'DELETE',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    getListReport: builder.query<ValetQnaBbsProps[], {memberId: number; gubun: number}>({
      query: ({memberId, gubun}) => {
        return {
          url: 'complainQnaBbs/getMyList/',
          method: 'GET',
          params: {
            memberId,
            gubun,
          },
        };
      },
      transformResponse: (response: {list: ValetQnaBbsProps[]}) => {
        return response?.list;
      },
    }),
  }),
});

export const {
  useGetNoticeEventQuery,
  useLazyGetNoticeEventQuery,
  useGetListReplyNoticeQuery,
  useReplyNoticeMutation,
  useDeleteBBSNoticeMutation,
  useGetListReportQuery,
} = noticeServices;
