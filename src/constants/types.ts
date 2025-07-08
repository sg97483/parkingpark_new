import type {MarkerImageProp} from '@mj-studio/react-native-naver-map';
import {GENDER, IS_ACTIVE, PARKING_FILTER_TYPE} from './enum';
import React from 'react';

export interface UserProps {
  id: number;
  photoId: string;
  memberId: number;
  pwd: string;
  modifyPwd: number;
  nic: string;
  email: string;
  age: number;
  mpoint: string;
  cardName: string;
  carNumber: string;
  usePointSum: string;
  cancelPoint: string;
  usePointSumSklent: string;
  cancelPointSklent: string;
  pnum: string;
  agreeMarketingMailYN: IS_ACTIVE;
  agreeMarketingSmsYN: IS_ACTIVE;
  agreeHappyCallYN: IS_ACTIVE;
  location: string;
  weatherCode: number;
  gender: GENDER;
  adminYN: IS_ACTIVE;
  adminValetParkingId: string;
  carModel: string;
  carColor: string;
  carYear: string;
  carCompany: string;
  partnerCarList: string;
  valetDemand: IS_ACTIVE;
  regdate: number;
  deviceId: string;
  deviceOs: string;
  usimNum: string;
  serial: string;
  deviceToken: string;
  ip: string;
  socialLoginType: string;
  memberKey: string;
  snsId: string;
  chargeMoney: string;
  recomCode: string;
  parkingLotId: string;
  eval1: string;
  jointext: string;
  phonetext: string;
  giveMoneyYN: IS_ACTIVE;
  recomYN: IS_ACTIVE;
  r_point: string;
  pid: string;
  inCarCheck: string;
  actualInDtm: string;
  actualOutDtm: string;
  garageIP: string;
  parkId: string;
  lprYN: string;
}

