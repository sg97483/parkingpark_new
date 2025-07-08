import {combineReducers} from 'redux';
import coordinateReducer from '~reducers/coordinateReducer';
import {carpoolServices} from '~services/carpoolServices';
import {couponServices} from '~services/couponServices';
import {driverServices} from '~services/driverServices';
import {monthlyParkingDirectServices} from '~services/monthlyParkingDirectServices';
import {naverMapServices} from '~services/naverMapServices';
import {naverServices} from '~services/naverServices';
import {notiServices} from '~services/notiServices';
import {noticeServices} from '~services/noticeServices';
import {parkingServices} from '~services/parkingServices';
import {passengerServices} from '~services/passengerServices';
import {paymentCardServices} from '~services/paymentCardServices';
import {reservationServices} from '~services/reservationServices';
import {usageHistoryServices} from '~services/usageHistoryServices';
import {userServices} from '~services/userServices';
import {valetParkingServices} from '~services/valetParkingServices';
import {weatherServices} from '~services/weatherServices';
import carpoolReducer from './carpoolReducer';
import chatReducer from './chatReducer';
import eventNoticeReducer from './eventNoticeReducer';
import parkingReducer from './parkingReducer';
import searchRecentLocationReducer from './searchRecentLocationsReducer';
import settlementReducer from './settlementReducer';
import termAndConditionReducer from './termAndContionReducer';
import userReducer from './userReducer';
import weatherReducer from './weatherReducer';

const rootReducer = combineReducers({
  userReducer,
  chatReducer,
  parkingReducer,
  eventNoticeReducer,
  termAndConditionReducer,
  weatherReducer,
  coordinateReducer,
  settlementReducer,
  searchRecentLocationReducer,
  carpoolReducer,
  [userServices.reducerPath]: userServices.reducer,
  [parkingServices.reducerPath]: parkingServices.reducer,
  [noticeServices.reducerPath]: noticeServices.reducer,
  [monthlyParkingDirectServices.reducerPath]: monthlyParkingDirectServices.reducer,
  [couponServices.reducerPath]: couponServices.reducer,
  [usageHistoryServices.reducerPath]: usageHistoryServices.reducer,
  [paymentCardServices.reducerPath]: paymentCardServices.reducer,
  [valetParkingServices.reducerPath]: valetParkingServices.reducer,
  [reservationServices.reducerPath]: reservationServices.reducer,
  [weatherServices.reducerPath]: weatherServices.reducer,
  [carpoolServices.reducerPath]: carpoolServices.reducer,
  [notiServices.reducerPath]: notiServices.reducer,
  [passengerServices.reducerPath]: passengerServices.reducer,
  [driverServices.reducerPath]: driverServices.reducer,
  [naverServices.reducerPath]: naverServices.reducer,
  [naverMapServices.reducerPath]: naverMapServices.reducer,
});

export default rootReducer;
