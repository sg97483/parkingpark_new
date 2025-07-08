import notifee, {AndroidImportance, TimestampTrigger, TriggerType} from '@notifee/react-native';
import {getStorage, ref, uploadBytes, getDownloadURL} from '@react-native-firebase/storage';
import moment from 'moment';
import {Alert, Linking, Platform} from 'react-native';

export const checkValidateEmail = (str: string) =>
  String(str)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
export const randomInt = (max: number) => Math.floor(Math.random() * max);
export const randomRecomCode = () => {
  const num1 = randomInt(10);
  const num2 = randomInt(10);
  const num3 = randomInt(10);
  const num4 = randomInt(10);
  const num5 = randomInt(10);
  const num6 = randomInt(10);
  return num1 + '' + num2 + '' + num3 + '' + num4 + '' + num5 + '' + num6;
};
export const createNotificationWithTime = async (dateTime: number) => {
  const channelId = await notifee.createChannel({
    id: 'PARKING',
    name: 'PARKING',
    importance: AndroidImportance.HIGH,
  });

  // Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: dateTime, // fire at 11:10am (10 minutes before meeting),
  };

  // Create a trigger notification
  return await notifee.createTriggerNotification(
    {
      title: '파킹박주차알람',
      body: '주차장에서  출차 할 시간입니다',
      android: {
        channelId: channelId,
      },
    },
    trigger,
  );
};
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AlertYesNo = (
  title: string,
  functionYes?: () => void,
  functionCancel?: () => void,
  textYes?: string,
  textNo?: string,
) =>
  Alert.alert('', title, [
    {
      text: textYes || '예',
      onPress: functionYes,
    },
    {
      text: textNo || '아니오',
      onPress: functionCancel,
    },
  ]);

export const isEmpty = (value: any) => {
  if (!value) {
    return true;
  }
  const text = String(value);
  if (!text || text.trim() === '') {
    return true;
  }
  return false;
};

export const createFormDataToObject = (object: Record<string, any>) => {
  // object 타입 명시 (Record<string, any>가 any보다 더 구체적)
  const formData = new FormData();
  Object.entries(object).forEach(([property, value]) => {
    // value가 FormData.append가 허용하는 타입임을 명시
    formData.append(property, value as string | Blob);
  });
  return formData;
};

export const getDayOfWeek = (date: Date | string | number) => {
  let dayOfWeek = '';
  const day_of_week = moment(date).day() + 1;

  switch (day_of_week) {
    case 1:
      dayOfWeek = ' (일)';
      break;
    case 2:
      dayOfWeek = ' (월)';
      break;
    case 3:
      dayOfWeek = ' (화)';
      break;
    case 4:
      dayOfWeek = ' (수)';
      break;
    case 5:
      dayOfWeek = ' (목)';
      break;
    case 6:
      dayOfWeek = ' (금)';
      break;
    case 7:
      dayOfWeek = ' (토)';
      break;
  }
  return dayOfWeek;
};

export const getReservedDtm = (dtm: string | undefined) => {
  if (dtm) {
    return (
      dtm.substring(0, 4) +
      '년 ' +
      dtm.substring(4, 6) +
      '월 ' +
      dtm.substring(6, 8) +
      '일 ' +
      dtm.substring(8, 10) +
      '시' +
      dtm.substring(10, 12) +
      '분'
    );
  }
  return '';
};

export const getYearMonthDateFromDtm = (dtm: string) => {
  let dtmYear = dtm.substring(0, 4);
  let dtmMonth = dtm.substring(4, 6);
  let dtmDate = dtm.substring(6, 8);
  return dtmYear + '년 ' + dtmMonth + '월 ' + dtmDate + '일';
};

export const getMonthYearFromDtm = (dtm: string) => {
  let dtmMonth = dtm.substring(4, 6);
  let dtmDate = dtm.substring(6, 8);
  return dtmMonth + '월 ' + dtmDate + '일';
};
export const formatNumber = (num: string) =>
  num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

export const clearCharacter = (string: string | any, character: string) =>
  string?.replaceAll(character, '');

export const uploadImage = async (
  uriImage: string,
  folder: string,
  fileName: string | number,
  onDone: (url: string) => Promise<void> | void,
) => {
  try {
    const uploadUri = Platform.OS === 'ios' ? uriImage.replace('file://', '') : uriImage;
    const storageInstance = getStorage();
    const reference = ref(storageInstance, `${folder}/${fileName}`);

    // fetch를 이용해 파일을 blob으로 변환
    const response = await fetch(uploadUri);
    const blob = await response.blob();

    // 업로드
    await uploadBytes(reference, blob);

    // 다운로드 URL 가져오기
    const url = await getDownloadURL(reference);
    await onDone(url);
  } catch (error) {
    console.error('uploadImage error:', error);
    throw error;
  }
};

export const getIndexWeather = (weatherData: Record<string, string> | null): number => {
  const weatherTodayYear = Number(weatherData?.SHRT_TM_YYYY);
  const weatherTodayMonth = Number(weatherData?.SHRT_TM_EF_MM_01);
  const weatherTodayDay = Number(weatherData?.SHRT_TM_EF_DD_01);
  const weatherTodayHour = Number(weatherData?.SHRT_TM_EF_HH_01);

  const currentCal = new Date();
  const responseCal = new Date();
  responseCal.setFullYear(weatherTodayYear);
  responseCal.setMonth(weatherTodayMonth);
  responseCal.setDate(weatherTodayDay);
  responseCal.setHours(weatherTodayHour);

  if (currentCal.getTime() > responseCal.getTime()) {
    const millisecond: number = currentCal.getTime() - (responseCal.getTime() - 1);
    const hourDifference = Math.floor(millisecond / (60 * 60 * 1000));
    const result = hourDifference / 3 > 0 ? hourDifference / 3 - 1 : hourDifference / 3;
    return result;
  } else {
    return 0;
  }
};

export const formatIndexWeather = (index: number): string => {
  return index.toLocaleString('ko-KR', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
};

export const getTodayWeatherText = (res: string, index: number): string => {
  const index1 = formatIndexWeather(index + 1);
  const name1: string = '$SHRT_TM_EF_MM_' + index1 + ' =';
  const name2: string = '$SHRT_TM_EF_DD_' + index1 + ' =';
  const name3: string = '$SHRT_TM_EF_WD_' + index1 + ' =';
  const nameLast: string = '$SHRT_TM_EF_FD_01 =';

  let value1 = '';
  let value2 = '';
  let value3 = '';

  const idx1: number = res.indexOf(name1);
  const idxLast: number = res.indexOf(nameLast);

  const bundle: string = res.substring(idx1, idxLast).trim();

  const arBundle: string[] = bundle.split(';');
  for (let i = 0; i < arBundle.length; i++) {
    let name = arBundle[i].split("'")[0].trim();
    if (name === name1) {
      value1 = arBundle[i].split("'")[1];
    } else if (name === name2) {
      value2 = arBundle[i].split("'")[1];
    } else if (name === name3) {
      value3 = arBundle[i].split("'")[1];
    }
  }
  return value1 + '.' + value2 + '(' + value3 + ')';
};

export const handleOpenAppInStore = (url: string) => {
  Linking.canOpenURL(url).then(
    supported => {
      supported && Linking.openURL(url);
    },
    err => console.log(err),
  );
};

export const isTwoLines = (text: string) => text.split('\n').length === 2;
