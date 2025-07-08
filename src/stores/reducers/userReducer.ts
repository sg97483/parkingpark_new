import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IS_ACTIVE} from '~constants/enum';
import {CarInsuranceInfo, CoordRoute, TemporaryRouteProps, UserProps} from '~constants/types';
import {NotiBodyModel} from '~services/notiServices';
import {userServices} from '~services/userServices';

interface UserState {
  user: UserProps | undefined;
  userToken: {
    id: number | undefined;
    password: string | undefined;
    adminYN: IS_ACTIVE | undefined;
    adminValetParkingId: string | undefined;
    parkingLotId: string | undefined;
  };
  FCMToken: string;
  myDriverInfo: CarInsuranceInfo | undefined;
  carpoolMode: 'PASSENGER' | 'DRIVER';
  temporaryRoute: TemporaryRouteProps;
  isInitialAddCar: boolean;
  currentScreen: string;
  notificationData: NotiBodyModel | undefined;
}

const initialState: UserState = {
  user: undefined,
  isInitialAddCar: false,
  userToken: {
    id: undefined,
    password: undefined,
    adminYN: undefined,
    adminValetParkingId: undefined,
    parkingLotId: undefined,
  },
  FCMToken: '',
  myDriverInfo: undefined,
  carpoolMode: 'PASSENGER',
  temporaryRoute: {
    startPlaceIn: '',
    endPlaceIn: '',
    startPlaceOut: '',
    endPlaceOut: '',
    startCoordIn: undefined,
    endCoordIn: undefined,
    startCoordOut: undefined,
    endCoordOut: undefined,
  },
  currentScreen: '',
  notificationData: undefined,
};

const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    clearUserData: () => initialState,
    cacheUserInfo: (state: UserState, action: PayloadAction<UserProps>) => {
      state.user = {...state.user, ...action.payload};
    },
    cacheMyDriverInfo: (state: UserState, action: PayloadAction<CarInsuranceInfo>) => {
      state.myDriverInfo = action.payload;
    },
    cacheFCMToken: (state: UserState, action: PayloadAction<string>) => {
      state.FCMToken = action.payload;
    },
    cacheIsInitialAddNewCar: (state, action: PayloadAction<boolean>) => {
      state.isInitialAddCar = action.payload;
    },
    cacheUserToken: (
      state,
      action: PayloadAction<{
        id: number | undefined;
        password: string | undefined;
        adminYN: IS_ACTIVE | undefined;
        adminValetParkingId: string | undefined;
        parkingLotId: string | undefined;
      }>,
    ) => {
      state.userToken = {
        id: action.payload.id,
        password: action.payload.password,
        adminYN: action.payload.adminYN,
        adminValetParkingId: action.payload.adminValetParkingId,
        parkingLotId: action.payload.parkingLotId,
      };
    },
    changeCarpoolMode: (state, action: PayloadAction<'PASSENGER' | 'DRIVER'>) => {
      state.carpoolMode = action.payload;
    },
    clearTemporaryRoute: state => {
      state.temporaryRoute = {
        startPlaceIn: '',
        endPlaceIn: '',
        startPlaceOut: '',
        endPlaceOut: '',
        startCoordIn: undefined,
        endCoordIn: undefined,
        startCoordOut: undefined,
        endCoordOut: undefined,
      };
    },
    cacheTemporaryRoute: (
      state,
      action: PayloadAction<{
        startPlaceIn?: string;
        endPlaceIn?: string;
        startPlaceOut?: string;
        endPlaceOut?: string;

        startCoordIn?: CoordRoute;
        endCoordIn?: CoordRoute;
        startCoordOut?: CoordRoute;
        endCoordOut?: CoordRoute;
      }>,
    ) => {
      state.temporaryRoute = {...state.temporaryRoute, ...action.payload};
    },
    updateCurrentScreen: (state, action: PayloadAction<string>) => {
      state.currentScreen = action.payload;
    },
    updateNotificationData: (state, action: PayloadAction<NotiBodyModel | undefined>) => {
      state.notificationData = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(userServices?.endpoints?.getUserInfo?.matchFulfilled, (state, {payload}) => {
      if (payload) {
        state.user = payload;
      }
    });
  },
});

export const {
  clearUserData,
  cacheUserInfo,
  cacheUserToken,
  cacheFCMToken,
  cacheMyDriverInfo,
  changeCarpoolMode,
  cacheTemporaryRoute,
  clearTemporaryRoute,
  cacheIsInitialAddNewCar,
  updateCurrentScreen,
  updateNotificationData,
} = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