export interface ParkingProps {
  id: number;
  holidayYN: IS_ACTIVE;
  availablePlace: number;
  holidayTicketTimeStart: string;
  sixTicketCostFour: number;
  OnedayTicketTimeEnd: string;
  MonthTicketTimeEnd: string;
  ticketPartnerYN: IS_ACTIVE;
  branch: string;
  sunEnd: number;
  disabledYN: IS_ACTIVE;
  weekStart: number;
  threeTimeTicketCost: number;
  WeekTicketTimeEnd: string;
  buyFree50000YN: IS_ACTIVE;
  buyFree20000YN: IS_ACTIVE;
  state: string;
  holidayTicketTimeEnd: string;
  brand: string;
  satSunCost: number;
  monthDay: number;
  monthNight: number;
  businesStart: number;
  businesEnd: number;
  menuAmericano: number;
  menuCafemoca: number;
  menuCaferatte: number;
  menuCafuchino: number;
  menuEspresso: number;
  menu1n: string;
  menu2n: string;
  menu3n: string;
  menu4n: string;
  menu5n: string;
  menu1v: number;
  menu2v: number;
  menu3v: number;
  menu4v: number;
  menu5v: number;
  SixTicketCostOneTimeStart: string;
  monthYN: IS_ACTIVE;
  SixTicketCostTwoTimeEnd: string;
  pnum: string;
  saturEnd: number;
  lng: number;
  sevenTicketTimeStart: string;
  lprYN: IS_ACTIVE;
  garageName: string;
  nightTicketCost: number;
  free7AfterYN: IS_ACTIVE;
  valetFourTicketCost: number;
  buyFree1HourYN: IS_ACTIVE;
  friSatSunCost: number;
  satSunCostText: string;
  friSatCost: number;
  weaCode: string;
  monthTicketCost: number;
  SixTicketCostThreeTimeEnd: string;
  storeNum3: string;
  storeNum1: string;
  storeNum2: string;
  holidayStart: number;
  weekCost: number;
  holidayEnd: number;
  weekCostText: string;
  city: string;
  addressDesc: string;
  icon: number;
  chargeOneDay: number;
  satFreeYN: IS_ACTIVE;
  holiday: string;
  sixTicketCostThree: number;
  sixTicketCostOne: number;
  buyFree70000YN: IS_ACTIVE;
  NightTicketTimeEnd: string;
  free7AfterCondition: string;
  weekEnd: number;
  friSatCostText: string;
  SixTicketCostOneTimeEnd: string;
  buyFree3HourYN: IS_ACTIVE;
  WeekOnedayTicketTimeEnd: string;
  storeName3: string;
  holidayFreeYN: IS_ACTIVE;
  storeName2: string;
  storeName1: string;
  image5: string;
  saturStart: number;
  image3: string;
  a1TicketCost: number;
  charge: number;
  image4: string;
  A2TicketTimeStart: string;
  agency: string;
  A2TicketTimeEnd: string;
  SixTicketCostFourTimeStart: string;
  first30: number;
  sixTicketCostTwo: number;
  garageIP: string;
  image1: string;
  image2: string;
  valetThreeTicketCost: number;
  buyFreeYN: IS_ACTIVE;
  receiptFreeYN: IS_ACTIVE;
  releyparking: IS_ACTIVE;
  week7AfterYN: IS_ACTIVE;
  MTicketTimeEnd: string;
  addressOld: string;
  SixTicketCostThreeTimeStart: string;
  sevenTicketTimeEnd: string;
  buyFree2HourYN: IS_ACTIVE;
  rating: string;
  eightTicketCost: number;
  NightTicketTimeStart: string;
  sunFreeYN: IS_ACTIVE;
  buyFree100000YN: IS_ACTIVE;
  tempAddress: string;
  etc: string;
  a2TicketCost: number;
  weekOnedayTicketCost: number;
  SixTicketCostTwoTimeStart: string;
  keyword: string;
  lat: number;
  others: string;
  free30YN: IS_ACTIVE;
  autoCost: number;
  dayNameGubun: string;
  eightTicketTimeEnd: string;
  limitedNumber: number;
  sunStart: number;
  creditCardYN: IS_ACTIVE;
  chargeAfter: number;
  fourTimeTicketCost: number;
  twoTimeTicketCost: number;
  eveTicketTimeEnd: string;
  eveTicketTimeStart: string;
  SixTicketCostFourTimeEnd: string;
  MonthTicketTimeStart: string;
  eightTicketTimeStart: string;
  weekTicketCost: number;
  sevenTicketCost: number;
  WeekOnedayTicketTimeStart: string;
  valetOneTicketCost: number;
  holidayTicketCost: number;
  description: string;
  eveTicketCost: number;
  monthOneDay: number;
  operatingTime: string;
  storeMoney3: string;
  buyFree40000YN: IS_ACTIVE;
  storeMoney2: string;
  storeMoney1: string;
  smsText: string;
  A1TicketTimeStart: string;
  residentYN: IS_ACTIVE;
  issue_text: string;
  descUrl: string;
  department: string;
  MTicketTimeStart: string;
  addressNew: string;
  wifiYN: IS_ACTIVE;
  buyFree30000YN: IS_ACTIVE;
  themeParking: string;
  A1TicketTimeEnd: string;
  friSatSunCostText: string;
  charge30m: number;
  OnedayTicketTimeStart: string;
  mTicketCost: number;
  themeParkingYN: string;
  valetTwoTicketCost: number;
  onedayTicketCost: number;
  WeekTicketTimeStart: string;
  category: string;
  nightCharge: number;
  valetCharge10day: number;
  valetCharge11day: number;
  valetCharge12day: number;
  valetCharge1day: number;
  valetCharge2day: number;
  valetCharge3day: number;
  valetCharge4day: number;
  valetCharge5day: number;
  valetCharge6day: number;
  valetCharge7day: number;
  valetCharge8day: number;
  valetCharge9day: number;
}

export interface ParkingEvalProps {
  carNumber: string;
  eval: string;
  gender: GENDER;
  avgCount: number;
  avgCount2: number;
  regdate: number;
  parkingLotId: number;
  id: number;
  text: string;
  memberNic: string;
  memberId: number;
  likeCount: number;
  replyCount: number;
  isReview?: boolean;
  parkingLotName: string;
  parkingLotAddr: string;
  subject: string;
  state: string;
  city: string;
  photoId: number;
  memberPhotoId: number;
}

export interface CordinateProps {
  lat: number;
  long: number;
}

