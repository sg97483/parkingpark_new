import {IS_ACTIVE} from '~constants/enum';

export interface CarpoolPayHistoryModel {
  ratId: number;
  amt: string;
  c_memberId: number;
  cancelledYN: string;
  carInOut: string;
  createDate: number;
  endPlace: string;
  eplat: number;
  eplng: number;
  eval: string;
  id: number;
  introduce: string;
  nic: string;
  photoId: number;
  price: string;
  profileImageUrl: string;
  rStatusCheck: string;
  reservedStDtm: string;
  selectDay: string;
  soplat: number;
  soplng: number;
  soPrice: string;
  splat: number;
  splng: number;
  startPlace: string;
  startTime: string;
  endTime?: string;
  state: string;
  stopOverPlace: string;
  r_memberId: number;
  d_memberId: number;
  chatId: string;
  roadInfoId: number;
  cancelAmt: number;
  cancelRequestBy: string;
  email?: string;
  penaltyRequestBy?: string;
  cancelNum: string;
  payStatus: string;
  calYN?: string;
  useCoupon: string;
  usePoint: string;
  usePointSklent: string;
}

export interface MyPaymentModel {
  acquCardcode: string;
  acquCardname: string;
  agCarNumber: string;
  amt: string;
  authCode: string;
  authDate: string;
  c_memberId: number;
  cancelledYN: string;
  carInOut: string;
  carModel: string;
  carNumber: string;
  cardCl: string;
  cardCode: string;
  cardName: string;
  cardNo: string;
  createDate: number;
  d_memberId: number;
  endPlace: string;
  eplat: number;
  eplng: number;
  eval: string;
  goodsName: string;
  id: number;
  introduce: string;
  mid: string;
  moid: string;
  nic: string;
  payMethod: string;
  pg: string;
  price: string;
  rStatusCheck: string;
  r_memberId: number;
  requirements: string;
  reservedStDtm: string;
  resultCode: string;
  resultMsg: string;
  roadInfoId: number;
  selectDay: string;
  soplat: number;
  soplng: number;
  splat: number;
  splng: number;
  startPlace: string;
  startTime: string;
  state: string;
  stopOverPlace: string;
  tid: string;
  useCoupon: string;
  usePoint: string;
  usePointSklent: string;
}

export interface CarDriverModel {
  carNumber: string;
  carModel: string;
  carYear: string;
  carColor: string;
  carImages: string[];
  authYN: IS_ACTIVE;
}

export interface CarpoolReservationPayModel {
  r_memberId: number;
  resId: number;
  roadInfoId: number;
  amt: number;
  reservedStDtm: string;
  rStatusCheck: string;
  agCarNumber: string;
  carInOut: string;
}

export interface CancelPaymentBodyModel {
  historyId: number;
  d_memberId: number;
  r_memberId: number;
  chatId: string;
  roadInfoId: number;
  reservedStDtm: string; //YYYMMDDHHmm
  cancelRequestBy: 'PASSENGER' | 'DRIVER';
  cancelAmt: number;
  cancelNum: number;
}

export interface CarpoolPayHistoryPayload {
  r_memberId?: number;
  d_memberId?: number;
  filterInOut: number;
  filterState: number;
  filterftDate: number;
  frDate: string;
  toDate: string;
}
