import moment from 'moment';
import {AUTO_MESSAGE_TYPE} from '~constants/enum';
import {ChatRoomModel, NotiDataModel} from '~model/chat-model';
import {DriverRoadDayModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';

// Firestore Modular API import
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  serverTimestamp,
} from '@react-native-firebase/firestore';

const db = getFirestore();

export const createNewChatRoom = async ({
  otherEmail,
  passengerID,
  driverID,
  myUID,
  cDayId,
  temptRoute,
  routeRegisterByPassengerID = null,
  selectedPrice,
}: {
  otherEmail: string;
  passengerID: number;
  driverID: number;
  myUID: string;
  cDayId: number | null;
  temptRoute?: DriverRoadDayModel | null;
  routeRegisterByPassengerID?: number | null;
  selectedPrice?: 'M' | 'E' | null;
}) => {
  const roomsCollection = collection(db, 'rooms');

  // 1. 상대방 데이터 조회
  const usersQuery = query(collection(db, 'users'), where('userid', '==', otherEmail));
  const usersSnapshot = await getDocs(usersQuery);
  const otherData = usersSnapshot.docs?.[0]?.data();

  // 2. 내 UID 기준으로 채팅방 조회
  const roomCheckQuery = query(collection(db, 'rooms'), where(`users.${myUID}`, '>=', 0));
  const roomCheckSnapshot = await getDocs(roomCheckQuery);

  const isRoomExisted = !cDayId
    ? roomCheckSnapshot.docs.find(docSnap => {
        const docData = docSnap.data();
        return (
          docData.users?.[`${otherData?.uid}`] >= 0 &&
          docData?.temptRoute?.selectDay === temptRoute?.selectDay &&
          docData?.selectedPrice === selectedPrice &&
          docData?.temptRoute?.carInOut === temptRoute?.carInOut &&
          docData?.rStatusCheck !== 'C'
        );
      })
    : roomCheckSnapshot.docs.find(docSnap => {
        const docData = docSnap.data();
        return (
          docData.users?.[`${otherData?.uid}`] >= 0 &&
          docData.cDayId === cDayId &&
          docData?.temptRoute?.selectDay === temptRoute?.selectDay &&
          docData?.selectedPrice === selectedPrice &&
          docData?.temptRoute?.carInOut === temptRoute?.carInOut &&
          docData?.rStatusCheck !== 'C'
        );
      });

  if (isRoomExisted) {
    return {
      ...isRoomExisted.data(),
      roomID: isRoomExisted.id,
      isExisted: true,
    };
  } else {
    // 새 방 생성
    const roomID = doc(roomsCollection).id;
    const newRoomRef = doc(db, 'rooms', roomID);

    await setDoc(newRoomRef, {
      passengerID: passengerID,
      driverID: driverID,
      users: {[myUID]: 0, [otherData?.uid]: 0},
      uid: myUID,
      timestamp: serverTimestamp(),
      cDayId: cDayId ? cDayId : null,
      temptRoute: temptRoute ? temptRoute : {},
      routeRegisterByPassengerID: routeRegisterByPassengerID,
      selectedPrice: selectedPrice || null,
      rStatusCheck: 'N',
    });

    const res = await getDoc(newRoomRef);

    return {
      ...res?.data(),
      roomID: roomID,
      isExisted: false,
    };
  }
};

