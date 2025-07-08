import {DriverRoadDayModel} from './driver-model';

export interface UserModel {
  userid?: string;
  uid?: string;
  usernm?: string;
  token?: string;
  userphoto?: string;
  usermsg?: string;
  testdataset?: number;
}

export interface ChatRoomModel {
  roomID?: string;
  uid?: string;
  userid?: string;
  lastMsg?: string;
  lastDatetime: string;
  userCount?: number;
  unreadCount?: number;
  passengerID?: number;
  driverID?: number;
  resId?: number;
  isRequestedBy?: 'PASSENGER' | 'DRIVER';
  cDayId?: number;
  otherUID?: string;
  title?: string;
  photo?: string;
  temptRoute: DriverRoadDayModel | undefined;
  users?: any;
  routeRegisterByPassengerID?: number | null;
  isCancelRequest?: boolean;
}

export interface MessageGroupByDateModel {
  date: string;
  messages: MessageModel[];
}

export interface MessageModel {
  chatID: string;
  msg: string;
  msgtype: string;
  readUsers: string[];
  timestamp: string;
  uid: string;
  filename?: string;
  filesize?: string;
}

export interface NotiDataModel {
  roomID: string;
  type: string;
  passengerName?: string;
  driverName?: string;
}

export interface RequestInfoModel {
  id: number;
  carInOut: 'in' | 'out';
  photoId: number;
  memberId: number;
  driverId: number;
  resId: number;
  roadInfoId: number;
  chatId: string;
  startPlace: string;
  startTime: string;
  splat: number;
  splng: number;
  stopOverPlace: string;
  soplat: number;
  soplng: number;
  endPlace: string;
  endTime: string;
  price: string;
  soPrice: string;
  selectDay: string;
  priceSelect: 'E' | 'M';
  requestState: 'N' | 'P' | 'O' | 'E' | 'C' | 'R';
  rstatusCheck: 'N' | 'P' | 'O' | 'E' | 'C' | 'R';
  eplat: number;
  eplng: number;
  d_memberId: number;
  r_memberId: number;
  introduce?: string;
  carNumber: string;
  isRouteRegistered: boolean;
}
