import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface TermAndContitionState {
  isFirstRun: boolean;
  isAgreeTerms: boolean;
  databaseVersion: number;
  bottomTabHeight: number;
  carpoolAlarmList: {
    roomID: string;
    day: string;
    time: string;
    type: string;
    notiID?: string;
  }[];
  allowChatNoti: boolean;
  allowServiceNoti: boolean;
}

const initialState: TermAndContitionState = {
  isFirstRun: true,
  isAgreeTerms: false,
  databaseVersion: 0,
  bottomTabHeight: 0,
  carpoolAlarmList: [],
  allowChatNoti: true,
  allowServiceNoti: true,
};

const termAndConditionSlice = createSlice({
  name: 'termAndConditionReducer',
  initialState,
  reducers: {
    clearTermAndConditionData: state => {
      return {
        ...initialState,
        isFirstRun: state.isFirstRun,
        isAgreeTerms: state.isAgreeTerms,
      };
    },
    cacheIsFirstRun: (state: TermAndContitionState, action: PayloadAction<boolean>) => {
      state.isFirstRun = action.payload;
    },
    cacheIsAgreeTerms: (state: TermAndContitionState, action: PayloadAction<boolean>) => {
      state.isAgreeTerms = action.payload;
    },
    cacheDatabaseVersion: (state: TermAndContitionState, action: PayloadAction<number>) => {
      state.databaseVersion = action.payload;
    },
    cacheBottomTabHeight: (state: TermAndContitionState, action: PayloadAction<number>) => {
      state.bottomTabHeight = action.payload;
    },
    cacheCarpoolAlarmList: (
      state: TermAndContitionState,
      action: PayloadAction<
        {
          roomID: string;
          day: string;
          time: string;
          type: string;
          notiID?: string;
        }[]
      >,
    ) => {
      state.carpoolAlarmList = action.payload;
    },
    cacheAllowChatNoti: (state, action: PayloadAction<boolean>) => {
      state.allowChatNoti = action.payload;
    },
    cacheAllowServiceNoti: (state, action: PayloadAction<boolean>) => {
      state.allowServiceNoti = action.payload;
    },
  },
});

export const {
  cacheIsAgreeTerms,
  cacheIsFirstRun,
  clearTermAndConditionData,
  cacheDatabaseVersion,
  cacheBottomTabHeight,
  cacheCarpoolAlarmList,
  cacheAllowChatNoti,
  cacheAllowServiceNoti,
} = termAndConditionSlice.actions;
const termAndConditionReducer = termAndConditionSlice.reducer;
export default termAndConditionReducer;