export const handleSendAutomaticMessage = async (data: NotiDataModel) => {
  const roomRef = doc(db, 'rooms', data?.roomID);
  const messagesRef = collection(roomRef, 'messages');
  let msg = '';
  let addMsg = '';
  let msgtype = '';
  let autoMsgType = data?.type;
  let now = moment().format('YYYY.MM.DD HH:mm');

  switch (autoMsgType) {
    case AUTO_MESSAGE_TYPE.ROUTE_OPERATION_REQUEST:
      msg = `${data?.passengerName} 탑승객님이 드라이버님의 경로 운행을 요청하였습니다.`;
      addMsg = `운행요청 ${msg}`;
      msgtype = AUTO_MESSAGE_TYPE.ROUTE_OPERATION_REQUEST;
      break;
    case AUTO_MESSAGE_TYPE.CARPOOL_REQUEST:
      msg = `${data?.passengerName} 탑승객님이 카풀을 요청하였습니다.`;
      addMsg = `카풀요청 ${msg}`;
      msgtype = AUTO_MESSAGE_TYPE.CARPOOL_REQUEST;
      break;
    case AUTO_MESSAGE_TYPE.PASSENGER_CARPOOL_REQUEST:
      msg = `${data?.passengerName} 탑승객님이 드라이버님의 경로 운행을 요청하였습니다.`;
      addMsg = `운행요청 ${msg}`;
      msgtype = AUTO_MESSAGE_TYPE.PASSENGER_CARPOOL_REQUEST;
      break;
    case AUTO_MESSAGE_TYPE.DRIVER_REPLY:
      msg = `${data?.driverName} 드라이버님이 카풀 운행 요청에 응답하셨습니다.`;
      addMsg = `요청응답 ${msg}`;
      msgtype = AUTO_MESSAGE_TYPE.DRIVER_REPLY;
      break;
    case AUTO_MESSAGE_TYPE.DRIVER_CARPOOL_REQUEST:
      msg = `${data?.passengerName} 드라이버님이 카풀을 요청하였습니다.`;
      addMsg = `카풀요청 ${msg}`;
      msgtype = AUTO_MESSAGE_TYPE.DRIVER_CARPOOL_REQUEST;
      break;
    case AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_RESERVATION:
      msg = `${data?.passengerName} 탑승객님이 카풀 요청을 취소하였습니다`;
      addMsg = `요청취소 ${msg}.`;
      msgtype = AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_RESERVATION;
      break;
    case AUTO_MESSAGE_TYPE.DRIVER_CANCEL_RESERVATION:
      msg = `${data?.driverName} 드라이버님이 요청응답이 취소되었습니다.`;
      addMsg = `요청취소 ${msg}.`;
      msgtype = AUTO_MESSAGE_TYPE.DRIVER_CANCEL_RESERVATION;
      break;
    case AUTO_MESSAGE_TYPE.ROUTE_OPERATION_REGISTRATION:
      msg = `${data?.driverName} 드라이버님이 운행경로를 등록하였습니다.`;
      addMsg = `경로등록 ${msg}`;
      msgtype = AUTO_MESSAGE_TYPE.ROUTE_OPERATION_REGISTRATION;
      break;
    case AUTO_MESSAGE_TYPE.CARPOOL_APPROVAL:
      msg = `${data?.driverName} 드라이버님이 카풀을 승인하였습니다. 결제하기 버튼을 통해 결제를 하면 카풀예약이 완료 됩니다.`;
      addMsg = `카풀승인 ${msg}`;
      msgtype = AUTO_MESSAGE_TYPE.CARPOOL_APPROVAL;
      break;
    case AUTO_MESSAGE_TYPE.COMPLETE_PAYMENT:
      msg = '카풀 예약이 완료 되었습니다. 카풀로 더욱 편리하고 즐거운 출퇴근 시간 보내세요.';
      addMsg =
        '결제완료  카풀 예약이 완료 되었습니다. 카풀로 더욱 편리하고 즐거운 출퇴근 시간 보내세요.';
      msgtype = AUTO_MESSAGE_TYPE.COMPLETE_PAYMENT;
      break;
    case AUTO_MESSAGE_TYPE.CARPOOL_COMPLETED:
      msg = '카풀 운행이 완료되었습니다.';
      addMsg = '카풀완료 카풀 운행이 완료되었습니다.';
      msgtype = AUTO_MESSAGE_TYPE.CARPOOL_COMPLETED;
      break;
    case AUTO_MESSAGE_TYPE.RESQUEST_RESPONSE:
      msg = `${data?.driverName} 드라이버님이 카풀 운행 요청에 응답하셨습니다.`;
      addMsg = `요청응답 ${msg}`;
      msgtype = AUTO_MESSAGE_TYPE.RESQUEST_RESPONSE;
      break;
    case AUTO_MESSAGE_TYPE.PASSENGER_LEFT:
      msg = `${data?.passengerName} 탑승객님 채팅방에서 나가셨습니다.`;
      addMsg = `${msg}`;
      msgtype = AUTO_MESSAGE_TYPE.PASSENGER_LEFT;
      break;
    case AUTO_MESSAGE_TYPE.DRIVER_LEFT:
      msg = `${data?.driverName} 드라이버님 채팅방에서 나가셨습니다.`;
      addMsg = `${msg}`;
      msgtype = AUTO_MESSAGE_TYPE.DRIVER_LEFT;
      break;
    case AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_PAYMENT:
      msg = `예약취소 ${data?.passengerName} 탑승객님이 카풀 예약을 취소하였습니다.`;
      addMsg = msg;
      msgtype = AUTO_MESSAGE_TYPE.PASSENGER_CANCEL_PAYMENT;
      break;
    case AUTO_MESSAGE_TYPE.DRIVER_CANCEL_PAYMENT:
      msg = `예약취소 ${data?.driverName} 드라이버님이 카풀 예약을 취소하였습니다.`;
      addMsg = msg;
      msgtype = AUTO_MESSAGE_TYPE.DRIVER_CANCEL_PAYMENT;
      break;
    case AUTO_MESSAGE_TYPE.DRIVER_CHANGE_AMOUNT:
      msg = `${data?.driverName ?? ''} 드라이버님이 카풀금액을 변경하였습니다.`;
      addMsg = `금액변경 ${data?.driverName ?? ''} 드라이버님이 카풀금액을 변경하였습니다.`;
      msgtype = AUTO_MESSAGE_TYPE.DRIVER_CHANGE_AMOUNT;
      break;
    default:
      return;
  }

  // Firestore update & add message
  await updateDoc(roomRef, {
    msg,
    msgtype: '0',
    lastDatetime: now,
  });
  await addDoc(messagesRef, {
    uid: '',
    msg: addMsg,
    msgtype,
    timestamp: serverTimestamp(),
    readUsers: [],
  });
};

export const onNavigateToChatDetail = (navigation: UseRootStackNavigation, data: ChatRoomModel) => {
  if (data?.roomID) {
    navigation.navigate(ROUTE_KEY.ChatDetail, {
      currentChatRoomInfo: data,
    });
  }
};
