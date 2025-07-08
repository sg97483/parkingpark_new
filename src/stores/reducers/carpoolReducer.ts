import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  ChargeFilterModel,
  DriverFilterModel,
  PassengerFilterModel,
  PointFilterModel,
  SettlementFilterModel,
  UsageHistoryFilterModel,
} from '~model/carpool-filter-model';
import {ChatRoomModel} from '~model/chat-model';

export interface CarpoolState {
  passengerModeFilter: PassengerFilterModel;
  driverModeFilter: DriverFilterModel;
  chargeFilter: ChargeFilterModel;
  pointFilter: PointFilterModel;
  passengerUsageHistoryFilter: UsageHistoryFilterModel;
  driverUsageHistoryFilter: UsageHistoryFilterModel;
  isFirstTimeApproval: boolean;
  settlementFilter: SettlementFilterModel;
  listChatData: {
    isFetching: boolean;
    unreadTotal: number;
    data: ChatRoomModel[];
  };
}

const initialState: CarpoolState = {
  passengerModeFilter: {
    gender: '',
    destinationDistanceRange: '',
    distanceRangeFromDeparturePoint: '',
    carInOut: 'in',
    selectedDay: [],
    roadDayfilterftDate: '0',
    routeRegistrationComplete: false,
  },
  driverModeFilter: {
    carInOut: '',
    destinationDistanceRange: '',
    distanceRangeFromDeparturePoint: '',
    gender: '',
  },
  chargeFilter: {
    situation: '',
    viewingPeriod: '',
  },
  pointFilter: {
    situation: '',
    viewingPeriod: '',
  },
  passengerUsageHistoryFilter: {
    carInOut: '',
    statusBooking: '',
    endDate: undefined,
    startDate: undefined,
  },
  driverUsageHistoryFilter: {
    carInOut: '',
    statusBooking: '',
    endDate: undefined,
    startDate: undefined,
  },
  isFirstTimeApproval: true,
  settlementFilter: {
    calYNfilter: 'ALL',
    frDate: undefined,
    toDate: undefined,
  },
  listChatData: {
    isFetching: true,
    unreadTotal: 0,
    data: [],
  },
};

const carpoolSlice = createSlice({
  name: 'carpoolReducer',
  initialState,
  reducers: {
    clearCarpoolReducarData: () => initialState,
    cachePassengerFilter: (state, action: PayloadAction<PassengerFilterModel>) => {
      state.passengerModeFilter = action.payload;
    },
    cacheDriverFilter: (state, action: PayloadAction<DriverFilterModel>) => {
      state.driverModeFilter = action.payload;
    },
    cacheChargeFilter: (state, action: PayloadAction<ChargeFilterModel>) => {
      state.chargeFilter = action.payload;
    },
    cachePointFilter: (state, action: PayloadAction<PointFilterModel>) => {
      state.pointFilter = action.payload;
    },
    cachePassengerUsageHistoryFilter: (state, action: PayloadAction<UsageHistoryFilterModel>) => {
      state.passengerUsageHistoryFilter = action.payload;
    },
    cacheDriverUsageHistoryFilter: (state, action: PayloadAction<UsageHistoryFilterModel>) => {
      state.driverUsageHistoryFilter = action.payload;
    },
    cacheIsFirstTimeApproval: (state, action: PayloadAction<boolean>) => {
      state.isFirstTimeApproval = action.payload;
    },
    cacheSettlementFilter: (state, action: PayloadAction<SettlementFilterModel>) => {
      state.settlementFilter = action.payload;
    },
    cacheListChatData: (
      state,
      action: PayloadAction<{
        isFetching: boolean;
        unreadTotal: number;
        data: ChatRoomModel[];
      }>,
    ) => {
      state.listChatData = action.payload;
    },
  },
});

export const {
  clearCarpoolReducarData,
  cachePassengerFilter,
  cacheDriverFilter,
  cacheChargeFilter,
  cachePointFilter,
  cacheDriverUsageHistoryFilter,
  cachePassengerUsageHistoryFilter,
  cacheIsFirstTimeApproval,
  cacheSettlementFilter,
  cacheListChatData,
} = carpoolSlice.actions;

const carpoolReducer = carpoolSlice.reducer;

export default carpoolReducer;