export interface ParkingMapProps {
  appVersion: number;
  id: number;
  category: string;
  brand: string;
  themeParking: string;
  lat: number;
  lng: number;
  coslat: number;
  coslng: number;
  sinlat: number;
  sinlng: number;
  state: string;
  city: string;
  garageName: string;
  addressNew: string;
  addressOld: string;
  icon: number;
  charge: number;
  chargeOneDay: number;
  first30: number;
  creditCardYN: string;
  satFreeYN: string;
  sunFreeYN: string;
  free30YN: string;
  ticketPartnerYN: string;
  parkIntro: string;
  onedayTicketCost: number;
  paylank: number;
  limitedNumber: number;
  keyword: string;
  distance?: number;
  monthYN: string;
  weekdayYN: string;
  weekendYN: string;
  nightYN: string;
  weekdayTimeYN: string;
  weekendTimeYN: string;
  dinnerYN: string;
  conNightYN: string;
}

export interface TicketProps {
  ticketAmt: string;
  ticketOrder: number;
  ticketName: string;
  ticketText: string;
  ticketStart: string;
  ticketEnd: string;
  ticketLimit: number;
  ticketRealTime: number;
  ticketRate: number;
  ticketdayLimit: string;
}

export interface NoticeEventProps {
  eImage: string;
  text: string;
  showYN: string;
  requiredExitYN: string;
}

export interface VersionCodeProps {
  versionCode: string;
  requiredVersionCode: string;
  title: string;
  text: string;
}

export interface ParkingLimitProps {
  small: boolean;
  large: boolean;
  sports: boolean;
  suv: boolean;
  medium: boolean;
  semiMedium: boolean;
  little: boolean;
  textField: string;
}

export interface ParkingCarpooInfoProps {
  avgPrice: string;
  sumNumber: string;
}

export interface ImageProps {
  fileName: string;
  height?: number;
  width?: number;
  uri: string;
  type?: string;
}

export interface ReplyProps {
  bbsId: number;
  id: number;
  gender: GENDER;
  memberId: number;
  memberNic: string;
  memberPhotoId: number;
  regdate: number;
  text: string;
}

export interface MonthlyParkingDirectProps {
  s_garageName: string;
  s_garageAddress: string;
  s_gtime: string;
  pnum: string;
  gender: GENDER;
  s_rSpace: string;
  s_gday: string;
  s_gubun: string;
  c_appYN: IS_ACTIVE;
  s_garagePay: string;
  s_memberId: string;
  memberNic: string;
  carNumber: string;
  replyCount: number;
  carImage4Id: string;
  s_subject: string;
  s_no: number;
  regdate: number;
  s_garageInfo: string;
  carImage3Id: string;
  rrCount: number;
  s_shareSpace: string;
  carImage2Id: string;
  carImage1Id: string;
}

export interface MonthlyParkingDirectImageProps {
  bbsId: number;
  s_memberId: string;
  carImage1Id: number;
  carImage2Id: number;
  carImage3Id: number;
  carImage4Id: number;
}

export interface MonthlyParkingDirectReplyProps {
  bbsId: number;
  gender: GENDER;
  id: number;
  memberId: number;
  memberNic: string;
  regdate: number;
  text: string;
}

export interface ItemOfListParkingLotsProps {
  addressNew: string;
  addressOld: string;
  appVersion: number;
  brand: string;
  category: string;
  charge: number;
  chargeOneDay: number;
  city: string;
  coslat: number;
  coslng: number;
  creditCardYN: string;
  first30: number;
  free30YN: string;
  garageName: string;
  icon: number;
  id: number;
  keyword: string;
  lat: number;
  limitedNumber: number;
  lng: number;
  monthYN: string;
  onedayTicketCost: number;
  parkingIntro: null;
  paylank: number;
  satFreeYN: string;
  sinlat: number;
  sinlng: number;
  state: string;
  sunFreeYN: string;
  themeParking: string;
  ticketPartnerYN: string;
  distance: number;
  ticketName?: string;
  ticketAmt?: number;
}

export interface PhotoOfParkingProps {
  uri: string | undefined;
  name: string;
  date: string;
}
export interface CouponProps {
  c_number: string;
  c_datetime: string;
  c_price: string;
  c_name: string;
  c_check: IS_ACTIVE;
  c_use: IS_ACTIVE;
}

export interface ResponseProps {
  statusCode: string;
  statusMsg: string;
}

