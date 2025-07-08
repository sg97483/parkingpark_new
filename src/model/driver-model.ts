import {IS_ACTIVE} from '~constants/enum';

export interface DriverModel {
  id: number;
  avatar: string;
  nickname: string;
  settlementAmount: number;
  operationAmount: number;
  isVerify: boolean;
  licensePlates: string;
  rangeOfVehicle: string;
}

export interface CarpoolMemberModel {
  authYN: string;
  coAddress: string;
  coName: string;
  id: number;
  job: string;
  jobType: string;
  jumin: string;
  memberId: number;
  realName: string;
  style: string;
  termsYN: string;
}

export interface MyDriverModel {
  authYN: string;
  badge: string;
  bankImageUrl: string;
  bankName: string;
  bankNum: string;
  bcImageUrl: string;
  c_memberId: number;
  calYN: string;
  carImageUrl: string;
  carImageUrl2: string;
  carImageUrl3: string;
  carImageUrl4: string;
  carModel: string;
  carNumber: string;
  carYear: string;
  carColor: string;
  startPlaceIn: string;
  endPlaceIn: string;
  eplatIn: number;
  eplngIn: number;
  splatIn: number;
  splngIn: number;
  startPlaceOut: string;
  endPlaceOut: string;
  eplatOut: number;
  eplngOut: number;
  splatOut: number;
  splngOut: number;
  soplngIn: number;
  soplatIn: number;
  soplngOut: number;
  soplatOut: number;
  id: number;
  insurCompany: string;
  insurDriverName: string;
  insurDriverYN: string;
  insurEndDate: string;
  insurImageUrl: string;
  insurPersonalAmt: string;
  insurPropertyAmt: string;
  licenseAuthNum: string;
  licenseEndDate: string;
  licenseImageUrl: string;
  licenseKind: string;
  licenseNum: string;
  memberId: number;
  nic: string;
  photoId: number;
  priceIn: string;
  priceOut: string;
  profileImageUrl: string;
  realName: string;
  startTimeIn: string;
  startTimeOut: string;
  stopOverPlaceIn: string;
  stopOverPlaceOut: string;
  style: string;
  termsYN: string;
  vaccineImageUrl: string;
  introduce: string;
  introduceOut: string;
  carAuthYN: string;
  licenseAuthYN: string;
  insurAuthYN: string;
  calAuthYN: string;
  vcAuthYN: string;
  soPriceIn: string;
  soPriceOut: string;
  driverCnt: number;
  startParkIdIn?: string;
  endParkIdIn?: string;
  startParkIdOut?: string;
  endParkIdOut?: string;
  email?: string;
  stopParkIdOut?: string;
  stopParkIdIn?: string;
}

export interface FavoriteUserModel {
  id: number;
  mid?: number;
  photoId: number;
  memberId: number;
  driverId?: number;
  riderId: number;
  favStatus: string;
  status?: string;
  d_memberId?: number;
  r_memberId?: number;
  historyId?: number;
  nic: string;
  carNumber: string;
  carModel: null;
  carColor: null;
  carYear: null;
  deviceToken: null;
  fcmToken: null;
  termsYN: string;
  realName: string;
  jumin: string;
  email?: string;
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
  carAuthYN: string;
  licenseAuthYN: string;
  insurAuthYN: string;
  calAuthYN: string;
  vcAuthYN: string;
  c_memberId: null;
  startPlaceIn: null;
  startTimeIn: null;
  stopOverPlaceIn: null;
  endPlaceIn: null;
  priceIn: null;
  selectDayIn: null;
  introduce: null;
  introduceOut: null;
  splatIn: null;
  splngIn: null;
  soplatIn: null;
  soplngIn: null;
  eplatIn: null;
  eplngIn: null;
  startPlaceOut: null;
  startTimeOut: null;
  stopOverPlaceOut: null;
  endPlaceOut: null;
  priceOut: null;
  soPriceIn: null;
  soPriceOut: null;
  selectDayOut: null;
  defaultYN: null;
  billKey: null;
  licenseImageUrl: null;
  insurImageUrl: null;
  profileImageUrl: null;
  bankImageUrl: null;
  bcImageUrl: null;
  carImageUrl: null;
  carImageUrl2: null;
  carImageUrl3: null;
  carImageUrl4: null;
  vaccineImageUrl: null;
  driverCnt: null;
  eval: null;
  badge: string;
  avg1: null;
  avg2: null;
  avg3: null;
  text: null;
  splatOut: null;
  splngOut: null;
  soplatOut: null;
  soplngOut: null;
  eplatOut: null;
  eplngOut: null;
  startPlace: null;
  startTime: null;
  endTime: null;
  splat: null;
  splng: null;
  stopOverPlace: null;
  soplat: null;
  soplng: null;
  endPlace: null;
  eplat: null;
  eplng: null;
  price: null;
  soPrice: null;
  selectDay: null;
}

export interface CarResgisterdModel {
  carNumber: string;
  carModel: string;
  carYear: string;
  defaultYN: string;
  carColor?: string;
  carManufacturer?: string;
}

export interface DriverEvaluationAverageModel {
  avg1: string;
  avg2: string;
  avg3: string;
}

export interface DriverEvaluationModel {
  driverQ1: string;
  driverQ2: string;
  driverQ3: string;
  regdate: number;
  text: string;
}

export interface DriverRoadDayModel {
  badge: string;
  c_memberId: number;
  carInOut: string;
  deviceToken: string;
  driverCnt: string;
  email: string;
  endPlace: string;
  endTime: string;
  eplat: number;
  eplng: number;
  eval: string;
  id: number;
  introduce: string;
  memberId: number;
  mid: number;
  nic: string;
  photoId: number;
  price: string;
  soPrice: string;
  profileImageUrl: string;
  selectDay: string;
  soplat: number;
  soplng: number;
  splat: number;
  splng: number;
  startPlace: string;
  startTime: string;
  state: string;
  stopOverPlace: string;
  style: string;
  jumin: number;
  carImageUrl: string;
  carImageUrl2: string;
  carImageUrl3: string;
  carImageUrl4: string;
  carNumber: string;
  carModel: string;
  carColor: string;
  carYear: string;
  authYN: string;
  startParkId?: number;
  endParkId?: number;
  dayregYN: number;
  amt: string;
  cancelRequestBy?: string;
  cancelAmt: string;
  penaltyRequestBy?: string;
  rStatusCheck: string;
}

export interface FavoriteDriverModel {
  driverId: number;
  favStatus: IS_ACTIVE;
}

export interface RouteRegisterModel {
  endPlace: string;
  endTime: string;
  eplat: number;
  eplng: number;
  soplat?: number;
  soplng?: number;
  splat: number;
  splng: number;
  startPlace: string;
  startTime: string;
  stopOverPlace?: string;
  carInOut: string;
  selectDate: string;
  introduce?: string;
  soPrice?: string;
  price?: string;
  startParkId?: string;
  endParkId?: string;
  startParkIdIn?: string | number;
  endParkIdIn?: string | number;
  startParkIdOut?: string | number;
  endParkIdOut?: string | number;
}

export interface BlockedUserModel {
  id: number;
  photoId: number;
  nic: string;
  email: string;
  memberId: number;
  profileImageUrl?: string;
  blockMId: number;
}
