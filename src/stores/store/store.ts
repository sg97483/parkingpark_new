// store.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore, isRejectedWithValue, Middleware, MiddlewareAPI} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import {persistReducer, persistStore} from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import thunkMiddleware from 'redux-thunk';
import {carpoolServices} from '~services/carpoolServices';
import {couponServices} from '~services/couponServices';
import {driverServices} from '~services/driverServices';
import {monthlyParkingDirectServices} from '~services/monthlyParkingDirectServices';
import {naverMapServices} from '~services/naverMapServices';
import {naverServices} from '~services/naverServices';
import {noticeServices} from '~services/noticeServices';
import {notiServices} from '~services/notiServices';
import {parkingServices} from '~services/parkingServices';
import {passengerServices} from '~services/passengerServices';
import {paymentCardServices} from '~services/paymentCardServices';
import {reservationServices} from '~services/reservationServices';
import {usageHistoryServices} from '~services/usageHistoryServices';
import {valetParkingServices} from '~services/valetParkingServices';
import {weatherServices} from '~services/weatherServices';
import {IS_ANDROID} from '../../constants/constant';
import {userServices} from '../../services/userServices';
import rootReducer from '../reducers/rootReducer';

// 미들웨어 정의
export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => next => action => {
  action?.meta?.arg?.queryCacheKey &&
    console.log(
      `
${action?.meta?.baseQueryMeta?.request?.url ? '\u001b[34m' : '\u001b[32m'}${
        action?.meta?.arg?.queryCacheKey
      }
${action?.meta?.baseQueryMeta?.request?.url || ''}
    `,
    );
  if (isRejectedWithValue(action)) {
    console.log(
      `
        \u001b[31mWe got a rejected action!
        ${action?.meta?.arg?.queryCacheKey}
        ${action?.meta?.baseQueryMeta?.request?.url}
        ${JSON.stringify(action?.payload?.data, null, 2)}
      `,
    );
  }

  return next(action);
};

// persist 설정
const persistConfig = {
  key: 'root',
  storage: IS_ANDROID ? FilesystemStorage : AsyncStorage,
  blacklist: [
    userServices.reducerPath,
    parkingServices.reducerPath,
    noticeServices.reducerPath,
    monthlyParkingDirectServices.reducerPath,
    couponServices.reducerPath,
    usageHistoryServices.reducerPath,
    paymentCardServices.reducerPath,
    valetParkingServices.reducerPath,
    reservationServices.reducerPath,
    weatherServices.reducerPath,
    carpoolServices.reducerPath,
    notiServices.reducerPath,
    passengerServices.reducerPath,
    driverServices.reducerPath,
    naverServices.reducerPath,
    naverMapServices.reducerPath,
  ],
};

// 타입 지정된 미들웨어 배열
const middlewares: Middleware[] = [
  thunkMiddleware,
  rtkQueryErrorLogger,
  userServices.middleware,
  parkingServices.middleware,
  noticeServices.middleware,
  monthlyParkingDirectServices.middleware,
  couponServices.middleware,
  usageHistoryServices.middleware,
  paymentCardServices.middleware,
  valetParkingServices.middleware,
  reservationServices.middleware,
  weatherServices.middleware,
  carpoolServices.middleware,
  notiServices.middleware,
  passengerServices.middleware,
  driverServices.middleware,
  naverServices.middleware,
  naverMapServices.middleware,
];

// persistReducer와 중간 미들웨어 설정된 스토어 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: {warnAfter: 500},
    }).concat(middlewares),
});

setupListeners(store.dispatch);

// AppDispatch 및 RootState 타입 정의
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// persistor 내보내기
export let persistor = persistStore(store);
export default store;
