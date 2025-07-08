import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import type {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import React, {useEffect, useState} from 'react';
import {AppState} from 'react-native';
import {ChatRoomModel, RequestInfoModel} from '~/model/chat-model';
import Register from '~/screens/register';
import VerifyPhoneNumber from '~/screens/verify-phone-number';
import ParkingRequestNoticeImageDetail from '~components/parking-question-notice-board/parking-request-notice-image-detail';
import RegisterParkingSharedImageDetail from '~components/register-parking-shared/register-parking-shared-image-detail';
import {REPORT_TYPE, TERMINAL_SELECT} from '~constants/enum';
import {
  AddressKakaoProps,
  BBSNoticeProps,
  CreditCardProps,
  MonthlyParkingDirectImageProps,
  MonthlyParkingDirectProps,
  ParkingEvalProps,
  ParkingProps,
  PayInfoProps,
  PaymentHistoryProps,
  RoadInDriverUpdateProps,
  RoadUpdateProps,
  SNSUserProfile,
  TicketProps,
  ValetMainNoticeProps,
  ValetQnaBbsProps,
} from '~constants/types';
import {
  DriverEvaluationAverageModel,
  DriverRoadDayModel,
  MyDriverModel,
  RouteRegisterModel,
} from '~model/driver-model';
import {CarDriverModel, CarpoolPayHistoryModel} from '~model/passenger-model';
import {SettlementModel} from '~model/settlement-model';
import {ROUTE_KEY} from '~navigators/router';
import {clearChatReducer} from '~reducers/chatReducer';
import {updateCurrentScreen} from '~reducers/userReducer';
import FAQ from '~screens/FAQ';
import ActivityCheckPnum from '~screens/activity-check-pnum';
import ActivitySettingLicense from '~screens/activity-setting-license';
import AirportParking from '~screens/airport-parking/airport-parking';
import AirportParking2 from '~screens/airport-parking/airport-parking2';
import DirectIndoorParkingAtGimpo from '~screens/airport-parking/direct-indoor-parking-at-gimpo';
import DirectIndoorParkingAtIncheon from '~screens/airport-parking/direct-indoor-parking-at-incheon';
import ValetMainNotice from '~screens/airport-parking/valet-main-notice';
import ValetMainNoticeCreate from '~screens/airport-parking/valet-main-notice-create';
import ValetMainNoticeDetail from '~screens/airport-parking/valet-main-notice-detail';
import ValetParkingAdminReservation1 from '~screens/airport-parking/valet-parking-admin-reservation-1';
import ValetParkingAdminReservation2 from '~screens/airport-parking/valet-parking-admin-reservation-2';
import ValetParkingAdminReservation3 from '~screens/airport-parking/valet-parking-admin-reservation-3';
import ValetParkingAtIncheon from '~screens/airport-parking/valet-parking-at-incheon';
import ValetParkingDetail from '~screens/airport-parking/valet-parking-detail';
import ValetParkingImageDetail from '~screens/airport-parking/valet-parking-image-detail';
import ValetParkingReservation1 from '~screens/airport-parking/valet-parking-reservation-1';
import ValetParkingReservation2 from '~screens/airport-parking/valet-parking-reservation-2';
import ValetParkingReservation3 from '~screens/airport-parking/valet-parking-reservation-3';
import ValetParkingReservation4 from '~screens/airport-parking/valet-parking-reservation-4';
import ValetNobelParkingReservation1 from '~screens/airport-parking/valet-nobel-parking-reservation-1';
import ValetNobelParkingReservation2 from '~screens/airport-parking/valet-nobel-parking-reservation-2';
import ValetNobelParkingReservation3 from '~screens/airport-parking/valet-nobel-parking-reservation-3';
import ValetNobelParkingReservation4 from '~screens/airport-parking/valet-nobel-parking-reservation-4';
import ValetParkingSelfDetail from '~screens/airport-parking/valet-parking-self-detail';
import ValetParkingSelfReservation1 from '~screens/airport-parking/valet-parking-self-reservation-1';
import ValetParkingSelfReservation2 from '~screens/airport-parking/valet-parking-self-reservation-2';
import ValetParkingSelfReservation3 from '~screens/airport-parking/valet-parking-self-reservation-3';
import ValetParkingSelfReservation4 from '~screens/airport-parking/valet-parking-self-reservation-4';
import ValetPaymentHistoryAdmin from '~screens/airport-parking/valet-payment-history-admin';
import ValetQnaBbsCreate from '~screens/airport-parking/valet-qna-bbs-create';
import ValetQnaBbsDetail from '~screens/airport-parking/valet-qna-bbs-detail';
import ValetQnaBbsList from '~screens/airport-parking/valet-qna-bbs-list';
import BBSNoticeDetail from '~screens/bbs-notice-detail';
import BlockUser from '~screens/block-user/block-user';
import BusinessCardAndVaccineCertification from '~screens/business-card-and-vaccine-certification';
import BusinessCardAndVaccineRegistration from '~screens/business-card-and-vaccine-registration';
import CarSetting from '~screens/car-setting';
import CardRegistration from '~screens/card-registration/card-registration';
import CardTermsAndConditions from '~screens/card-registration/card-terms-and-conditions';
import CarpoolCalendar from '~screens/carpool-calendar/carpool-calendar';
import CarpoolInsuranceRider, {InsuranceProps} from '~screens/carpool-insurance-rider';
import CarpoolLocationDetail from '~screens/carpool-location-detail';
import CarpoolModeSelect from '~screens/carpool-mode-select';
import CarpoolPrivacyDetail from '~screens/carpool-privacy-detail';
import CarpoolRequestQNA from '~screens/carpool-request-qna/carpool-request-qna';
import CarpoolRequestRegistrationList from '~screens/carpool-request-registration-list';
import CarpoolTermsDetail from '~screens/carpool-terms-detail';
import CarpoolRequest from '~screens/carpool/carpool-request';
import CarpoolRequestDetail from '~screens/carpool/carpool-request-detail';
import CarPoolRouteChoice from '~screens/carpool/carpool-route-choice';
import CarPoolRouteRealtime from '~screens/carpool/carpool-route-realtime';
import CarPoolRouteRegistration from '~screens/carpool/carpool-route-registration';
import CarPoolWayToWorkRegistration from '~screens/carpool/carpool-way-to-work-registration';
import GeneralCarPoolRouteRegistration from '~screens/carpool/general-carpool-route-registration';
import ChangePassword from '~screens/change-password';
import ChatDetail from '~screens/chat-list/chat-detail';
import ChatList from '~screens/chat-list/chat-list';
import DriverChangeRoutePrice from '~screens/chat-list/driver-change-route-price';
import ContactUs from '~screens/contact-us/contact-us';
import CreateBBS from '~screens/create-bbs';
import CreateReview from '~screens/create-review';
import CustomerServiceDetails from '~screens/customer-service-details.tsx/customer-service-details';
import PassengerDailyRouteRegistration from '~screens/daily-route-registration/passenger-daily-route-registration';
import DetailContentCarpool from '~screens/detail-content-carpool';
import DriverHome from '~screens/drive-me-home/driver-home';
import PassengerHome from '~screens/drive-me-home/passenger-home';
import DiverAgreeActivity from '~screens/driver-agree-activity';
import DriverCommunicationRegistration from '~screens/driver-communication/driver-communication-registration';
import ReservationEndCarpool from '~screens/driver-communication/reservation-end-carpool';
import DriverWayToWork1 from '~screens/driver-communication/driver-way-to-work-1';
import DriverWayToWork2 from '~screens/driver-communication/driver-way-to-work-2';
import DriverWayToWork4 from '~screens/driver-communication/driver-way-to-work-4';
import DriverProfileCarInformation from '~screens/driver-profile-car-information';
import DriverProfileEvaluationDetails from '~screens/driver-profile-evaluation-details';
import DriverProfile from '~screens/driver-profile/driver-profile';
import RepresentativeRouteOfDriver from '~screens/driver-profile/representative-route-of-driver';
import CarNumberManagement from '~screens/driver-register/car-number-management';
import CarPhotoRegistration from '~screens/driver-register/car-photo-registration';
import DriverCompleteApproval from '~screens/driver-register/driver-complete-approval';
import DriverFavoriteRegistration from '~screens/driver-register/driver-favorite-registration';
import DriverInsuranceRegistration from '~screens/driver-register/driver-insurance-registration';
import DriverLicenseRegistration from '~screens/driver-register/driver-license-registration';
import DriverPaymentRegistration from '~screens/driver-register/driver-payment-registration';
import DriverRegister from '~screens/driver-register/driver-register';
import DriverRejectApproval from '~screens/driver-register/driver-reject-approval';
import DriverWaitingApproved from '~screens/driver-register/driver-waiting-approved';
import PaymentRegistration from '~screens/driver-register/payment-registration';
import VehicleRegistration from '~screens/driver-register/vehicle-registration';
import DriverRunning from '~screens/driver-running';
import EditPhoneNumber from '~screens/edit-phone-number';
import EditUserInfo from '~screens/edit-user-info';
import EditUserInfoOld from '~screens/edit-user-info-old';
import EvalList from '~screens/eval-list';
import Evaluation from '~screens/evaluation';
import Event from '~screens/event';
import Favorites from '~screens/favotites';
import FindPassword from '~screens/find-password';
import ListOfParkingLots from '~screens/list-of-parking-lots';
import Login from '~screens/login';
import MonthlyParkingDirectList from '~screens/monthly-parking-direct/month-parking-direct-list';
import MonthlyParkingDirectDetails from '~screens/monthly-parking-direct/monthly-parking-direct-details';
import MonthlyParkingDirectMain from '~screens/monthly-parking-direct/monthly-parking-direct-main';
import MonthlyParkingDirectMap from '~screens/monthly-parking-direct/monthly-parking-direct-map';
import MonthlyParkingDirectRegistration from '~screens/monthly-parking-direct/monthly-parking-direct-registration';
import MyRoute from '~screens/my-route/my-route';
import MyRoutes from '~screens/my-routes';
import MyWorkRoute from '~screens/my-work-route';
import Notice from '~screens/notice/notice';
import NoticeDetail from '~screens/notice/notice-detail';
import OperationDetails from '~screens/operation-details/operation-details';
import ParkingAlarmMenu from '~screens/parking-alarm-menu';
import ParkingDetails from '~screens/parking-details';
import ParkingInfoSharing from '~screens/parking-info-sharing';
import ParkingLotConnection from '~screens/parking-lot-connection';
import ParkingRequestNoticeAdd from '~screens/parking-request-notice-board/parking-request-notice-add';
import ParkingRequestNoticeOffline from '~screens/parking-request-notice-board/parking-request-notice-offline';
import ParkingRequestNoticeBoard from '~screens/parking-request-notice-board/parking-request-notice-board';
import ParkingRequestNoticeBoardDetail from '~screens/parking-request-notice-board/parking-request-notice-board-detail';
import PassengerProfile from '~screens/passenger-profile/passenger-profile';
import RepresentativeRouteOfPassenger from '~screens/passenger-profile/representative-route-of-passenger';
import PaymentCompletionPage from '~screens/payment-completion-page';
import PaymentInfomation from '~screens/payment-infomation';
import AccountSettlement from '~screens/payment/account-settlement';
import AccountSettlementDetails from '~screens/payment/account-settlement-details';
import FullListSettlement from '~screens/payment/full-list-settlement';
import PaymentNotice from '~screens/payment/payment-notice';
import ScheduledSettlementDetails from '~screens/payment/scheduled-settlement-details';
import PenaltyPolicy from '~screens/penalty-policy';
import PermissionActivity from '~screens/permission-activity';
import PointManagementNew from '~screens/point-management-new';
import ProfileManagement from '~screens/profile-management';
import ProfileManagementOld from '~screens/profile-management-old';
import RecentSearchLocation from '~screens/recent-search-location';
import RecentSearchLocationMain from '~screens/recent-search-location-main';
import ChargeManagement from '~screens/recharge-point-coupon/charge-management';
import ConfirmDepositMoney from '~screens/recharge-point-coupon/confirm-deposit-money-new';
import CouponBox from '~screens/recharge-point-coupon/coupon-box';
import DepositMoney from '~screens/recharge-point-coupon/deposit-money';
import PointManagement from '~screens/recharge-point-coupon/point-management';
import RecommendDriverList from '~screens/recommend-driver-list';
import RegisterCarInsuranceInformation from '~screens/register-car-insurance-information';
import RegisterInquiry from '~screens/register-inquiry';
import RegisterParkingShared from '~screens/register-parking-shared/register-parking-shared';
import RegisterParkingSharedDetail from '~screens/register-parking-shared/register-parking-shared-detail';
import RegistrationDetail from '~screens/registration-detail';
import ReplyReview from '~screens/reply-review';
import ReportDriverStep1 from '~screens/report-driver/report-driver-step-1';
import ReportDriverStep2 from '~screens/report-driver/report-driver-step-2';
import InsuranceClaimNumber from '~screens/report-passenger.tsx/insurance-claim-number';
import ReportPassStep1 from '~screens/report-passenger.tsx/report-pass-step-1';
import ReportPassStep2 from '~screens/report-passenger.tsx/report-pass-step-2';
import RequestEditParking from '~screens/request-edit-parking';
import Reservation from '~screens/reservation';
import ReservationDetail from '~screens/reservation-detail';
import ParkingTicketAuto from '~screens/reservation/parking-ticket-auto';
import ParkingTicketAutoDetail from '~screens/reservation/parking-ticket-auto-detail';
import ReservationSimple from '~screens/reservation/reservation-simple';
import ReservationSimplePay from '~screens/reservation/reservation-simple-pay';
import RouteHistoryDriver from '~screens/route-history-driver';
import RouteHistoryPassenger from '~screens/route-history-passenger';
import RouteRequestRegistrationDetail from '~screens/route-request-registration-detail/route-request-registration-detail';
import Running from '~screens/running';
import ServiceTermsAndConditions from '~screens/service-terms-and-conditions';
import AgreeToSubscribeToCarpool from '~screens/service-terms-and-conditions/agree-to-subscribe-to-carpool';
import LocationBasedTermsOfUse from '~screens/service-terms-and-conditions/location-based-terms-of-use';
import PrivacyPolicy from '~screens/service-terms-and-conditions/privacy-policy';
import TermsAndConditions from '~screens/service-terms-and-conditions/terms-and-conditions';
import Setting from '~screens/setting';
import SettingPassengerActivity from '~screens/setting-passenger';
import Splash from '~screens/splash';
import TakePhotoParkingLot from '~screens/take-photo-parking-lot';
import TermsAndPolicies from '~screens/terms-and-policies';
import TutorialSlider from '~screens/tutorial-slider';
import TestScreen from '~screens/TestScreen';
import CancelRoutePaymentConfirmation from '~screens/usage-history/cancel-route-payment-confirmation';
import ParkingPaymentReceipt from '~screens/usage-history/parking-payment-receipt';
import UsageHistory from '~screens/usage-history/usage-history';
import UsageHistoryOld from '~screens/usage-history/usage-history-old';
import ValetInfo from '~screens/valte-info';
import VehicleNumber from '~screens/vehicle-number';
import VehicleNumberAdd from '~screens/vehicle-number-add';
import VehicleNumberManagement from '~screens/vehicle-number-management';
import VehicleManagement from '~screens/vehicle-payment-usage-favorite-management/vehicle-management';
import WaitingRoute from '~screens/waiting-route/waiting-route';
import WayToWorkRegistration1 from '~screens/way-to-work-registration-1';
import WayToWorkRegistration2 from '~screens/way-to-work-registration-2';
import WayToWorkRegistration4 from '~screens/way-to-work-registration-4';
import WayToWorkRegistration5 from '~screens/way-to-work-registration-5';
import {useAppDispatch} from '~store/storeHooks';
import BottomTab from './bottom-tab';
import CarpoolRequestPark from '~screens/carpool/carpool-request-park';
import PopupNewSearch from '~components/new-home/popup-new-search';
import EventBanner from '~screens/event-banner';
import EventGame from '~screens/event-game';
import HotPlace from '~screens/hot-place';
import HotPlaceNew from '~components/new-home/hot-place-new';

export type RootStackScreensParams = {
  Splash: undefined;
  ParkingParkHome:
    | {
        selectedTab: 1 | 2 | 3 | 4;
      }
    | undefined;
  ParkingDetails: {id: number; handleGoBackDriverWayToWork?: () => void};
  Login: undefined;
  RequestEditParking: {id: number; garageName: string};
  CreateReview: {parkingData: ParkingProps};
  PermissionActivity: undefined;
  ValetInfo: undefined;
  Tutorial: {fromHome?: boolean} | undefined;
  TutorialSlider: {fromHome?: boolean} | undefined;
  TestScreen: undefined;
  EditUserInfo: undefined;
  EditUserInfoOld: undefined;
  Register: {data: SNSUserProfile} | undefined;
  VerifyPhoneNumber: {onReturn: (event: any) => void};
  EditProfile: undefined;
  Event: undefined;
  ChangePassword: undefined;
  FindPassword: {phoneNumber: string};
  ReplyReview: {data: ParkingEvalProps};
  ParkingInfoSharing: undefined;
  CreateBBS: {city: string; state: string};
  MonthlyParkingDirectMain: undefined;
  MonthlyParkingDirectRegistration: undefined;
  MonthlyParkingDirectList: undefined;
  PaymentInfomation: undefined;
  ParkingAlarmMenu: undefined;
  MonthlyParkingDirectDetails: {
    data: MonthlyParkingDirectProps;
    images: MonthlyParkingDirectImageProps | undefined;
  };
  MonthlyParkingDirectMap: undefined;
  ListOfParkingLots: undefined;
  TakePhotoParkingLot: undefined;
  ChargeManagement: undefined;
  PointManagement: undefined;
  DepositMoney: undefined;
  UsageHistory: {focusTab: 1 | 2 | 3} | undefined;
  UsageHistoryOld: undefined;
  ParkingRequestNoticeBoard: undefined | {showHeader: boolean};
  ParkingRequestNoticeAdd: undefined;
  ParkingRequestNoticeOffline: undefined;
  ParkingRequestNoticeBoardDetail: {notice: ValetQnaBbsProps; isReport?: boolean};
  FAQ: undefined;
  CouponBox: undefined;
  ReservationDetail: {item: PaymentHistoryProps};
  PointManagementNew: undefined;
  Reservation: {
    parkingLot: ParkingProps;
  };
  ParkingPaymentReceipt: {tid: string};
  ValetParkingAtIncheon: undefined;
  DirectIndoorParkingAtIncheon: undefined;
  DirectIndoorParkingAtGimpo: undefined;
  VehicleNumber: undefined;
  VehicleNumberManagement: undefined;
  VehicleNumberAdd: undefined;
  ValetParkingDetail: {parkingID: number};
  ValetMainNotice: undefined;
  ValetMainNoticeDetail: {item: ValetMainNoticeProps};
  ValetMainNoticeCreate: undefined;
  ValetParkingReservation1: {parkingLot: ParkingProps};
  ValetNobelParkingReservation1: {parkingLot: ParkingProps};
  ValetParkingReservation2: {
    parkingLot: ParkingProps;
    valetSel: TERMINAL_SELECT;
    agCarNumber: string;
    requirements: string;
  };
  ValetNobelParkingReservation2: {
    parkingLot: ParkingProps;
    valetSel: TERMINAL_SELECT;
    agCarNumber: string;
    requirements: string;
  };
  ValetParkingReservation3: {
    parkingLot: ParkingProps;
    requirements: string;
    agCarNumber: string;
    nightFee: number;
    inFlightDate: string;
    outFlightDate: string;
    inFlightDateTag: string;
    outFlightDateTag: string;
    valetSel: TERMINAL_SELECT;
    usePoint: number;
    usePointSklent: number;
    useCoupon: number;
    inFlightAndCityName: string;
    outFlightAndCityName: string;
    inFlightTimeInMillis: number;
    outFlightTimeInMillis: number;
  };
  ValetNobelParkingReservation3: {
    parkingLot: ParkingProps;
    requirements: string;
    agCarNumber: string;
    nightFee: number;
    inFlightDate: string;
    outFlightDate: string;
    inFlightDateTag: string;
    outFlightDateTag: string;
    valetSel: TERMINAL_SELECT;
    usePoint: number;
    usePointSklent: number;
    useCoupon: number;
    inFlightAndCityName: string;
    outFlightAndCityName: string;
    inFlightTimeInMillis: number;
    outFlightTimeInMillis: number;
  };
  ValetParkingReservation4: {
    parkingLot: ParkingProps;
    requirements: string;
    agCarNumber: string;
    inFlightDate: string;
    outFlightDate: string;
    inFlightDateTag: string;
    outFlightDateTag: string;
    valetSel: TERMINAL_SELECT;
    usePoint: number;
    usePointSklent: number;
    useCoupon: number;
    inFlightAndCityName: string;
    outFlightAndCityName: string;
    inFlightTimeInMillis: number;
    outFlightTimeInMillis: number;
    totalPrice: number;
  };
  ValetNobelParkingReservation4: {
    parkingLot: ParkingProps;
    requirements: string;
    agCarNumber: string;
    inFlightDate: string;
    outFlightDate: string;
    inFlightDateTag: string;
    outFlightDateTag: string;
    valetSel: TERMINAL_SELECT;
    usePoint: number;
    usePointSklent: number;
    useCoupon: number;
    inFlightAndCityName: string;
    outFlightAndCityName: string;
    inFlightTimeInMillis: number;
    outFlightTimeInMillis: number;
    totalPrice: number;
  };
  ValetParkingSelfDetail: {parkingID: number; title?: string};
  ValetParkingSelfReservation1: {parkingLot: ParkingProps};
  ValetParkingSelfReservation2: {
    parkingLot: ParkingProps;
    agCarNumber: string;
    requirements: string;
  };
  ValetParkingSelfReservation3: {
    parkingLot: ParkingProps;
    requirements: string;
    agCarNumber: string;
    nightFee: number;
    inFlightDate: string;
    outFlightDate: string;
    inFlightDateTag: string;
    outFlightDateTag: string;
    usePoint: number;
    usePointSklent: number;
    useCoupon: number;
    inFlightAndCityName: string;
    outFlightAndCityName: string;
    inFlightTimeInMillis: number;
    outFlightTimeInMillis: number;
  };
  ValetParkingSelfReservation4: {
    parkingLot: ParkingProps;
    requirements: string;
    agCarNumber: string;
    inFlightDate: string;
    outFlightDate: string;
    inFlightDateTag: string;
    outFlightDateTag: string;
    usePoint: number;
    usePointSklent: number;
    useCoupon: number;
    inFlightAndCityName: string;
    outFlightAndCityName: string;
    inFlightTimeInMillis: number;
    outFlightTimeInMillis: number;
    totalPrice: number;
  };
  ParkingLotConnection: undefined;
  SettingPassengerActivity: undefined;
  ValetQnaBbsList: {parkingID: number} | undefined;
  ValetQnaBbsDetail: {bbs: ValetQnaBbsProps};
  ValetQnaBbsCreate: {parkID: number} | undefined;
  ValetPaymentHistoryAdmin: {parkId: number} | undefined;
  ValetParkingAdminReservation1: {
    payment: PaymentHistoryProps;
    parkId: number;
  };
  ValetParkingAdminReservation2: {
    paymentHistory: PaymentHistoryProps;
  };
  ValetParkingAdminReservation3: {
    paymentHistory: PaymentHistoryProps;
  };
  ValetParkingImageDetail: {
    imageUrl: string;
    paymentHistoryId: number;
    number: number;
  };
  ParkingTicketAuto: {parkingLotId: number};
  ParkingTicketAutoDetail: {
    payInfo: PayInfoProps;
    selectedDate: number;
    usePoint: number;
    memberIDUse: string;
    requirements: string;
    coupon: number;
    selectedTicket: TicketProps;
    parkingLotID: number;
  };
  CarSetting: undefined;
  RegisterCarInsuranceInformation: undefined;
  ActivitySettingLicense: undefined;
  ActivityCheckPnum: undefined;
  DiverAgreeActivity: {isPassenger: boolean};
  CarpoolPrivacyDetail: {
    acceptCarpool: () => void;
    disagreeCarpool?: () => void;
    isChecked?: boolean;
  };
  CarpoolLocationDetail: {
    acceptCarpool: () => void;
    disagreeCarpool?: () => void;
    isChecked?: boolean;
  };
  CarpoolTermsDetail: {
    acceptCarpool: () => void;
    disagreeCarpool?: () => void;
    isChecked?: boolean;
  };
  CarpoolInsuranceRider: {
    acceptCarpool: (data: InsuranceProps) => void;
    data: InsuranceProps;
    disagreeCarpool?: (data: InsuranceProps) => void;
  };
  ReservationSimplePay: {
    parkId: string | number;
    parkTicketName: string;
    requirements: string;
  };
  RegisterParkingShared: undefined;
  BBSNoticeDetail: {
    item: BBSNoticeProps;
  };
  RegisterParkingSharedDetail: undefined;
  RegisterParkingSharedImageDetail: {
    imageUrl: string;
  };
  ReservationSimple: undefined;
  ParkingRequestNoticeImageDetail: {
    imageUrl: string;
  };
  AirportParking: undefined;
  AirportParking2: undefined;
  HotPlace: undefined;
  HotPlaceNew: undefined;
  EventBanner: undefined;
  EventGame: undefined;
  EvalList: {parkingID: number; parkingData: ParkingProps};
  ConfirmDepositMoney: {money: number};
  ServiceTermsAndConditions: undefined;
  TermsAndConditions: {func: (_: boolean) => void};
  PrivacyPolicy: {func: (_: boolean) => void};
  LocationBasedTermsOfUse: {func: (_: boolean) => void};
  AgreeToSubscribeToCarpool: {func: (_: boolean) => void};
  PassengerHome: undefined;
  BusinessCardAndVaccineRegistration: {
    isDriver?: boolean;
    isFromPsgProfile?: boolean;
    isEdit?: boolean;
  };
  CarpoolRequestRegistrationList: {passengerID: number} | undefined;
  DriverRegister: undefined;
  VehicleRegistration: {isAddNewCar: boolean} | undefined;
  CarNumberManagement: undefined;
  CarPhotoRegistration: undefined;
  DriverLicenseRegistration: undefined;
  DriverInsuranceRegistration: undefined;
  DriverPaymentRegistration: {isEditPaymentMethod: boolean} | undefined;
  DriverProfileEvaluationDetails: {
    driverID: number;
    evaluationAvg: DriverEvaluationAverageModel | undefined;
  };
  DriverFavoriteRegistration: {isDriverRoute?: boolean} | undefined;
  PaymentRegistration: {isCarpoolPayment: boolean} | undefined;
  RecommendDriverList: undefined;
  PaymentCompletionPage: undefined;
  Evaluation: {driverID: number; resId: number};
  ChatList: undefined;
  DriverProfileCarInformation: {carInfomation: CarDriverModel};
  WayToWorkRegistration1:
    | {
        isReturnRoute?: boolean;
        previousRoute?: RoadUpdateProps;
        dataOldRoute?: MyDriverModel;
        hidePrice?: boolean;
      }
    | undefined;
  WayToWorkRegistration2: {
    isReturnRoute?: boolean;
    textSearchFromValue?: string;
    textSearchToValue?: string;
    dataOldRoute?: MyDriverModel;
    hidePrice?: boolean;
    dataFill?: {
      to: AddressKakaoProps;
      from: AddressKakaoProps;
      timeStart: string;
      introduce: string;
    };
    isEditMyWork?: boolean;
    focusTo?: boolean;
  };
  PopupNewSearch: {
    isReturnRoute?: boolean;
    textSearchFromValue?: string;
    textSearchToValue?: string;
    dataOldRoute?: MyDriverModel;
    hidePrice?: boolean;
    dataFill?: {
      to: AddressKakaoProps;
      from: AddressKakaoProps;
      timeStart: string;
      introduce: string;
    };
    isEditMyWork?: boolean;
    focusTo?: boolean;
    text?: string; // 추가된 부분
  };

  WayToWorkRegistration4: {
    address?: {to?: AddressKakaoProps; from?: AddressKakaoProps; isChooseFrom: boolean};
    data: AddressKakaoProps;
    func: (data: AddressKakaoProps) => void;
    isGoTo?: boolean;
    isToStop?: boolean;
    dataDriver?: {
      address?: {
        from?: AddressKakaoProps;
        stop?: AddressKakaoProps;
        to?: AddressKakaoProps;
        isChooseFrom: boolean;
        isChooseStop: boolean;
      };
    };
  };
  WayToWorkRegistration5: {
    searchTo?: AddressKakaoProps;
    searchFrom?: AddressKakaoProps;
    previousRoute?: RoadUpdateProps;
    isRoadOut?: boolean;
    dataEdit?: MyDriverModel;
    dataOldRoute?: MyDriverModel;
    hidePrice?: boolean;
    isEdit?: boolean;
    dataInfo?: {timeStart: string; introduce: string};
    isEditMyWork?: boolean;
  };
  ChatDetail: {currentChatRoomInfo: ChatRoomModel; isPassengerBusinessCard?: boolean};
  RegisterInquiry: undefined;
  RegistrationDetail: undefined;
  CancelReservation: undefined;
  DriverWaitingApproved: undefined;
  DriverRejectApproval: undefined;
  DriverCompleteApproval: undefined;
  DriverCommunicationRegistration: {isPassenger: boolean};
  ReservationEndCarpool: {isPassenger: boolean};
  DriverWayToWork1:
    | {
        isReturnRoute?: boolean;
        previousRoute?: RoadInDriverUpdateProps;
        dataOldRoute?: MyDriverModel;
        isRoadPassenger?: boolean;
        addressStop?: AddressKakaoProps | undefined;
        selectedDate?: string;
        isDailyRegistration?: boolean;
        isNewRoute?: boolean;
      }
    | undefined;
  DriverWayToWork2:
    | {
        isReturnRoute?: boolean;
        dataOldRoute?: MyDriverModel;
        selectedDate?: string;
        isDailyRegistration?: boolean;
        isEditMyRoute?: boolean;
        isPassengerRoad?: boolean;
        hasAddressStop?: boolean;
        dataFill?: {
          to: AddressKakaoProps;
          stop?: AddressKakaoProps;
          from: AddressKakaoProps;
          timeStart: string;
          introduce: string;
        };
      }
    | undefined;

  DriverWayToWork4: {
    searchTo?: AddressKakaoProps;
    searchStop?: AddressKakaoProps | undefined;
    hasAddressStop?: boolean;
    searchFrom?: AddressKakaoProps;
    previousRoute?: RoadInDriverUpdateProps;
    isRoadOut?: boolean;
    dataEdit?: MyDriverModel;
    dataOldRoute?: MyDriverModel;
    selectedDate?: string;
    isDailyRegistration?: boolean;
    isEditMyRoute?: boolean;
  };

  DriveMeHome: undefined;
  RouteHistoryDriver: {
    driverName: string;
    driverID: number;
  };
  RouteHistoryPassenger: {
    passengerName: string;
    passengerID: number;
  };
  BlockUser: undefined;
  MyWorkRoute: {
    isPassenger: boolean;
  };
  CarpoolRequest: undefined;
  CarpoolRequestPark: undefined;
  GeneralCarPoolRouteRegistration: undefined;
  CarPoolRouteChoice: {
    route: RouteRegisterModel;
    routeInRegistered?: RoadInDriverUpdateProps;
  };
  CarPoolWayToWorkRegistration: {
    route: RouteRegisterModel;
    onReturn?: (value: number, desiredAmount: number) => void;
  };
  CarPoolRouteRegistration: undefined;
  VehicleManagement: undefined;
  Notice: undefined;
  NoticeDetail: {item: ValetMainNoticeProps};
  Setting: undefined;
  ProfileManagement: undefined;
  ProfileManagementOld: undefined;
  PenaltyPolicy: undefined;
  ContactUs: undefined;
  ReportPassStep1: {
    passengerID: number;
    passengerName: string;
    routeID: number;
  };
  ReportPassStep2: {reportType: REPORT_TYPE; passengerID: number; routeID: number};
  InsuranceClaimNumber: undefined;
  ReportDriverStep1: {
    driverID: number;
    driverName: string;
    routeID: number;
  };
  ReportDriverStep2: {reportType: REPORT_TYPE; driverID: number; routeID: number};
  WaitingRoute: {route: CarpoolPayHistoryModel};
  Favorites: undefined;
  Running: {
    item: CarpoolPayHistoryModel;
  };
  CarPoolRouteRealtime: undefined;
  OperationDetails: {
    driverName: string;
    data: CarpoolPayHistoryModel[];
  };
  CustomerServiceDetails: undefined;
  PassengerProfile: {
    passengerID: number | undefined;
    passengerName: string | undefined;
  };
  DriverProfile: {driverID: number; driverName: string};
  CarpoolCalendar: undefined;
  DriverRunning: {item: CarpoolPayHistoryModel};
  MyRoutes: undefined;
  BusinessCardAndVaccineCertification: undefined;
  CardRegistration: {
    functionReservation?: () => void;
    listCards?: CreditCardProps[];
  };
  DetailContentCarpool: {
    item: CarpoolPayHistoryModel;
    type: 'DRIVER_HISTORY' | 'PASSENGER_HISTORY';
  };
  TermsAndPolicies: undefined;
  EditPhoneNumber: undefined;
  MyRoute: undefined;
  CarpoolRequestQNA: {mode: 'DRIVER' | 'PASSENGER'};
  RouteRequestRegistrationDetail: {
    routeInfo: DriverRoadDayModel | undefined;
    viewMode?: boolean;
  };
  PassengerDailyRouteRegistration: undefined;
  PaymentNotice: undefined;
  DriverHome: undefined;
  CardTermsAndConditions: undefined;
  RecentSearchLocation: undefined;
  RecentSearchLocationMain: undefined;
  CarpoolRequestDetail: {
    item: DriverRoadDayModel;
  };
  RepresentativeRouteOfPassenger: {
    passengerID: number;
  };
  RepresentativeRouteOfDriver: {
    driverID: number;
  };
  CarpoolModeSelect: undefined;
  AccountSettlement: undefined;
  AccountSettlementDetails: {item: SettlementModel};
  FullListSettlement: undefined;
  ScheduledSettlementDetails: undefined;
  CancelRoutePaymentConfirmation: {
    routeInfo: CarpoolPayHistoryModel;
    percentFined: number;
    type: 'DRIVER_HISTORY' | 'PASSENGER_HISTORY';
    onCancelSuccess?: () => void;
    endTime?: string;
  };
  DriverChangeRoutePrice: {
    routeRequestInfo?: RequestInfoModel;
    tempRoute?: DriverRoadDayModel;
    onChangeNewPrice?: (newPrice: number) => void;
    endTime?: string;
    roadInfoID: number;
  };
};

export type RootStackScreens = keyof RootStackScreensParams;

export type RootStackScreenProps<T extends keyof RootStackScreensParams> = NativeStackScreenProps<
  RootStackScreensParams,
  T
>;

export type UseRootStackNavigation<T extends keyof RootStackScreensParams = 'Splash'> =
  NativeStackNavigationProp<RootStackScreensParams, T>;

const {Navigator, Screen} = createStackNavigator<RootStackScreensParams>();

const Stack = () => {
  const [firstLaunchApp, setFirstLaunchApp] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  // check first time launch app
  const controlStorage = async () => {
    if (await AsyncStorage.getItem('FIRST_LAUNCH')) {
      AsyncStorage.setItem('FIRST_LAUNCH', 'false');
    }
    setFirstLaunchApp(false);
  };

  // clear id chat room in first time launch app
  useEffect(() => {
    if (firstLaunchApp) {
      dispatch(clearChatReducer());
    }
    controlStorage();
  }, []);

  // App state - clear id chat room in background
  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', nextAppState => {
      if (nextAppState !== 'active') {
        dispatch(clearChatReducer());
      }
    });

    return () => {
      appStateListener.remove();
    };
  }, []);

  // tracking screen
  const trackingScreen = (e: any) => {
    if (e?.data?.state?.routes?.length) {
      const isLastScreen = e.data?.state?.routes?.length - 1;
      const currentScreen = e?.data?.state?.routes[isLastScreen]?.name;

      dispatch(updateCurrentScreen(currentScreen));
    }
  };

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
      screenListeners={{
        state: trackingScreen,
      }}>
      <Screen name={ROUTE_KEY.Splash} component={Splash} />
      <Screen name={ROUTE_KEY.TutorialSlider} component={TutorialSlider} />
      <Screen name={ROUTE_KEY.TestScreen} component={TestScreen} />
      <Screen name={ROUTE_KEY.ParkingParkHome} component={BottomTab} />
      <Screen
        name={ROUTE_KEY.ParkingDetails}
        component={ParkingDetails}
        options={{gestureEnabled: false}}
      />
      <Screen name={ROUTE_KEY.Login} component={Login} />
      <Screen name={ROUTE_KEY.RequestEditParking} component={RequestEditParking} />
      <Screen name={ROUTE_KEY.CreateReview} component={CreateReview} />
      <Screen name={ROUTE_KEY.PermissionActivity} component={PermissionActivity} />
      <Screen name={ROUTE_KEY.ValetInfo} component={ValetInfo} />
      <Screen name={ROUTE_KEY.EditUserInfo} component={EditUserInfo} />
      <Screen name={ROUTE_KEY.EditUserInfoOld} component={EditUserInfoOld} />
      <Screen name={ROUTE_KEY.Register} component={Register} />
      <Screen name={ROUTE_KEY.VerifyPhoneNumber} component={VerifyPhoneNumber} />
      <Screen name={ROUTE_KEY.Event} component={Event} />
      <Screen name={ROUTE_KEY.PaymentInfomation} component={PaymentInfomation} />
      <Screen name={ROUTE_KEY.ChangePassword} component={ChangePassword} />
      <Screen name={ROUTE_KEY.FindPassword} component={FindPassword} />
      <Screen name={ROUTE_KEY.ReplyReview} component={ReplyReview} />
      <Screen name={ROUTE_KEY.ParkingInfoSharing} component={ParkingInfoSharing} />
      <Screen name={ROUTE_KEY.CreateBBS} component={CreateBBS} />
      <Screen name={ROUTE_KEY.MonthlyParkingDirectMain} component={MonthlyParkingDirectMain} />
      <Screen
        name={ROUTE_KEY.MonthlyParkingDirectRegistration}
        component={MonthlyParkingDirectRegistration}
      />
      <Screen name={ROUTE_KEY.MonthlyParkingDirectList} component={MonthlyParkingDirectList} />
      <Screen name={ROUTE_KEY.ParkingAlarmMenu} component={ParkingAlarmMenu} />
      <Screen
        name={ROUTE_KEY.MonthlyParkingDirectDetails}
        component={MonthlyParkingDirectDetails}
      />
      <Screen name={ROUTE_KEY.MonthlyParkingDirectMap} component={MonthlyParkingDirectMap} />
      <Screen name={ROUTE_KEY.ListOfParkingLots} component={ListOfParkingLots} />
      <Screen name={ROUTE_KEY.TakePhotoParkingLot} component={TakePhotoParkingLot} />
      <Screen name={ROUTE_KEY.ChargeManagement} component={ChargeManagement} />
      <Screen name={ROUTE_KEY.PointManagement} component={PointManagement} />
      <Screen name={ROUTE_KEY.DepositMoney} component={DepositMoney} />
      <Screen name={ROUTE_KEY.UsageHistory} component={UsageHistory} />
      <Screen name={ROUTE_KEY.UsageHistoryOld} component={UsageHistoryOld} />
      <Screen name={ROUTE_KEY.ParkingRequestNoticeBoard} component={ParkingRequestNoticeBoard} />
      <Screen name={ROUTE_KEY.ParkingRequestNoticeAdd} component={ParkingRequestNoticeAdd} />
      <Screen
        name={ROUTE_KEY.ParkingRequestNoticeOffline}
        component={ParkingRequestNoticeOffline}
      />
      <Screen name={ROUTE_KEY.FAQ} component={FAQ} />
      <Screen
        name={ROUTE_KEY.ParkingRequestNoticeBoardDetail}
        component={ParkingRequestNoticeBoardDetail}
      />
      <Screen name={ROUTE_KEY.CouponBox} component={CouponBox} />
      <Screen name={ROUTE_KEY.ReservationDetail} component={ReservationDetail} />
      <Screen name={ROUTE_KEY.PointManagementNew} component={PointManagementNew} />
      <Screen name={ROUTE_KEY.Reservation} component={Reservation} />
      <Screen name={ROUTE_KEY.ParkingPaymentReceipt} component={ParkingPaymentReceipt} />
      <Screen name={ROUTE_KEY.ValetParkingAtIncheon} component={ValetParkingAtIncheon} />
      <Screen
        name={ROUTE_KEY.DirectIndoorParkingAtIncheon}
        component={DirectIndoorParkingAtIncheon}
      />
      <Screen
        name={ROUTE_KEY.DirectIndoorParkingAtGimpo as any}
        component={DirectIndoorParkingAtGimpo}
      />
      <Screen name={ROUTE_KEY.VehicleNumber} component={VehicleNumber} />
      <Screen name={ROUTE_KEY.VehicleNumberManagement} component={VehicleNumberManagement} />
      <Screen name={ROUTE_KEY.VehicleNumberAdd} component={VehicleNumberAdd} />
      <Screen name={ROUTE_KEY.ValetParkingDetail} component={ValetParkingDetail} />
      <Screen name={ROUTE_KEY.ValetMainNotice} component={ValetMainNotice} />
      <Screen name={ROUTE_KEY.ValetMainNoticeDetail} component={ValetMainNoticeDetail} />
      <Screen name={ROUTE_KEY.ValetMainNoticeCreate} component={ValetMainNoticeCreate} />
      <Screen name={ROUTE_KEY.ValetParkingReservation1} component={ValetParkingReservation1} />
      <Screen name={ROUTE_KEY.ValetParkingReservation2} component={ValetParkingReservation2} />
      <Screen name={ROUTE_KEY.ValetParkingReservation3} component={ValetParkingReservation3} />
      <Screen name={ROUTE_KEY.ValetParkingReservation4} component={ValetParkingReservation4} />
      <Screen
        name={ROUTE_KEY.ValetNobelParkingReservation1}
        component={ValetNobelParkingReservation1}
      />
      <Screen
        name={ROUTE_KEY.ValetNobelParkingReservation2}
        component={ValetNobelParkingReservation2}
      />
      <Screen
        name={ROUTE_KEY.ValetNobelParkingReservation3}
        component={ValetNobelParkingReservation3}
      />
      <Screen
        name={ROUTE_KEY.ValetNobelParkingReservation4}
        component={ValetNobelParkingReservation4}
      />
      <Screen name={ROUTE_KEY.ValetParkingSelfDetail} component={ValetParkingSelfDetail} />
      <Screen
        name={ROUTE_KEY.ValetParkingSelfReservation1}
        component={ValetParkingSelfReservation1}
      />
      <Screen
        name={ROUTE_KEY.ValetParkingSelfReservation2}
        component={ValetParkingSelfReservation2}
      />
      <Screen
        name={ROUTE_KEY.ValetParkingSelfReservation3}
        component={ValetParkingSelfReservation3}
      />
      <Screen
        name={ROUTE_KEY.ValetParkingSelfReservation4}
        component={ValetParkingSelfReservation4}
      />
      <Screen name={ROUTE_KEY.ParkingLotConnection} component={ParkingLotConnection} />
      <Screen name={ROUTE_KEY.SettingPassengerActivity} component={SettingPassengerActivity} />
      <Screen name={ROUTE_KEY.ValetQnaBbsList} component={ValetQnaBbsList} />
      <Screen name={ROUTE_KEY.ValetQnaBbsDetail} component={ValetQnaBbsDetail} />
      <Screen name={ROUTE_KEY.ValetQnaBbsCreate} component={ValetQnaBbsCreate} />
      <Screen name={ROUTE_KEY.ValetPaymentHistoryAdmin} component={ValetPaymentHistoryAdmin} />
      <Screen
        name={ROUTE_KEY.ValetParkingAdminReservation1}
        component={ValetParkingAdminReservation1}
      />
      <Screen
        name={ROUTE_KEY.ValetParkingAdminReservation2}
        component={ValetParkingAdminReservation2}
      />
      <Screen
        name={ROUTE_KEY.ValetParkingAdminReservation3}
        component={ValetParkingAdminReservation3}
      />
      <Screen name={ROUTE_KEY.ValetParkingImageDetail} component={ValetParkingImageDetail} />
      <Screen name={ROUTE_KEY.ParkingTicketAuto} component={ParkingTicketAuto} />
      <Screen name={ROUTE_KEY.ParkingTicketAutoDetail} component={ParkingTicketAutoDetail} />
      <Screen name={ROUTE_KEY.CarSetting} component={CarSetting} />
      <Screen
        name={ROUTE_KEY.RegisterCarInsuranceInformation}
        component={RegisterCarInsuranceInformation}
      />
      <Screen name={ROUTE_KEY.ActivitySettingLicense} component={ActivitySettingLicense} />
      <Screen name={ROUTE_KEY.ActivityCheckPnum} component={ActivityCheckPnum} />
      <Screen name={ROUTE_KEY.DiverAgreeActivity} component={DiverAgreeActivity} />
      <Screen name={ROUTE_KEY.CarpoolInsuranceRider} component={CarpoolInsuranceRider} />
      <Screen name={ROUTE_KEY.CarpoolPrivacyDetail} component={CarpoolPrivacyDetail} />
      <Screen name={ROUTE_KEY.CarpoolLocationDetail} component={CarpoolLocationDetail} />
      <Screen name={ROUTE_KEY.CarpoolTermsDetail} component={CarpoolTermsDetail} />
      <Screen name={ROUTE_KEY.ReservationSimplePay} component={ReservationSimplePay} />
      <Screen name={ROUTE_KEY.RegisterParkingShared} component={RegisterParkingShared} />
      <Screen name={ROUTE_KEY.BBSNoticeDetail} component={BBSNoticeDetail} />
      <Screen
        name={ROUTE_KEY.RegisterParkingSharedDetail}
        component={RegisterParkingSharedDetail}
      />
      <Screen
        name={ROUTE_KEY.RegisterParkingSharedImageDetail}
        component={RegisterParkingSharedImageDetail}
      />
      <Screen name={ROUTE_KEY.ReservationSimple} component={ReservationSimple} />
      <Screen
        name={ROUTE_KEY.ParkingRequestNoticeImageDetail}
        component={ParkingRequestNoticeImageDetail}
      />
      <Screen name={ROUTE_KEY.AirportParking} component={AirportParking} />
      <Screen name={ROUTE_KEY.AirportParking2} component={AirportParking2} />
      <Screen name={ROUTE_KEY.HotPlace} component={HotPlace} />
      <Screen name={ROUTE_KEY.HotPlaceNew} component={HotPlaceNew} />
      <Screen name={ROUTE_KEY.EventBanner} component={EventBanner} />
      <Screen name={ROUTE_KEY.EventGame} component={EventGame} />
      <Screen name={ROUTE_KEY.EvalList} component={EvalList} />
      <Screen name={ROUTE_KEY.ConfirmDepositMoney} component={ConfirmDepositMoney} />
      <Screen name={ROUTE_KEY.ServiceTermsAndConditions} component={ServiceTermsAndConditions} />
      <Screen name={ROUTE_KEY.TermsAndConditions} component={TermsAndConditions} />
      <Screen name={ROUTE_KEY.PrivacyPolicy} component={PrivacyPolicy} />
      <Screen name={ROUTE_KEY.LocationBasedTermsOfUse} component={LocationBasedTermsOfUse} />
      <Screen name={ROUTE_KEY.AgreeToSubscribeToCarpool} component={AgreeToSubscribeToCarpool} />
      <Screen name={ROUTE_KEY.PassengerHome} component={PassengerHome} />
      <Screen
        options={{gestureEnabled: false}}
        name={ROUTE_KEY.BusinessCardAndVaccineRegistration}
        component={BusinessCardAndVaccineRegistration}
      />
      <Screen
        name={ROUTE_KEY.CarpoolRequestRegistrationList}
        component={CarpoolRequestRegistrationList}
      />
      {/* DRIVER REGISTRATION */}
      <Screen name={ROUTE_KEY.DriverRegister} component={DriverRegister} />
      <Screen name={ROUTE_KEY.VehicleRegistration} component={VehicleRegistration} />
      <Screen name={ROUTE_KEY.CarPhotoRegistration} component={CarPhotoRegistration} />
      <Screen
        name={ROUTE_KEY.DriverLicenseRegistration}
        component={DriverLicenseRegistration}
        options={{gestureEnabled: false}}
      />
      <Screen
        name={ROUTE_KEY.DriverInsuranceRegistration}
        component={DriverInsuranceRegistration}
        options={{gestureEnabled: false}}
      />
      <Screen
        name={ROUTE_KEY.DriverPaymentRegistration}
        component={DriverPaymentRegistration}
        options={{gestureEnabled: false}}
      />
      <Screen name={ROUTE_KEY.CarNumberManagement} component={CarNumberManagement} />
      <Screen name={ROUTE_KEY.DriverWaitingApproved} component={DriverWaitingApproved} />
      <Screen name={ROUTE_KEY.DriverRejectApproval} component={DriverRejectApproval} />
      <Screen name={ROUTE_KEY.DriverCompleteApproval} component={DriverCompleteApproval} />
      <Screen
        name={ROUTE_KEY.DriverCommunicationRegistration}
        component={DriverCommunicationRegistration}
      />
      <Screen name={ROUTE_KEY.ReservationEndCarpool} component={ReservationEndCarpool} />
      {/*  */}
      {/* DRIVER COMMUNICATE */}
      <Screen name={ROUTE_KEY.DriverWayToWork1} component={DriverWayToWork1} />
      <Screen name={ROUTE_KEY.DriverWayToWork2} component={DriverWayToWork2} />
      <Screen name={ROUTE_KEY.DriverWayToWork4} component={DriverWayToWork4} />
      {/*  */}
      <Screen
        name={ROUTE_KEY.DriverProfileEvaluationDetails}
        component={DriverProfileEvaluationDetails}
      />
      <Screen name={ROUTE_KEY.DriverFavoriteRegistration} component={DriverFavoriteRegistration} />
      <Screen name={ROUTE_KEY.PaymentRegistration} component={PaymentRegistration} />
      <Screen name={ROUTE_KEY.RecommendDriverList} component={RecommendDriverList} />
      <Screen name={ROUTE_KEY.PaymentCompletionPage} component={PaymentCompletionPage} />
      <Screen name={ROUTE_KEY.Evaluation} component={Evaluation} />
      <Screen name={ROUTE_KEY.ChatList} component={ChatList} />
      <Screen
        name={ROUTE_KEY.DriverProfileCarInformation}
        component={DriverProfileCarInformation}
      />
      <Screen name={ROUTE_KEY.WayToWorkRegistration1} component={WayToWorkRegistration1} />
      <Screen name={ROUTE_KEY.WayToWorkRegistration2} component={WayToWorkRegistration2} />
      <Screen name={ROUTE_KEY.PopupNewSearch} component={PopupNewSearch} />
      <Screen
        options={{gestureEnabled: false}}
        name={ROUTE_KEY.WayToWorkRegistration4}
        component={WayToWorkRegistration4}
      />
      <Screen
        options={{gestureEnabled: false}}
        name={ROUTE_KEY.WayToWorkRegistration5}
        component={WayToWorkRegistration5}
      />
      <Screen name={ROUTE_KEY.ChatDetail} component={ChatDetail} />
      <Screen name={ROUTE_KEY.RegisterInquiry} component={RegisterInquiry} />
      <Screen name={ROUTE_KEY.RegistrationDetail} component={RegistrationDetail} />
      <Screen name={ROUTE_KEY.DriverHome} component={DriverHome} />
      <Screen name={ROUTE_KEY.RouteHistoryDriver} component={RouteHistoryDriver} />
      <Screen name={ROUTE_KEY.RouteHistoryPassenger} component={RouteHistoryPassenger} />
      <Screen name={ROUTE_KEY.BlockUser} component={BlockUser} />
      <Screen
        options={{gestureEnabled: false}}
        name={ROUTE_KEY.MyWorkRoute}
        component={MyWorkRoute}
      />
      {/* CAR POOL DRIVER */}
      <Screen name={ROUTE_KEY.CarpoolRequest} component={CarpoolRequest} />
      <Screen name={ROUTE_KEY.CarpoolRequestPark} component={CarpoolRequestPark} />
      <Screen
        name={ROUTE_KEY.GeneralCarPoolRouteRegistration}
        component={GeneralCarPoolRouteRegistration}
      />
      <Screen name={ROUTE_KEY.CarPoolRouteChoice} component={CarPoolRouteChoice} />
      <Screen
        name={ROUTE_KEY.CarPoolWayToWorkRegistration}
        component={CarPoolWayToWorkRegistration}
      />
      <Screen name={ROUTE_KEY.CarPoolRouteRegistration} component={CarPoolRouteRegistration} />
      <Screen name={ROUTE_KEY.CarPoolRouteRealtime} component={CarPoolRouteRealtime} />
      <Screen name={ROUTE_KEY.VehicleManagement} component={VehicleManagement} />
      <Screen name={ROUTE_KEY.Notice} component={Notice} />
      <Screen name={ROUTE_KEY.NoticeDetail} component={NoticeDetail} />
      <Screen name={ROUTE_KEY.Setting} component={Setting} />
      <Screen name={ROUTE_KEY.ProfileManagement} component={ProfileManagement} />
      <Screen name={ROUTE_KEY.ProfileManagementOld} component={ProfileManagementOld} />
      <Screen name={ROUTE_KEY.PenaltyPolicy} component={PenaltyPolicy} />
      <Screen name={ROUTE_KEY.ContactUs} component={ContactUs} />
      <Screen name={ROUTE_KEY.ReportPassStep1} component={ReportPassStep1} />
      <Screen name={ROUTE_KEY.ReportPassStep2} component={ReportPassStep2} />
      <Screen name={ROUTE_KEY.InsuranceClaimNumber} component={InsuranceClaimNumber} />
      <Screen name={ROUTE_KEY.ReportDriverStep1} component={ReportDriverStep1} />
      <Screen name={ROUTE_KEY.ReportDriverStep2} component={ReportDriverStep2} />
      <Screen name={ROUTE_KEY.WaitingRoute} component={WaitingRoute} />
      <Screen name={ROUTE_KEY.Favorites} component={Favorites} />
      <Screen name={ROUTE_KEY.Running} component={Running} />
      <Screen name={ROUTE_KEY.OperationDetails} component={OperationDetails} />
      <Screen name={ROUTE_KEY.CustomerServiceDetails} component={CustomerServiceDetails} />
      <Screen name={ROUTE_KEY.PassengerProfile} component={PassengerProfile} />
      <Screen name={ROUTE_KEY.DriverProfile} component={DriverProfile} />
      <Screen name={ROUTE_KEY.CarpoolCalendar} component={CarpoolCalendar} />
      <Screen name={ROUTE_KEY.DriverRunning} component={DriverRunning} />
      <Screen name={ROUTE_KEY.MyRoutes} component={MyRoutes} />
      <Screen
        name={ROUTE_KEY.BusinessCardAndVaccineCertification}
        component={BusinessCardAndVaccineCertification}
      />
      <Screen name={ROUTE_KEY.CardRegistration} component={CardRegistration} />
      <Screen name={ROUTE_KEY.DetailContentCarpool} component={DetailContentCarpool} />
      <Screen name={ROUTE_KEY.TermsAndPolicies} component={TermsAndPolicies} />
      <Screen name={ROUTE_KEY.EditPhoneNumber} component={EditPhoneNumber} />
      <Screen name={ROUTE_KEY.MyRoute} component={MyRoute} />
      <Screen name={ROUTE_KEY.CarpoolRequestQNA} component={CarpoolRequestQNA} />
      <Screen
        name={ROUTE_KEY.RouteRequestRegistrationDetail}
        component={RouteRequestRegistrationDetail}
      />
      <Screen
        name={ROUTE_KEY.PassengerDailyRouteRegistration}
        component={PassengerDailyRouteRegistration}
      />
      <Screen name={ROUTE_KEY.PaymentNotice} component={PaymentNotice} />
      <Screen name={ROUTE_KEY.CardTermsAndConditions} component={CardTermsAndConditions} />
      <Screen name={ROUTE_KEY.RecentSearchLocation} component={RecentSearchLocation} />
      <Screen name={ROUTE_KEY.RecentSearchLocationMain} component={RecentSearchLocationMain} />
      <Screen name={ROUTE_KEY.CarpoolRequestDetail} component={CarpoolRequestDetail} />
      <Screen
        name={ROUTE_KEY.RepresentativeRouteOfPassenger}
        component={RepresentativeRouteOfPassenger}
      />
      <Screen
        name={ROUTE_KEY.RepresentativeRouteOfDriver}
        component={RepresentativeRouteOfDriver}
      />
      <Screen name={ROUTE_KEY.CarpoolModeSelect} component={CarpoolModeSelect} />
      <Screen name={ROUTE_KEY.AccountSettlement} component={AccountSettlement} />
      <Screen name={ROUTE_KEY.AccountSettlementDetails} component={AccountSettlementDetails} />
      <Screen name={ROUTE_KEY.FullListSettlement} component={FullListSettlement} />
      <Screen name={ROUTE_KEY.ScheduledSettlementDetails} component={ScheduledSettlementDetails} />
      <Screen
        name={ROUTE_KEY.CancelRoutePaymentConfirmation}
        component={CancelRoutePaymentConfirmation}
      />
      <Screen name={ROUTE_KEY.DriverChangeRoutePrice} component={DriverChangeRoutePrice} />
    </Navigator>
  );
};

export default Stack;
