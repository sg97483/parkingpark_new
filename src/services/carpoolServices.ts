import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import RNFS from 'react-native-fs';
import {
  BlockedUserModel,
  CarpoolMemberModel,
  DriverRoadDayModel,
  FavoriteUserModel,
  MyDriverModel,
} from '~/model/driver-model';
import {BASE_URL, IS_ANDROID} from '~constants/constant';
import {ImageProps} from '~constants/types';
import {RequestInfoModel} from '~model/chat-model';
import {SettlementModel} from '~model/settlement-model';
import {createFormDataToObject} from '~utils/index';

export const carpoolServices = createApi({
  reducerPath: 'carpoolServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    getReadDriverToken: builder.query<
      {nic: string; profileImageUrl: string; carNumber: string; memberId: number},
      {email: string}
    >({
      query: ({email}) => {
        return {
          url: `sDriver/readDriverToken?email=${email}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listDriver: any}) => {
        return response?.listDriver[0];
      },
    }),
    getMyDriverRoad: builder.query<MyDriverModel, {memberId: number; id: number}>({
      query: ({memberId, id}) => {
        return {
          url: `sDriver/readMyDriverRoadInfo?memberId=${memberId}&id=${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listDriver: MyDriverModel[]}) => {
        return response.listDriver[0];
      },
    }),
    getMyDriverDetailRoad: builder.query<MyDriverModel, {memberId: number; id: number}>({
      query: ({memberId, id}) => {
        return {
          url: `sDriver/readMyDriverRoadDetailInfo?memberId=${memberId}&id=${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listDriver: MyDriverModel[]}) => {
        return response.listDriver[0];
      },
    }),
    getMyRiderRoad: builder.query<MyDriverModel, {memberId: number; id: number}>({
      query: ({memberId, id}) => {
        return {
          url: `sDriver/readMyRiderRoadInfo?memberId=${memberId}&id=${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listDriver: MyDriverModel[]}) => {
        return response.listDriver[0];
      },
    }),
    readAllDriverRoadDayInfo: builder.query<DriverRoadDayModel[], void>({
      query: () => {
        return {
          url: 'sDriver/readAllDriverRoadDayInfo',
          method: 'GET',
        };
      },
      transformResponse: (response: {listDriverDay: DriverRoadDayModel[]}) => {
        return response?.listDriverDay?.filter(item => item?.state !== 'C');
      },
    }),
    readMyCarpoolInfo: builder.query<CarpoolMemberModel, {memberId: number}>({
      query: ({memberId}) => {
        return {
          url: `sDriver/readCMember?memberId=${memberId}`,
        };
      },
      transformResponse: (response: {listCMember: CarpoolMemberModel[]}) => {
        return response?.listCMember[0];
      },
    }),
    readMyDriver: builder.query<MyDriverModel, {memberId: number}>({
      query: ({memberId}) => {
        return {
          url: `sDriver/readMyDriver?memberId=${memberId}`,
        };
      },
      transformResponse: (response: {listDriver: MyDriverModel[]}) => {
        return response.listDriver[0];
      },
    }),
    getReadMyDriverDay: builder.query<DriverRoadDayModel, {id: number}>({
      query: ({id}) => {
        return {
          url: `sDriver/readMyDriverRoadInfoView/?id=${id}`,
          method: 'POST',
        };
      },
      transformResponse: (response: {listDriverDay: DriverRoadDayModel[]}) => {
        return response.listDriverDay[0] || {};
      },
    }),
    myDriverRoad: builder.mutation<MyDriverModel, {memberId: number; id: number}>({
      query: ({memberId, id}) => {
        return {
          url: `sDriver/readMyRiderRoadInfo?memberId=${memberId}&id=${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listDriver: MyDriverModel[]}) => {
        return response.listDriver[0];
      },
    }),
    createDriver: builder.mutation<MyDriverModel, {memberId: number | string; termsYN: string}>({
      query: body => {
        const formData = createFormDataToObject(body);

        return {
          url: 'sDriver/createDriver',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {listDriver: MyDriverModel[]}) => {
        return response.listDriver[0];
      },
    }),
    dailyRouteRegistration: builder.mutation<
      any,
      {
        c_memberId: any;
        selectDay: string;
        startPlace: string;
        startTime: string;
        splat: any;
        splng: any;
        stopOverPlace?: string;
        soplat: any;
        soplng?: any;
        endPlace: string;
        eplat: any;
        eplng: any;
        price: any;
        soPrice?: any;
        carInOut: string;
        introduce: string;
        startParkId?: any;
        endParkId?: any;
      }
    >({
      query: ({
        c_memberId,
        price,
        carInOut,
        endPlace,
        eplat,
        eplng,
        introduce,
        selectDay,
        soplat,
        splat,
        splng,
        startPlace,
        startTime,
        soplng,
        stopOverPlace,
        startParkId,
        endParkId,
        soPrice,
      }) => {
        return {
          url: 'sDriver/createDrivingRoadDay/',
          method: 'POST',
          params: {
            c_memberId,
            price,
            state: 'N',
            carInOut,
            endPlace,
            eplat,
            eplng,
            introduce,
            selectDay,
            soplat,
            soplng,
            startPlace,
            startTime,
            stopOverPlace,
            splat,
            splng,
            startParkId,
            endParkId,
            soPrice,
            eval: 0,
          },
        };
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),
    reportUser: builder.mutation<
      string,
      {
        memberId: number;
        memberPwd: string;
        rdId: number;
        gubun: 'REPORT_PASS' | 'REPORT_DRIVER';
        subject: string;
        text: string;
        photo?: ImageProps | null;
        bankName: string;
        bankNum: string;
        pName: string;
      }
    >({
      query: ({
        gubun,
        rdId,
        subject,
        text,
        photo,
        bankName,
        bankNum,
        memberId,
        memberPwd,
        pName,
      }) => {
        const body = new FormData();
        body.append('memberId', memberId);
        body.append('memberPwd', memberPwd);
        body.append('gubun', gubun === 'REPORT_DRIVER' ? 1 : 2);
        body.append('rdId', rdId);
        body.append('subject', subject);
        body.append('text', text);
        body.append('bankName', bankName);
        body.append('bankNum', bankNum);
        body.append('pName', pName);
        if (photo) {
          body.append('photo', {
            uri: IS_ANDROID ? photo?.uri : photo?.uri.replace('file://', ''),
            name: photo?.fileName,
            type: 'image/png',
          });
          body.append('photoFullWidth', photo?.width);
          body.append('photoFullHeight', photo?.height);
        } else {
          let path = IS_ANDROID
            ? RNFS.DocumentDirectoryPath + '/image_term.png'
            : RNFS.TemporaryDirectoryPath + '/image_term.png';

          body.append('photo', {
            uri: IS_ANDROID ? `file:///${path}` : path,
            name: 'image_term',
            type: 'image/png',
          });
        }

        return {
          url: 'complainQnaBbs/create',
          method: 'POST',
          body,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    deleteDailyRoute: builder.mutation<any, {id: number; cMemberId: number}>({
      query: ({id, cMemberId}) => {
        return {
          url: `sDriver/delRoadDay/?id=${id}&c_memberId=${cMemberId}`,
        };
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),
    getFavoriteDriverList: builder.query<FavoriteUserModel[], {memberId: number}>({
      query: ({memberId}) => {
        return {
          url: `sDriver/readMyFavoritesRider/?memberId=${memberId}`,
        };
      },
      transformResponse: (response: {listDriver: FavoriteUserModel[]}) => {
        return response?.listDriver;
      },
    }),
    getFavoritePassengerList: builder.query<FavoriteUserModel[], {memberId: number}>({
      query: ({memberId}) => {
        return {
          url: `sDriver/readMyFavorites/?memberId=${memberId}`,
        };
      },
      transformResponse: (response: {listDriver: FavoriteUserModel[]}) => {
        return response?.listDriver;
      },
    }),
    addFavoritePassenger: builder.mutation<string, {riderId: number; memberId: number}>({
      query: ({memberId, riderId}) => {
        return {
          url: 'sDriver/createFavorites/',
          method: 'POST',
          params: {riderId, memberId, favStatus: 'Y'},
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    removeFavoritePassenger: builder.mutation<string, {riderId: number; memberId: number}>({
      query: ({memberId, riderId}) => {
        return {
          url: 'sDriver/updateFavorites',
          method: 'PATCH',
          params: {memberId, riderId, favStatus: 'N'},
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    addFavoriteDriver: builder.mutation<string, {driverId: number; memberId: number}>({
      query: ({memberId, driverId}) => {
        return {
          url: 'sDriver/createFavoritesRider/',
          method: 'POST',
          params: {driverId, memberId, favStatus: 'Y'},
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    removeFavoriteDriver: builder.mutation<string, {driverId: number; memberId: number}>({
      query: ({memberId, driverId}) => {
        return {
          url: 'sDriver/updateFavoritesRider',
          method: 'PATCH',
          params: {memberId, driverId, favStatus: 'N'},
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    requestNewCarpool: builder.mutation<
      string,
      {
        chatId: string;
        c_dayId: number;
        driverId: number;
        passengerId: number;
        selectDay: string;
        priceSelect: 'E' | 'M' | null;
        resId: number;
        isRouteRegistered: boolean;
        requestBy?: 'PASSENGER' | 'DRIVER';
      }
    >({
      query: ({
        chatId,
        c_dayId,
        driverId,
        selectDay,
        priceSelect,
        resId,
        isRouteRegistered,
        requestBy = 'PASSENGER',
        passengerId,
      }) => {
        return {
          url:
            requestBy === 'PASSENGER'
              ? '/sDriver/createRiderRequest/'
              : '/sDriver/createDriverRequest/',
          method: 'PATCH',
          params:
            requestBy === 'PASSENGER'
              ? {
                  chatId,
                  c_dayId,
                  driverId: driverId,
                  memberId: passengerId,
                  selectDay,
                  priceSelect,
                  resId,
                  requestBy: requestBy,
                  isRouteRegistered: isRouteRegistered ? 1 : 0,
                }
              : {
                  chatId,
                  c_dayId,
                  riderId: passengerId,
                  memberId: driverId,
                  selectDay,
                  priceSelect,
                  resId,
                  requestBy: requestBy,
                  isRouteRegistered: isRouteRegistered ? 1 : 0,
                },
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    getBlockedUserList: builder.query<BlockedUserModel[], Partial<{memberId: number}>>({
      query: ({memberId}) => {
        return {
          url: 'sDriver/readBlockList/',
          method: 'GET',
          params: {memberId},
        };
      },
      transformResponse: (response: {listDriver: BlockedUserModel[]}) => {
        return response?.listDriver ?? [];
      },
    }),
    blockUser: builder.mutation<string, Partial<{blockMId: number; memberId: number}>>({
      query: ({blockMId, memberId}) => {
        return {
          url: 'sDriver/createBlock/',
          method: 'POST',
          params: {
            blockMId,
            memberId,
            blockYN: 'Y',
          },
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode ?? '';
      },
    }),
    unblockUser: builder.mutation<string, Partial<{blockMId: number; memberId: number}>>({
      query: ({blockMId, memberId}) => {
        return {
          url: 'sDriver/releaseBlock',
          method: 'DELETE',
          params: {
            blockMId,
            memberId,
          },
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode ?? '';
      },
    }),
    createPaymentHistory: builder.mutation<
      any,
      Partial<{chatId: string; d_memberId: number; r_memberId: number; roadInfoId: number}>
    >({
      query: ({chatId, d_memberId, r_memberId, roadInfoId}) => {
        return {
          url: '/sDriver/createPaymentHistory/',
          method: 'POST',
          params: {
            chatId,
            d_memberId,
            r_memberId,
            roadInfoId,
          },
        };
      },
      transformResponse: (response: {listDriverRequest: any}) => {
        return response?.listDriverRequest;
      },
    }),
    getRouteRequestInfo: builder.query<
      RequestInfoModel,
      Partial<{resId: number; requestBy?: 'PASSENGER' | 'DRIVER'}>
    >({
      query: ({resId, requestBy = 'PASSENGER'}) => {
        return {
          url:
            requestBy === 'PASSENGER'
              ? 'sDriver/readRiderRequestInfo/'
              : 'sDriver/readDriverRequestInfo/',
          method: 'GET',
          params: {
            resId,
          },
        };
      },
      transformResponse: (response: {listDriver: RequestInfoModel[]}) => {
        return response?.listDriver?.[0];
      },
    }),
    getSettlementHistory: builder.query<
      SettlementModel[],
      Partial<{
        memberId: number;
        calYNfilter: 'IN_APP' | 'CREDIT_CARD' | 'ALL';
        frDate?: string;
        toDate?: string;
      }>
    >({
      query: ({memberId, calYNfilter, frDate, toDate}) => {
        return {
          url: 'carPoolPay/getDriverAccountAllList/',
          method: 'GET',
          params: {
            memberId,
            calYNfilter: calYNfilter === 'IN_APP' ? 1 : calYNfilter === 'CREDIT_CARD' ? 2 : 0,
            selectDayfilter: frDate && toDate ? 1 : 0,
            frDate,
            toDate,
          },
        };
      },
      transformResponse: (response: {list: SettlementModel[]}) => {
        return response?.list ?? [];
      },
    }),
    cancelPassengerRequest: builder.mutation<string, Partial<{id: number; memberId: number}>>({
      query: ({id, memberId}) => {
        return {
          url: 'sDriver/delRiderRequest/?id=48&memberId=773',
          method: 'DELETE',
          params: {
            id,
            memberId,
          },
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode ?? '';
      },
    }),
    getDriverHistoryAccountList: builder.query<SettlementModel[], Partial<{d_memberId: string}>>({
      query: ({d_memberId}) => {
        return {
          url: `carPoolPay/getDriverHistoryAccountList/?d_memberId=${d_memberId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {list: SettlementModel[]}) => {
        return response?.list ?? '';
      },
    }),
    blockRoadDriverDay: builder.query<
      any[],
      Partial<{d_memberId: string; selectDay: string; carInOut: string}>
    >({
      query: ({d_memberId, selectDay, carInOut}) => {
        return {
          url: `carPoolPay/readDriverRoadBlockDay/?d_memberId=${d_memberId}&selectDay=${selectDay}&carInOut=${carInOut}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {list: any[]}) => {
        return response?.list ?? '';
      },
    }),
  }),
});

export const {
  useGetReadDriverTokenQuery,
  useLazyGetReadDriverTokenQuery,
  useGetMyDriverRoadQuery,
  useLazyGetMyRiderRoadQuery,
  useReadAllDriverRoadDayInfoQuery,
  useLazyReadAllDriverRoadDayInfoQuery,
  useReadMyCarpoolInfoQuery,
  useReadMyDriverQuery,
  useGetReadMyDriverDayQuery,
  useMyDriverRoadMutation,
  useGetMyRiderRoadQuery,
  useLazyGetMyDriverRoadQuery,
  useCreateDriverMutation,
  useDailyRouteRegistrationMutation,
  useReportUserMutation,
  useDeleteDailyRouteMutation,
  useGetFavoriteDriverListQuery,
  useGetFavoritePassengerListQuery,
  useAddFavoritePassengerMutation,
  useRemoveFavoritePassengerMutation,
  useAddFavoriteDriverMutation,
  useRemoveFavoriteDriverMutation,
  useRequestNewCarpoolMutation,
  useGetBlockedUserListQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  useCreatePaymentHistoryMutation,
  useGetSettlementHistoryQuery,
  useGetRouteRequestInfoQuery,
  useLazyGetRouteRequestInfoQuery,
  useCancelPassengerRequestMutation,
  useGetMyDriverDetailRoadQuery,
  useGetDriverHistoryAccountListQuery,
  useLazyBlockRoadDriverDayQuery,
} = carpoolServices;
