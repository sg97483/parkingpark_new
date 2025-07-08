import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import moment from 'moment';
import {BASE_URL} from '~constants/constant';
import {DriverEvaluationModel, DriverRoadDayModel} from '~model/driver-model';
import {CarpoolPayHistoryModel, CarpoolPayHistoryPayload} from '~model/passenger-model';

export const driverServices = createApi({
  reducerPath: 'driverServices',
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: builder => ({
    getPayHistoryDriver: builder.query<CarpoolPayHistoryModel[], Partial<CarpoolPayHistoryPayload>>(
      {
        query: CarpoolPayHistoryPayload => {
          return {
            url: 'carPoolPay/getCarPoolDriverHistoryList',
            method: 'GET',
            params: {...CarpoolPayHistoryPayload},
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
      },
    ),
    getAllDriverCarpoolHistory: builder.query<CarpoolPayHistoryModel[], {d_memberId: number}>({
      query: ({d_memberId}) => {
        return {
          url: `carPoolPay/getCarPoolDriverHistoryList/?d_memberId=${d_memberId}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {list: CarpoolPayHistoryModel[]}) => {
        return response?.list || [];
      },
    }),
    getReadMyDriverView: builder.query<any, {id: number}>({
      query: ({id}) => {
        return {
          url: `sDriver/readMyDriverRoadInfoView?id=${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: any) => {
        return response?.listDriverDay?.[0];
      },
    }),
    getDriverEvaluationList: builder.query<DriverEvaluationModel[], {driverID: number}>({
      query: ({driverID}) => {
        return {
          url: `sDriver/getRatingInfoMyList/?driverId=${driverID}`,
          method: 'GET',
        };
      },
      transformResponse: (response: {list: DriverEvaluationModel[]}) => {
        return response?.list || [];
      },
    }),
    getAllRouteRequestOfPassenger: builder.query<
      DriverRoadDayModel[],
      Partial<{
        roadDayfilterftDate: number;
        frDate: string;
        toDate: string;
        roadDayfilterGender: number;
        roadDayfilterInOut: number;
      }>
    >({
      query: ({frDate, roadDayfilterGender, roadDayfilterInOut, roadDayfilterftDate, toDate}) => {
        return {
          url: 'sDriver/readAllRiderRoadDayFilterInfo/',
          method: 'GET',
          params: {frDate, roadDayfilterGender, roadDayfilterInOut, roadDayfilterftDate, toDate},
        };
      },
      transformResponse: (response: {listDriverDay: DriverRoadDayModel[]}) => {
        return response?.listDriverDay ?? [];
      },
    }),
    getAllRouteRequestOfPassengerPark: builder.query<
      DriverRoadDayModel[],
      Partial<{
        roadDayfilterftDate: number;
        frDate: string;
        toDate: string;
        roadDayfilterGender: number;
        roadDayfilterInOut: number;
        endParkId: number;
      }>
    >({
      query: ({
        frDate,
        roadDayfilterGender,
        roadDayfilterInOut,
        roadDayfilterftDate,
        toDate,
        endParkId,
      }) => {
        return {
          url: 'sDriver/readAllRiderRoadDayFilterInfoPark/',
          method: 'GET',
          params: {
            frDate,
            roadDayfilterGender,
            roadDayfilterInOut,
            roadDayfilterftDate,
            toDate,
            endParkId,
          },
        };
      },
      transformResponse: (response: {listDriverDay: DriverRoadDayModel[]}) => {
        return response?.listDriverDay ?? [];
      },
    }),
    getRouteRegistrationListOfDriver: builder.query<
      DriverRoadDayModel[],
      {memberId: number; carInOut: string}
    >({
      query: ({memberId, carInOut}) => {
        return {
          url: 'sDriver/readMyDriverDayInfo/',
          method: 'GET',
          params: {memberId, carInOut},
        };
      },
      transformResponse: (response: {listDriver: DriverRoadDayModel[]}) => {
        return response?.listDriver?.filter(item => item?.state !== 'C') ?? [];
      },
    }),
    getDriverSettlementHistory: builder.query<any[], Partial<{d_memberId: number}>>({
      query: ({d_memberId}) => {
        return {
          url: 'carPoolPay/getCarPoolDriverHistoryListCal/',
          method: 'GET',
          params: {d_memberId},
        };
      },
      transformResponse: (response: {list: any[]}) => {
        return response?.list ?? [];
      },
    }),
    readDriverRoadInfoList: builder.query<DriverRoadDayModel[], Partial<{c_memberId: any}>>({
      query: ({c_memberId}) => {
        return {
          url: 'sDriver/readDriverRoadInfoList/',
          method: 'GET',
          params: {c_memberId},
        };
      },
      transformResponse: (response: {listDriverDay: DriverRoadDayModel[]}) => {
        return response.listDriverDay ?? ([] as DriverRoadDayModel[]);
      },
    }),
    drivingRoadPriceUpdate: builder.mutation<string, Partial<{id: any; price?: any; soPrice: any}>>(
      {
        query: ({id, price, soPrice}) => {
          return {
            url: price ? 'sDriver/drivingRoadPriceUpdate' : 'sDriver/drivingRoadSoPriceUpdate',
            method: 'PATCH',
            params: {
              id,
              price,
              soPrice,
            },
          };
        },
        transformResponse: (response: {statusCode: string}) => {
          return response.statusCode;
        },
      },
    ),
    updateEndTimeForReservation: builder.mutation<string, Partial<{id: any; endTime: string}>>({
      query: ({endTime, id}) => {
        return {
          url: 'sDriver/drivingRoadEndTimeUpdate',
          method: 'PATCH',
          params: {endTime, id},
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
    updateEstPrice: builder.query<string, Partial<{id: any; estPrice: number}>>({
      query: ({estPrice, id}) => {
        return {
          url: `sDriver/drivingRoadEstPriceUpdate?id=${id}&estPrice=${estPrice}`,
          method: 'PATCH',
        };
      },
      transformResponse: (response: {statusCode: string}) => {
        return response?.statusCode;
      },
    }),
  }),
});

export const {
  useGetPayHistoryDriverQuery,
  useGetAllDriverCarpoolHistoryQuery,
  useGetReadMyDriverViewQuery,
  useGetDriverEvaluationListQuery,
  useGetAllRouteRequestOfPassengerQuery,
  useGetAllRouteRequestOfPassengerParkQuery,
  useGetRouteRegistrationListOfDriverQuery,
  useGetDriverSettlementHistoryQuery,
  useReadDriverRoadInfoListQuery,
  useLazyReadDriverRoadInfoListQuery,
  useDrivingRoadPriceUpdateMutation,
  useUpdateEndTimeForReservationMutation,
  useLazyUpdateEstPriceQuery,
} = driverServices;
