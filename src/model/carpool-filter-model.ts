import {DateData} from 'react-native-calendars';

export interface PassengerFilterModel {
  selectedDay: DateData[];
  carInOut: 'in' | 'out';
  gender: 'MALE' | 'FEMALE' | '';
  distanceRangeFromDeparturePoint: '3KM' | '5KM' | '';
  destinationDistanceRange: '3KM' | '5KM' | '';
  roadDayfilterftDate: '0' | '1';
  routeRegistrationComplete: boolean;
}
export interface DriverFilterModel {
  carInOut: 'in' | 'out' | '';
  gender: 'MALE' | 'FEMALE' | '';
  distanceRangeFromDeparturePoint: '3KM' | '5KM' | '';
  destinationDistanceRange: '3KM' | '5KM' | '';
}
export interface ChargeFilterModel {
  situation: 'DIRECT_CHARGING' | 'SETTLEMENT_RECHARGE' | 'USED' | '';
  viewingPeriod: '12M' | '6M' | '3M' | '1M' | '';
}

export interface PointFilterModel {
  situation: 'ACCUMULATE' | 'USED' | '';
  viewingPeriod: '12M' | '6M' | '3M' | '1M' | '';
}

export interface UsageHistoryFilterModel {
  carInOut: 'in' | 'out' | '';
  statusBooking: '' | 'R' | 'E' | 'C' | 'P';
  startDate: number | undefined;
  endDate: number | undefined;
}

export interface SettlementFilterModel {
  calYNfilter: 'IN_APP' | 'CREDIT_CARD' | 'ALL';
  frDate?: DateData;
  toDate?: DateData;
}
