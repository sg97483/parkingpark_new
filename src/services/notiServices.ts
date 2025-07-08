import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {AUTO_MESSAGE_TYPE} from '~constants/enum';
import {CarpoolPayHistoryModel} from '~model/passenger-model';

export interface NotiBodyModel {
  type?: AUTO_MESSAGE_TYPE;
  chatRoomData?: string;
  driverId?: number;
  carpool?: CarpoolPayHistoryModel;
  resId?: number;
}

export const notiServices = createApi({
  reducerPath: 'notiServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fcm.googleapis.com/',
    prepareHeaders: header => {
      header.set(
        'Authorization',
        'key=AAAAhK4XT5Q:APA91bHi4xNO1vikTEbOS_nTUhK7sNkH46O4X-NlvJ_VyIDNGNGFon3nyEBgC1DNnW--dYNGcAqSdxilCJIGi7aenOshBE8P5GOAV7zW692jrkLby9jXZgqUFO-WVnho-8dJFyOXtn1P',
      );
    },
  }),

  endpoints: builder => ({
    sendFCMNoti: builder.mutation<
      any,
      {
        userToken: string;
        body: string;
        title: string;
        data: NotiBodyModel;
      }
    >({
      query: ({userToken, title, body, data}) => {
        return {
          url: 'fcm/send',
          method: 'POST',
          body: {
            to: userToken,
            data: data,
            notification: {
              title,
              body,
              channel_id: 'DRIVE_ME_CHANEL',
            },
          },
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
  }),
});

export const {useSendFCMNotiMutation} = notiServices;