export interface PaymentHistoryProps {
  TotalTicketType: string;
  agCarNumber: string;
  amt: string;
  authDate: string;
  carNumber: string;
  weather: string;
  id: number;
  inCarCheck: IS_ACTIVE;
  parkNm: string;
  parkingLotId: string;
  requirements: string;
  reservedEdDtm: string;
  reservedStDtm: string;
  resultCode: string;
  inFlightAndCityName: string;
  outFlightAndCityName: string;
  ticketPartnerYN: IS_ACTIVE;
  tid: string;
  useCoupon: string;
  usePoint: string;
  usePointSklent: string;
  carImage1Id: number;
  carImage2Id: number;
  carImage3Id: number;
  carImage4Id: number;
  carImage5Id: number;
}
export interface ValetQnaBbsCreateProps {
  memberId: number;
  memberPwd: string;
  subject: string;
  text: string;
  photo: any;
  deviceToken?: string;
  parkingLotId?: number;
  photoFullWidth?: number;
  photoFullHeight?: number;
}
export interface CreditCardProps {
  cardName: string;
  defaultYN: IS_ACTIVE;
  id: number;
  number1: string;
  number4: string;
  memberPwd?: string;
  buyerName?: string;
  billKey?: string;
  cardCode?: string;
  amt?: string;
  regdate?: string;
}

export interface ccbCheckList {
  mTemp: string;
  mParkId: number;
}

export interface ValetQnaBbsProps {
  carNumber: string;
  replyCount: number;
  gender: string;
  subject: string;
  regdate: number;
  parkingLotId: number;
  id: number;
  text: string;
  memberNic: string;
  memberId: number;
  memberPhotoId: number;
  photoId: number;
  replyYN: IS_ACTIVE;
}

export interface MyListValetQnaBbsProps {
  carNumber: string;
  gender: string;
  id: number;
  memberId: number;
  memberNic: string;
  memberPhotoId: number;
  parkingLotId: number;
  photoId: number;
  regdate: number;
  replyCount: number;
  subject: string;
  text: string;
}

export interface ValetMainNoticeProps {
  id: number;
  memberId: number;
  memberNic: string;
  regdate: number;
  subject: string;
  text: string;
}

export interface ConnectedCarProps {
  connectedCompany: string;
  isAgree: boolean;
  isConnected: boolean;
  memberId: number;
  refreshtoken: string;
  tokenCreateDate: string;
  userId: string;
}

export interface PayInfoProps {
  agency: string;
  carColor: string;
  carNumber: string;
  cardName: string;
  dayNameGubun: string;
  garageName: string;
  id: number;
  issue_text: string;
  limitedNumber: number;
  mpoint: string;
  number1: string;
  number4: string;
  pnum: string;
  releyparking: IS_ACTIVE;
  smsText: string;
  ticketPartnerYN: IS_ACTIVE;
  wifiYN: IS_ACTIVE;
  a1TicketCost: number;
}

export interface ParkingRestrictionProps {
  parkId: string;
  parkName: string;
  start_date: string;
  end_date: string;
}

export interface ParkingBottomBannerProps {
  orderNo: string;
  parkId: string;
  fileName: string;
  url: string;
}

export interface MarkerProps {
  width: number;
  height: number;
  source: MarkerImageProp;
  caption?: {
    text: string;
    color?: string;
    textSize?: number;
    align?: 'Center' | 'Top' | 'Bottom' | 'Left' | 'Right';
  };
}

