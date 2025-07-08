import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import moment from 'moment';
import {BASE_URL} from '~constants/constant';
import {
  DriverEvaluationAverageModel,
  DriverRoadDayModel,
  RouteRegisterModel,
} from '~model/driver-model';
import {
  CancelPaymentBodyModel,
  CarpoolPayHistoryModel,
  CarpoolPayHistoryPayload,
  CarpoolReservationPayModel,
  MyPaymentModel,
} from '~model/passenger-model';

export const passengerServices = createApi({
  reducerPath: 'passengerServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    getPayHistoryRider: builder.query<CarpoolPayHistoryModel[], Partial<CarpoolPayHistoryPayload>>({
      query: CarpoolPayHistoryPayload => {
        return {
          url: 'carPoolPay/getCarPoolRiderHistoryList',
          method: 'GET',
          params: CarpoolPayHistoryPayload,
        };
      },
      transformResponse: (response: {list: CarpoolPayHistoryModel[]}) => {
        return (
          response?.list
            ?.sort((a, b) => {
              return (
                moment(b?.selectDay?.slice(0, 10), 'YYYY.MM.DD').valueOf() -
                moment(a?.selectDay?.slice(0, 10), 'YYYY.MM.DD').valueOf()
              );
            })
            ?.filter(item => item?.rStatusCheck !== 'N' && item?.selectDay !== undefined) ?? []
        );
      },
    }),
    getPayHistoryInfo: builder.query<
      MyPaymentModel,
      {hid: number; requestBy: 'PASSENGER' | 'DRIVER'}
    >({
      query: ({hid, requestBy}) => {
        return {
          url: 'carPoolPay/carPoolPaymentDetailInfo',
          method: 'GET',
          params: {
            hid,
            requestBy: requestBy === 'DRIVER' ? 1 : 0,
          },
        };
      },
      transformResponse: (response: {list: MyPaymentModel[]; statusCode: string}) => {
        if (response.statusCode === '200') {
          return response?.list[0] || {};
        } else {
          return {} as MyPaymentModel;
        }
      },
    }),
    getDriverEvaluation: builder.query<DriverEvaluationAverageModel, {driverID: number}>({
      query: ({driverID}) => {
        return {
          url: `sDriver/readRating/?driverId=${driverID}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {listDriver: DriverEvaluationAverageModel[]}) => {
        return response?.listDriver[0];
      },
    }),
    readMyRating: builder.query<any, Partial<{driverId: any; resId: any}>>({
      query: ({driverId, resId}) => {
        return {
          url: 'sDriver/readMyRating/',
          method: 'GET',
          params: {driverId, resId},
        };
      },
      transformResponse: (response: {listDriverRating: any[]}) => {
        return response.listDriverRating[0];
      },
    }),
    passengerDailyRouteRegistration: builder.mutation<
      any,
      {
        cMemberId: number;
        route: RouteRegisterModel;
        price: number;
      }
    >({
      query: ({cMemberId, route, price}) => {
        return {
          url: 'sDriver/createRidingRoadDay/',
          params: {
            c_memberId: cMemberId,
            selectDay: route?.selectDate,
            startPlace: route?.startPlace,
            startTime: route?.startTime,
            splat: route?.splat,
            splng: route?.splng,
            endPlace: route?.endPlace,
            eplat: route?.eplat,
            eplng: route?.eplng,
            endTime: route?.endTime,
            price: price,
            introduce: route?.introduce,
            state: 'N',
            carInOut: route?.carInOut,
            eval: 0,
            startParkId: route?.startParkId,
            endParkId: route?.endParkId,
          },
          method: 'POST',
        };
      },
      transformResponse: (response: {statusCode: number}) => {
        return response?.statusCode;
      },
    }),
    getMyDailyRouteCommute: builder.query<DriverRoadDayModel[], {c_memberId: number}>({
      query: ({c_memberId}) => {
        return {
          url: 'sDriver/readMyRiderRoadDayInfo/',
          method: 'GET',
          params: {c_memberId},
        };
      },
      transformResponse: (response: {listDriverDay: DriverRoadDayModel[]}) => {
        return response?.listDriverDay ?? [];
      },
    }),
    deleteMyRoute: builder.mutation<string, {id: number; c_memberId: number}>({
      query: ({c_memberId, id}) => {
        return {
          url: 'sDriver/delRiderRoadDay/',
          method: 'DELETE',
          params: {c_memberId, id},
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    getDriverDailyCommuteList: builder.query<
      DriverRoadDayModel[],
      Partial<{
        frDate?: string;
        toDate: string;
        genderFilter: string;
        startFilter: string;
        endFilter: string;
        inOutFilter: string;
        myLatitude: string;
        myLongitude: string;
        roadDayfilterftDate: string;
        routeRegistrationComplete: boolean;
      }>
    >({
      query: ({
        frDate,
        myLatitude,
        myLongitude,
        endFilter,
        genderFilter,
        inOutFilter,
        startFilter,
        toDate,
        roadDayfilterftDate,
        routeRegistrationComplete,
      }) => {
        return {
          url: 'sDriver/readRoadDayRegFilterTest/',
          method: 'GET',
          params: {
            roadDayfilterftDate,
            filterRoadGubun: routeRegistrationComplete ? '1' : '0',
            frDate,
            toDate,
            myLatitude,
            myLongitude,
            endFilter,
            genderFilter,
            inOutFilter,
            startFilter,
          },
        };
      },
      transformResponse: (response: {listDriverMarker: DriverRoadDayModel[]}) => {
        return (
          response?.listDriverMarker?.sort((a, b) => {
            return (
              moment(b?.selectDay?.slice(0, 10), 'YYYY.MM.DD').valueOf() -
              moment(a?.selectDay?.slice(0, 10), 'YYYY.MM.DD').valueOf()
            );
          }) ?? []
        );
      },
    }),
    carpoolReservationPay: builder.mutation<
      {statusCode: string; statusMsg: string},
      Partial<{body: CarpoolReservationPayModel}>
    >({
      query: ({body}) => {
        return {
          url: 'carPoolPay/pay/',
          method: 'PATCH',
          params: {
            r_memberId: body?.r_memberId ?? 0,
            roadInfoId: body?.roadInfoId ?? 0,
            amt: body?.amt ?? 0,
            reservedStDtm: body?.reservedStDtm,
            rStatusCheck: body?.rStatusCheck,
            agCarNumber: body?.agCarNumber ?? '',
            resId: body?.resId,
            carInOut: body?.carInOut,
          },
        };
      },
      transformResponse: response => {
        return response as any;
      },
    }),
    updateRequestStateCheck: builder.mutation<
      string,
      Partial<{rStatusCheck: 'N' | 'A' | 'P' | 'O' | 'E' | 'C' | 'R'; resId: number}>
    >({
      query: ({rStatusCheck, resId}) => {
        return {
          url: 'sDriver/updateRequestStateCheck/',
          method: 'PATCH',
          params: {
            rStatusCheck,
            resId,
          },
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode ?? '';
      },
    }),
    updateRoadDayStateCheck: builder.mutation<
      string,
      Partial<{
        state: 'N' | 'A' | 'P' | 'O' | 'E' | 'C' | 'R';
        roadInfoId: number;
        isPassengerRoute?: boolean;
      }>
    >({
      query: ({roadInfoId, state, isPassengerRoute = false}) => {
        return {
          url: isPassengerRoute
            ? 'sDriver/updateRidingRoadDayStateEnd'
            : 'sDriver/updateRoadDayStateEnd',
          method: 'PATCH',
          params: {
            roadInfoId,
            state,
          },
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode ?? '';
      },
    }),
    updateRoadInfoIDValue: builder.mutation<
      string,
      Partial<{roadInfoId: number; memberId: number; resId: number}>
    >({
      query: ({roadInfoId, resId}) => {
        return {
          url: 'sDriver/updateHistoryRoadInfoId/',
          method: 'PATCH',
          params: {roadInfoId, resId},
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response.statusCode;
      },
    }),
    cancelPayment: builder.mutation<string, Partial<CancelPaymentBodyModel>>({
      query: CancelPaymentBodyModel => {
        return {
          url: 'carPoolPay/cancelPay/',
          method: 'POST',
          params: {
            ...CancelPaymentBodyModel,
          },
        };
      },
      transformResponse: (response: {statusCode: string; RET_COMMENT: string}) => {
        return response?.statusCode ?? response?.RET_COMMENT ?? '';
      },
    }),
    penaltyPayment: builder.mutation<
      string,
      Partial<{cancelRequestBy: 'DRIVER' | 'PASSENGER'; resId: any}>
    >({
      query: ({cancelRequestBy, resId}) => {
        return {
          url: 'sDriver/penaltyCancelUpdate/',
          method: 'PATCH',
          params: {cancelRequestBy, resId},
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    createDriverRating: builder.mutation<
      string,
      Partial<{
        resId: number;
        driverId: number;
        memberId: number;
        driverQ1: number;
        driverQ2: number;
        driverQ3: number;
        text: string;
      }>
    >({
      query: ({resId, driverQ3, memberId, driverId, driverQ1, driverQ2, text}) => {
        return {
          url: 'sDriver/createDriverRating/',
          method: 'POST',
          params: {resId, driverQ3, memberId, driverId, driverQ1, driverQ2, text},
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode ?? '';
      },
    }),
  }),
});

export const {
  useGetPayHistoryRiderQuery,
  useLazyGetPayHistoryRiderQuery,
  useGetPayHistoryInfoQuery,
  useGetDriverEvaluationQuery,
  usePassengerDailyRouteRegistrationMutation,
  useGetMyDailyRouteCommuteQuery,
  useLazyGetMyDailyRouteCommuteQuery,
  useDeleteMyRouteMutation,
  useGetDriverDailyCommuteListQuery,
  useCarpoolReservationPayMutation,
  useUpdateRequestStateCheckMutation,
  useUpdateRoadDayStateCheckMutation,
  useUpdateRoadInfoIDValueMutation,
  useCancelPaymentMutation,
  usePenaltyPaymentMutation,
  useCreateDriverRatingMutation,
  useReadMyRatingQuery,
} = passengerServices;
