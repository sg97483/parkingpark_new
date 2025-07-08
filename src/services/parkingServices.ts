import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL, IS_ANDROID} from '~constants/constant';
import {
  BBSNoticeProps,
  ConnectedCarProps,
  ImageProps,
  MonthlyParkingDirectImageProps,
  MonthlyParkingDirectProps,
  MyListValetQnaBbsProps,
  ParkingCarpooInfoProps,
  ParkingEvalProps,
  ParkingLimitProps,
  ParkingProps,
  ReplyProps,
  TicketProps,
  ValetQnaBbsCreateProps,
  ValetQnaBbsProps,
} from '~constants/types';
import {createFormDataToObject} from '~utils/index';
import RNFS from 'react-native-fs';
import {FavoriteParkingParkModel} from '~model/parking-park-model';

export const parkingServices = createApi({
  reducerPath: 'parkingServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    parkingDetails: builder.query<ParkingProps, Partial<{id: number}>>({
      query({id}) {
        return {
          url: `parkingTicket/getParkInfo?parkingLotId=${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {item: ParkingProps}) => {
        return response.item;
      },
    }),
    parkingEvalList: builder.query<ParkingEvalProps[], Partial<{id: number}>>({
      query: ({id}) => {
        return {
          url: `EvalBbs/getList?parkingLotId=${id}&lastId=0&count=100`,
          method: 'GET',
        };
      },
      transformResponse: (response: {list: ParkingEvalProps[]}) => {
        return response.list || [];
      },
    }),
    parkingReviewList: builder.query<ParkingEvalProps[], Partial<{id: number}>>({
      query: ({id}) => {
        return {
          url: `bbs/list?parkingLotId=${id}&lastId=0&count=100`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listBbs: ParkingEvalProps[]}) => {
        return (
          response.listBbs.map(item => {
            return {
              ...item,
              isReview: true,
            };
          }) || []
        );
      },
    }),
    likeReview: builder.mutation<string, Partial<{id: number; userID: number}>>({
      query: ({id, userID}) => {
        return {
          url: `like/create?memberId=${userID}&bbsId=${id}`,
          method: 'POST',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response.statusCode;
      },
    }),
    ticketInfo: builder.query<TicketProps[], Partial<{id: number}>>({
      query: ({id}) => {
        return {
          url: `sMember/getTicketInfo?parkId=${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {parkingTicket: TicketProps[]}) => {
        return response?.parkingTicket || [];
      },
    }),
    getParkingLimit: builder.query<ParkingLimitProps | null, Partial<{parkingLotId: number}>>({
      query: ({parkingLotId}) => {
        return {
          url: `parkingTicket/getParkLimit?parkingLotId=${parkingLotId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {item: ParkingLimitProps | null}) => {
        return response.item;
      },
    }),
    getParkingCarPoolInfo: builder.query<
      ParkingCarpooInfoProps | null,
      Partial<{parkingLotId: number}>
    >({
      query: ({parkingLotId}) => {
        return {
          url: `parkingTicket/getCarpoolparkingInfo?parkingLotId=${parkingLotId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {itemCInfo: ParkingCarpooInfoProps | null}) => {
        return response.itemCInfo;
      },
    }),
    createBBSNotice: builder.mutation<
      string,
      Partial<{
        memberId: number;
        memberPwd: string;
        subject: string;
        text: string;
        photo?: ImageProps | null;
      }>
    >({
      query: ({memberId, memberPwd, subject, text, photo}) => {
        var fdata = new FormData();

        fdata.append('memberId', String(memberId ?? ''));
        fdata.append('memberPwd', String(memberPwd ?? ''));
        fdata.append('subject', String(subject ?? ''));
        fdata.append('text', String(text ?? ''));
        fdata.append('deviceToken', '');
        if (photo) {
          fdata.append('photo', {
            uri: IS_ANDROID ? photo?.uri : photo?.uri.replace('file://', ''),
            name: photo?.fileName,
            type: 'image/png',
          } as any);
          fdata.append('photoFullWidth', String(photo?.width ?? ''));
          fdata.append('photoFullHeight', String(photo?.height ?? ''));
        } else {
          let path = IS_ANDROID
            ? RNFS.DocumentDirectoryPath + '/image_term.png'
            : RNFS.TemporaryDirectoryPath + '/image_term.png';

          fdata.append('photo', {
            uri: IS_ANDROID ? `file:///${path}` : path,
            name: 'image_term',
            type: 'image/png',
          } as any);
        }

        return {
          url: 'bbsNotice/create',
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: fdata,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    createTextReview: builder.mutation<
      string,
      Partial<{
        memberId: number;
        memberPwd: string;
        parkingLotId?: number;
        state?: string;
        city?: string;
        subject: string;
        text: string;
        _eval: string;
      }>
    >({
      query: ({city, memberId, memberPwd, parkingLotId, state, subject, text, _eval}) => {
        const formData = new FormData();

        if (city) {
          formData.append('city', city);
        } else {
          formData.append('city', '');
        }

        if (state) {
          formData.append('state', state);
        } else {
          formData.append('state', '');
        }

        if (parkingLotId !== undefined && parkingLotId !== null) {
          formData.append('parkingLotId', String(parkingLotId));
        }

        formData.append('memberId', String(memberId ?? ''));
        formData.append('memberPwd', String(memberPwd ?? ''));
        formData.append('subject', String(subject ?? ''));
        formData.append('text', String(text ?? ''));
        formData.append('deviceToken', ''); // 이건 이미 string이므로 그대로 사용
        formData.append('eval', String(_eval ?? ''));

        return {
          url: 'bbs/createText',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response.statusCode;
      },
    }),
    createBBSWithImage: builder.mutation<
      string,
      Partial<{
        memberId: number;
        memberPwd: string;
        parkingLotId?: number;
        state?: string;
        city?: string;
        subject: string;
        text: string;
        photo: ImageProps;
        _eval: string;
      }>
    >({
      query: ({city, memberId, memberPwd, parkingLotId, photo, state, subject, text, _eval}) => {
        const formData = new FormData();
        if (city) {
          formData.append('city', city);
        } else {
          formData.append('city', '');
        }

        if (state) {
          formData.append('state', state);
        } else {
          formData.append('state', '');
        }

        if (parkingLotId !== undefined && parkingLotId !== null) {
          formData.append('parkingLotId', String(parkingLotId));
        }

        formData.append('memberId', String(memberId ?? ''));
        formData.append('memberPwd', String(memberPwd ?? ''));
        formData.append('subject', String(subject ?? ''));
        formData.append('text', String(text ?? ''));

        formData.append('deviceToken', '');
        formData.append('photo', {
          uri: IS_ANDROID
            ? String(photo?.uri ?? '')
            : String((photo?.uri ?? '').replace('file://', '')),
          name: String(photo?.fileName ?? ''),
          type: String(photo?.type ?? ''),
        } as any);

        formData.append('photoFullWidth', String(photo?.width ?? ''));
        formData.append('photoFullHeight', String(photo?.height ?? ''));
        formData.append('eval', String(_eval ?? ''));

        return {
          url: 'bbs/create',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    deleteParkingReview: builder.mutation<
      any,
      Partial<{memberId: number; memberPwd: string; id: number}>
    >({
      query: ({id, memberId, memberPwd}) => {
        console.log(`bbs/delete?memberId=${memberId}&memberPwd=${memberPwd}&id=${id}`);
        return {
          url: `bbs/delete?memberId=${memberId}&memberPwd=${memberPwd}&id=${id}`,
          method: 'POST',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    createParkingReply: builder.mutation<
      string,
      Partial<{
        bbsId: number;
        memberId: number;
        memberPwd: string;
        text: string;
      }>
    >({
      query: ({bbsId, memberId, memberPwd, text}) => {
        return {
          url: `reply/create?bbsId=${bbsId}&memberId=${memberId}&memberPwd=${memberPwd}&text=${text}&deviceToken=""`,
          method: 'POST',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response.statusCode;
      },
    }),
    listParkingReply: builder.query<ReplyProps[], Partial<{lastId: number; bbsId: number}>>({
      query: ({bbsId, lastId}) => {
        return {
          url: `reply/list?bbsId=${bbsId}&lastId=${lastId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listReply: ReplyProps[]}) => {
        return response.listReply || [];
      },
    }),
    getBBSNoticeList: builder.query<BBSNoticeProps[], void>({
      query: () => {
        return {
          url: 'bbsNotice/list',
          method: 'GET',
        };
      },
      transformResponse: (response: {listBbsNotice: BBSNoticeProps[]}) => {
        return response?.listBbsNotice || [];
      },
    }),
    bbsList: builder.query<
      ParkingEvalProps[],
      Partial<{
        count: number;
        lastID: number;
        state?: string;
        city?: string;
        parkingID?: number;
      }>
    >({
      query: ({count, lastID, city, parkingID, state}) => {
        if (state && city) {
          return {
            url: `bbs/list?count=${count}&lastId=${lastID}&state=${state}&city=${city}`,
            method: 'GET',
          };
        }
        if (parkingID) {
          return {
            url: `bbs/list?count=${count}&lastId=${lastID}&parkingLotId=-1`,
            method: 'GET',
          };
        }

        return {
          url: `bbs/list?count=${count}&lastId=${lastID}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listBbs: ParkingEvalProps[]}) => {
        return response.listBbs || [];
      },
    }),
    valetQnaBbsCreate: builder.mutation<string, Partial<ValetQnaBbsCreateProps>>({
      query: ({
        memberId,
        memberPwd,
        subject,
        text,
        photo,
        deviceToken = '',
        parkingLotId = 70004,
      }: ValetQnaBbsCreateProps) => {
        const formData = new FormData();

        formData.append('memberId', String(memberId ?? ''));
        formData.append('memberPwd', memberPwd);
        formData.append('subject', subject);
        formData.append('text', text);
        formData.append('deviceToken', deviceToken);
        formData.append('parkingLotId', String(parkingLotId ?? ''));

        if (photo) {
          formData.append('photo', {
            uri: IS_ANDROID ? photo?.uri : photo?.uri.replace('file://', ''),
            name: photo?.fileName,
            type: photo?.type,
          } as any);
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
          } as any);
        }

        return {
          url: 'valetQnaBbs/create',
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

    getListValetQnaBbs: builder.query<
      any,
      Partial<{
        count?: number;
        lastID?: number;
        parkId?: number;
      }>
    >({
      query: ({count = 10, lastID = 0, parkId = 700051}) => {
        return {
          url: `valetQnaBbs/getList?parkingLotId=${parkId}&lastId=${lastID}&count=${count}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {list: ValetQnaBbsProps[]}) => {
        return response?.list || [];
      },
    }),
    getMyListValetQnaBbs: builder.query<
      any,
      Partial<{
        count?: number;
        lastID?: number;
        parkId?: number | undefined;
        memberId: number;
        memberPwd: string;
      }>
    >({
      query: ({count = 10, lastID = 0, parkId = undefined, memberId, memberPwd}) => {
        if (parkId === 0) {
          return {
            url: `valetQnaBbs/getMyList?parkingLotId=${parkId}&lastId=${lastID}&count=${count}&memberId=${memberId}&memberPwd=${memberPwd}`,
            method: 'GET',
          };
        }
        return {
          url: `valetQnaBbs/getMyList?lastId=${lastID}&count=${count}&memberId=${memberId}&memberPwd=${memberPwd}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {list: MyListValetQnaBbsProps[]}) => {
        return response?.list || [];
      },
    }),
    deleteQnaBbs: builder.mutation<
      any,
      Partial<{
        memberId: string;
        memberPwd: string;
        id: string;
      }>
    >({
      query: ({id, memberId, memberPwd}) => {
        const formData = new FormData();
        formData.append('memberId', String(memberId ?? ''));
        formData.append('memberPwd', String(memberPwd ?? ''));
        formData.append('id', String(id ?? ''));

        return {
          url: 'valetQnaBbs/delete',
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    valetQnaBbsReply: builder.query<ReplyProps[], Partial<{lastId: number; bbsId: number}>>({
      query: ({bbsId, lastId}) => {
        return {
          url: `valetQnaBbsReply/getList?bbsId=${bbsId}&lastId=${lastId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {list: ReplyProps[]}) => {
        return response.list || [];
      },
    }),
    createValetQnaBbsReply: builder.mutation<
      any,
      Partial<{
        bbsId: string;
        memberId: string;
        memberPwd: string;
        text: string;
        deviceToken?: string;
      }>
    >({
      query: ({bbsId, memberId, memberPwd, text, deviceToken = ''}) => {
        const formData = new FormData();

        formData.append('bbsId', String(bbsId ?? ''));
        formData.append('memberId', String(memberId ?? ''));
        formData.append('memberPwd', String(memberPwd ?? ''));
        formData.append('text', String(text ?? ''));

        formData.append('deviceToken', deviceToken);
        return {
          url: 'valetQnaBbsReply/create',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    deleteValetBbsReply: builder.mutation<
      any,
      Partial<{memberId: number; memberPwd: string; id: number}>
    >({
      query: ({id, memberId, memberPwd}) => {
        return {
          url: `valetQnaBbsReply/delete?memberId=${memberId}&memberPwd=${memberPwd}&id=${id}`,
          method: 'POST',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    requestConnectedCarInfo: builder.query<ConnectedCarProps[], Partial<{memberId: number}>>({
      query: ({memberId}) => {
        return {
          url: `sMember/setConnectedCar?memberId=${memberId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listConnectedCar: ConnectedCarProps[]}) => {
        return response?.listConnectedCar || [];
      },
    }),
    writePublic: builder.mutation<
      any,
      Partial<{
        sMemberId: string | null;
        sGarageName: string | null;
        sGarageInfo: string | null;
        sGarageAddress: string | null;
        sGaragePay: string | null;
        sShareSpace: string | null;
        sGTime: string | null;
        sGDay: string | null;
        pNum: string | null;
      }>
    >({
      query: ({
        sMemberId,
        sGarageName,
        sGarageInfo,
        sGarageAddress,
        sGaragePay,
        sShareSpace,
        sGTime,
        sGDay,
        pNum,
      }) => {
        const formData = new FormData();
        formData.append('s_memberId', String(sMemberId ?? ''));
        formData.append('s_garageName', String(sGarageName ?? ''));
        formData.append('s_garageInfo', String(sGarageInfo ?? ''));
        formData.append('s_garageAddress', String(sGarageAddress ?? ''));
        formData.append('s_garagePay', String(sGaragePay ?? ''));
        formData.append('s_shareSpace', String(sShareSpace ?? ''));
        formData.append('s_gtime', String(sGTime ?? ''));
        formData.append('s_gday', String(sGDay ?? ''));
        formData.append('pnum', String(pNum ?? ''));

        return {
          url: 'share/ShareInsert',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
    updateShareImage: builder.mutation<
      any,
      Partial<{
        bbsId: string;
        sMemberId: string | null;
        carImage1?: ImageProps | null;
        carImage2?: ImageProps | null;
        carImage3?: ImageProps | null;
        carImage4?: ImageProps | null;
      }>
    >({
      query: ({bbsId, sMemberId, carImage1, carImage2, carImage3, carImage4}) => {
        const formData = new FormData();
        formData.append('bbsId', String(bbsId ?? ''));
        formData.append('s_memberId', String(sMemberId ?? ''));

        if (carImage1?.uri) {
          formData.append('carImage1', {
            uri: IS_ANDROID
              ? String(carImage1?.uri ?? '')
              : String((carImage1?.uri ?? '').replace('file://', '')),
            name: String(carImage1?.fileName ?? ''),
            type: String(carImage1?.type ?? ''),
          } as any);
        }
        if (carImage2?.uri) {
          formData.append('carImage2', {
            uri: IS_ANDROID
              ? String(carImage2?.uri ?? '')
              : String((carImage2?.uri ?? '').replace('file://', '')),
            name: String(carImage2?.fileName ?? ''),
            type: String(carImage2?.type ?? ''),
          } as any);
        }
        if (carImage3?.uri) {
          formData.append('carImage3', {
            uri: IS_ANDROID
              ? String(carImage3?.uri ?? '')
              : String((carImage3?.uri ?? '').replace('file://', '')),
            name: String(carImage3?.fileName ?? ''),
            type: String(carImage3?.type ?? ''),
          } as any);
        }
        if (carImage4?.uri) {
          formData.append('carImage4', {
            uri: IS_ANDROID
              ? String(carImage4?.uri ?? '')
              : String((carImage4?.uri ?? '').replace('file://', '')),
            name: String(carImage4?.fileName ?? ''),
            type: String(carImage4?.type ?? ''),
          } as any);
        }

        return {
          url: 'share/updateShareImage',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: response => {
        return response;
      },
    }),
    getParkingSharedDetail: builder.query<
      MonthlyParkingDirectProps[],
      Partial<{parkingLotId: string; s_memberId: number; memberPwd: string}>
    >({
      query: ({parkingLotId, s_memberId, memberPwd}) => {
        return {
          url: `share/shareSearch?parkingLotId=${parkingLotId}&s_memberId=${s_memberId}&memberPwd=${memberPwd}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listShare: MonthlyParkingDirectProps[]}) => {
        return response?.listShare || [];
      },
    }),
    getParkingSharedImage: builder.query<
      MonthlyParkingDirectImageProps[],
      Partial<{parkingLotId: string; s_memberId: number; memberPwd: string}>
    >({
      query: ({parkingLotId, s_memberId, memberPwd}) => {
        return {
          url: `share/selectShareImage?parkingLotId=${parkingLotId}&s_memberId=${s_memberId}&memberPwd=${memberPwd}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listShare: MonthlyParkingDirectImageProps[]}) => {
        return response?.listShare || [];
      },
    }),
    getParkingSharingLocation: builder.mutation<
      ParkingEvalProps[],
      Partial<{
        state: string;
        city: string;
        count: number;
        lastId: number;
      }>
    >({
      query: body => {
        return {
          url: 'http://cafe.wisemobile.kr:8080/bbs/list',
          method: 'POST',
          body: createFormDataToObject(body),
        };
      },
      transformResponse: (response: {listBbs: ParkingEvalProps[]}) => {
        return response?.listBbs || [];
      },
    }),
    getListEvalBbs: builder.mutation<
      any[],
      Partial<{
        lastId: number;
        parkingLotId: number;
        count: number;
      }>
    >({
      query: body => {
        return {
          url: 'EvalBbs/getList',
          method: 'POST',
          body: createFormDataToObject(body),
        };
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),
    updateQNAReadStatus: builder.query<string, {id: number}>({
      query: ({id}) => {
        return {
          url: 'valetQnaBbs/readYNupdate/',
          method: 'PUT',
          params: {readYN: 'Y', id},
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    getFavoriteParkingParkList: builder.query<FavoriteParkingParkModel[], {memberId: number}>({
      query: ({memberId}) => {
        return {
          url: 'sMember/readMyParkFavorites/',
          method: 'GET',
          params: {memberId},
        };
      },
      transformResponse: (response: {listParkFavorites: FavoriteParkingParkModel[]}) => {
        return response?.listParkFavorites ?? [];
      },
    }),
    removeFavoriteParking: builder.mutation<string, {parkId: number; memberId: number}>({
      query: ({memberId, parkId}) => {
        return {
          url: 'sMember/updateParkFavorites',
          method: 'PATCH',
          params: {
            favStatus: 'N',
            parkId,
            memberId,
          },
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    addFavoriteParking: builder.mutation<string, {parkId: number; memberId: number}>({
      query: ({memberId, parkId}) => {
        return {
          url: 'sMember/createParkFavorites/',
          method: 'POST',
          params: {parkId, memberId, favStatus: 'Y'},
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
  }),
});

export const {
  useParkingDetailsQuery,
  useLazyParkingDetailsQuery,
  useParkingEvalListQuery,
  useTicketInfoQuery,
  useLazyTicketInfoQuery,
  useLazyGetParkingLimitQuery,
  useGetParkingLimitQuery,
  useGetParkingCarPoolInfoQuery,
  useCreateTextReviewMutation,
  useParkingReviewListQuery,
  useLikeReviewMutation,
  useDeleteParkingReviewMutation,
  useCreateParkingReplyMutation,
  useListParkingReplyQuery,
  useLazyListParkingReplyQuery,
  useLazyBbsListQuery,
  useValetQnaBbsCreateMutation,
  useGetListValetQnaBbsQuery,
  useLazyGetListValetQnaBbsQuery,
  useLazyGetMyListValetQnaBbsQuery,
  useDeleteQnaBbsMutation,
  useLazyValetQnaBbsReplyQuery,
  useCreateValetQnaBbsReplyMutation,
  useDeleteValetBbsReplyMutation,
  useRequestConnectedCarInfoQuery,
  useLazyRequestConnectedCarInfoQuery,
  useGetBBSNoticeListQuery,
  useWritePublicMutation,
  useUpdateShareImageMutation,
  useGetParkingSharedDetailQuery,
  useGetParkingSharedImageQuery,
  useGetParkingSharingLocationMutation,
  useCreateBBSWithImageMutation,
  useCreateBBSNoticeMutation,
  useGetListEvalBbsMutation,
  useUpdateQNAReadStatusQuery,
  useGetFavoriteParkingParkListQuery,
  useAddFavoriteParkingMutation,
  useRemoveFavoriteParkingMutation,
} = parkingServices;