export interface CarInsuranceInfo {
  id: number;
  mid?: string;
  photoId: number;
  memberId: number;
  driverId?: number;
  favStatus: string;
  status: string;
  d_memberId: string;
  r_memberId: string;
  historyId: string;
  nic: string;
  carNumber: string;
  carModel: string;
  carColor: string;
  carYear: string;
  deviceToken: string;
  fcmToken: string;
  termsYN: string;
  realName: string;
  jumin: string;
  email: string;
  licenseNum: string;
  licenseKind: string;
  licenseEndDate: string;
  licenseAuthNum: string;
  insurCompany: string;
  insurEndDate: string;
  insurPropertyAmt: string;
  insurPersonalAmt: string;
  insurDriverName: string;
  insurDriverYN: string;
  style: string;
  bankNum: string;
  bankName: string;
  pName: string;
  calYN: string;
  authYN: string;
  c_memberId: number;
  startPlaceIn: string;
  startTimeIn: string;
  stopOverPlaceIn: string;
  endPlaceIn: string;
  priceIn: string;
  selectDayIn: string;
  introduce: string;
  introduceOut: string;
  splatIn: string;
  splngIn: string;
  soplatIn: string;
  soplngIn: string;
  eplatIn: string;
  eplngIn: string;
  startPlaceOut: string;
  startTimeOut: string;
  stopOverPlaceOut: string;
  endPlaceOut: string;
  priceOut: string;
  selectDayOut: string;
  defaultYN: string;
  billKey: string;
  licenseImageUrl: string;
  insurImageUrl: string;
  profileImageUrl: string;
  bankImageUrl: string;
  bcImageUrl: string;
  carImageUrl: string;
  carImageUrl2: string;
  carImageUrl3: string;
  carImageUrl4: string;
  vaccineImageUrl: string;
  driverCnt: string;
  eval: string;
  badge: string;
  avg1: string;
  avg2: string;
  avg3: string;
  text: string;
  splatOut: string;
  splngOut: string;
  soplatOut: string;
  soplngOut: string;
  eplatOut: string;
  eplngOut: string;
  startPlace: string;
  startTime: string;
  splat: string;
  splng: string;
  stopOverPlace: string;
  soplat: string;
  soplng: string;
  endPlace: string;
  eplat: string;
  eplng: string;
  price: string;
  selectDay: string;
  carAuthYN: string;
  licenseAuthYN: string;
  insurAuthYN: string;
  calAuthYN: string;
  vcAuthYN: string;
  coAddress?: string;
  coName?: string;
  job?: string;
  jobType?: string;
}
export interface ParkingInfo {
  id: number;
  appVersion: number;
  category: string;
  brand: string;
  themeParking: string;
  lat: number;
  lng: number;
  coslat: number;
  coslng: number;
  sinlat: number;
  sinlng: number;
  state: string;
  city: string;
  garageName: string;
  addressNew: string;
  addressOld: string;
  icon: number;
  charge: number;
  chargeOneDay: number;
  first30: number;
  creditCardYN: string;
  satFreeYN: string;
  sunFreeYN: string;
  free30YN: string;
  monthYN: string;
  ticketPartnerYN: string;
  parkingIntro: null | string;
  onedayTicketCost: number;
  paylank: number;
  limitedNumber: number;
  keyword: string;
}
export interface BBSNoticeProps {
  id: number;
  regdate: number;
  replyCount: number;
  subject: string;
  text: string;
  photoId?: number;
}

export interface ReplyNoticeProps {
  memberId: number;
  memberNic: string;
  memberPhotoId: number | null;
  noticeId: number;
  regdate: number;
  text: string;
  gender: GENDER;
}

export interface RegisterParkingSharedProps {
  sMemberId: string | null;
  sGarageName: string | null;
  sGarageInfo: string | null;
  sGarageAddress: string | null;
  sGaragePay: string | null;
  sShareSpace: string | null;
  sGTime: string | null;
  sGDay: string | null;
  pNum: string | null;
}

export interface UpdateImageSharedProps {
  bbsId: string;
  sMemberId: string | null;
  carImage1?: ImageProps | null;
  carImage2?: ImageProps | null;
  carImage3?: ImageProps | null;
  carImage4?: ImageProps | null;
}

export interface CodeRegionProps {
  code: number;
  state: string;
  city: string;
  lat: number;
  lng: number;
  coslat: number;
  coslng: number;
  sinlat: number;
  sinlng: number;
}

export interface WeatherProps {
  image: number;
  desc: string;
}

export interface ParkingFilterProps {
  title: string;
  value: PARKING_FILTER_TYPE;
}

export interface SNSUserProfile {
  email: string;
  nickname: string;
  phoneNumber: string;
  loginType: string;
}

export interface ParkLinkProps {
  gExp1: string;
  gExp2: string;
  gExp3: string;
  gId1: string;
  gId2: string;
  gId3: string;
  gMoney1: string;
  gMoney2: string;
  gMoney3: string;
  gName1: string;
  gName2: string;
  gName3: string;
}

export interface RevocableProps {
  authDate: string;
  inCarCheck: IS_ACTIVE;
  payMethod: string;
  reservedEdDtm: string;
  amt: string;
  currentDate: string;
  reservedStDtm: string;
  tid: string;
}

export interface MenuProps {
  title: string;
  onPress: () => void;
  isShowDot?: boolean;
}

export interface PaymentBank {
  id: string;
  name: string;
  image: React.ReactNode;
}

export interface RecommendDriverProps {
  id: string;
  date: string;
  driverName: string;
  isVerify: boolean;
  driverAvatar: string;
  numOfCarpool: number;
  timeStart: string;
  timeArrive: string;
  stopOverAddress?: string;
  startAddress: string;
  arriveAddress: string;
  isParking?: boolean;
  carpoolRequestAmountToStopover?: number;
  carpoolRequestAmount: number;
  businessCardVerificationCompleted?: boolean;
}

export interface ChatRoomProps {
  msg: string;
  msgtype: string;
  timestamp: {
    nanoseconds: number;
    seconds: number;
  };
  title: string;
  uid: string;
  users: {[key: string]: number};
}

// driver registration
export interface CarPhotoRegistrationModel {
  front_car: ImageProps | undefined;
  back_car: ImageProps | undefined;
  beside_car: ImageProps | undefined;
  inside_car: ImageProps | undefined;
}

export interface CarInformationRegistrationModel {
  infor: VehicleInformation;
}

export interface VehicleInformation {
  car_number: string;
  car_sample: string;
  car_color: string;
  car_year: string;
  production: string;
}

export interface ReportTypeModel {
  title: string;
  value: number;
}

export interface AddressKakaoProps {
  place_name: any;
  id: string;
  address_name: string;
  address: {address_name: string};
  road_address: {address_name: string; building_name: string};
  x: string;
  y: string;
  isParking?: boolean;
}

export interface RoadUpdateProps {
  c_memberId: string;
  startPlaceIn: string;
  startTimeIn: string;
  splatIn: string;
  splngIn: string;
  endPlaceIn: string;
  eplatIn: string;
  eplngIn: string;
  priceIn: string;
  introduce: string;
  startParkIdIn?: string;
  endParkIdIn?: string;
  startParkIdOut?: string;
  endParkIdOut?: string;
  stopParkIdOut?: string;
  stopParkIdIn?: string;
}

export interface RoadInDriverUpdateProps extends RoadUpdateProps {
  stopOverPlaceIn?: string;
  soplatIn?: any;
  soplngIn?: any;
  selectDayIn?: string;
  soPriceIn?: string;
}

export interface RoadOutDriverUpdateProps {
  c_memberId: string;
  startPlaceOut: string;
  startTimeOut: string;
  splatOut: any;
  soplatOut?: any;
  soplngOut?: any;
  eplatOut: any;
  eplngOut: any;
  stopOverPlaceOut?: string;
  endPlaceOut: string;
  priceOut: string;
  selectDayOut?: string;
  splngOut: any;
  introduceOut: string;
  soPriceOut?: string;
  // soPriceIn: string;
}

export interface RoadRouteWorkProps {
  timeStart: string;
  timeArrive: string;
  stopOverAddress?: string;
  startAddress: string;
  arriveAddress: string;
  price: string;
  priceStop?: string;
}
export interface CoordRoute {
  latitude: string | number;
  longitude: string | number;
}
export interface TemporaryRouteProps {
  startPlaceIn: string;
  endPlaceIn: string;
  startPlaceOut: string;
  endPlaceOut: string;

  startCoordIn?: CoordRoute;
  endCoordIn?: CoordRoute;
  startCoordOut?: CoordRoute;
  endCoordOut?: CoordRoute;
}

export interface PointProps {
  parkId: number;
  point: number;
  regdate: number;
  garageName: string;
  note: string;
}

export interface ChargeProps {
  amt: number;
  usePointSklent: number;
  resultCode: number;
  createDate: number;
  totalTicketType: string;
}

export interface QnAProps {
  replyYN: 'Y' | 'N';
  subject: string;
  ip: string;
  regdate: number;
  photoId: number;
  parkingLotId: number;
  id: number;
  text: string;
  readYN: 'Y' | 'N';
  memberId: number;
  deviceToken: string;
}

export interface PlaceInfoKakao {
  id: string;
  place_name: string;
  address_name: string;
  latitude: string;
  longitude: string;
}
