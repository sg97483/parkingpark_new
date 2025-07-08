import moment from 'moment';
import {DateData} from 'react-native-calendars';
import {dayjs} from './dayjsUtil';

export const hourIndexToTime = (index: number) => {
  return ('0' + (Math.floor(index) % 24)).slice(-2) + ':' + ((index % 1) * 60 + '0').slice(0, 2);
};

export const getTimeAgo = (time: string | undefined | number) => {
  const date: number | undefined = time ? Number(time) : undefined;

  if (time) {
    const diffDay = moment().diff(moment(date), 'days');

    const diffMonth = moment().diff(moment(date), 'months');

    const diffYear = moment().diff(moment(date), 'years');

    const diffHour = moment().diff(moment(date), 'hours');

    const diffMinute = moment().diff(moment(date), 'minutes');

    if (diffDay > 0 && diffMonth === 0 && diffYear === 0) {
      return `${diffDay}일 전`;
    }

    if (diffMonth > 0 && diffYear === 0) {
      return `${diffMonth}달 전`;
    }

    if (diffYear > 0) {
      return `${diffYear}년 전`;
    }

    if (diffHour > 0) {
      return `${diffHour}시간 전`;
    }

    if (diffMinute > 0) {
      return `${diffMinute}분 전`;
    } else {
      return '몇초 전';
    }
  } else {
    return '';
  }
};

export const getBeforeTime = (bbsDate: number) => {
  let beforeSecond = (moment().valueOf() - bbsDate) / 1000;

  let beforeStr = '';
  if (beforeSecond < 345600) {
    if (beforeSecond < 3600) {
      beforeStr = Math.round(beforeSecond / 60) + '분전';
    } else if (beforeSecond < 86400) {
      beforeStr = Math.round(beforeSecond / 60 / 60) + '시간전';
    } else if (beforeSecond < 172800) {
      beforeStr = '1일전';
    } else if (beforeSecond < 259200) {
      beforeStr = '2일전';
    } else if (beforeSecond < 345600) {
      beforeStr = '3일전';
    }
  }
  return beforeStr;
};

export const getDayName = (value: number) => {
  const day = moment(value).day() + 1;
  switch (day) {
    case 1:
      return '일';

    case 2:
      return '월';

    case 3:
      return '화';

    case 4:
      return '수';

    case 5:
      return '목';

    case 6:
      return '금';

    case 7:
      return '토';

    default:
      return '';
  }
};

export const getFullDayName = (value: number): string => {
  const getDayName = () => {
    const day = moment(value).day() + 1;
    switch (day) {
      case 1:
        return '(일)';

      case 2:
        return '(월)';

      case 3:
        return '(화)';

      case 4:
        return '(수)';

      case 5:
        return '(목)';

      case 6:
        return '(금)';

      case 7:
        return '(토)';

      default:
        return '';
    }
  };

  return moment(value).format(`YYYY년 MM월 DD일 ${getDayName()}`);
};

export const getFullHourName = (value: number, simpleHour?: boolean) => {
  if (Number(moment(value).format('HH')) >= 12) {
    return simpleHour
      ? `오후 ${moment(value).format('hh:mm')}`
      : `오후 ${moment(value).format('HH시 mm분')}`;
  } else {
    return simpleHour
      ? `오전 ${moment(value).format('hh:mm')}`
      : `오전 ${moment(value).format('HH시 mm분')}`;
  }
};

export const calculateDate = () => {
  const daysOfWeek: DateData[] = [];
  const today = dayjs();
  if (today.day() === 0) {
    for (let i = 0; i < 5; i++) {
      const newDate = today.subtract(i + 2, 'day').format('YYYY-MM-DD');
      daysOfWeek.unshift({
        dateString: newDate,
        day: dayjs(newDate).date(),
        month: dayjs(newDate).month(),
        timestamp: dayjs(newDate).valueOf(),
        year: dayjs(newDate).year(),
      });
    }
  } else if (today.day() === 6) {
    for (let i = 0; i < 5; i++) {
      const newDate = today.subtract(i + 1, 'day').format('YYYY-MM-DD');
      daysOfWeek.unshift({
        dateString: newDate,
        day: dayjs(newDate).date(),
        month: dayjs(newDate).month(),
        timestamp: dayjs(newDate).valueOf(),
        year: dayjs(newDate).year(),
      });
    }
  } else {
    for (let i = 0; i < 5; i++) {
      if (i < today.day()) {
        const newDate = today.subtract(i, 'day').format('YYYY-MM-DD');
        daysOfWeek.unshift({
          dateString: newDate,
          day: dayjs(newDate).date(),
          month: dayjs(newDate).month(),
          timestamp: dayjs(newDate).valueOf(),
          year: dayjs(newDate).year(),
        });
      } else {
        const newDate = today.add(i - today.day() + 1, 'day').format('YYYY-MM-DD');
        daysOfWeek.push({
          dateString: newDate,
          day: dayjs(newDate).date(),
          month: dayjs(newDate).month(),
          timestamp: dayjs(newDate).valueOf(),
          year: dayjs(newDate).year(),
        });
      }
    }
  }
  return daysOfWeek;
};

export const calculatePenaltyFeeIn = (runningTimeString: string): string => {
  const currentMoment = moment();
  const departureMoment = moment(runningTimeString, 'YYYY.MM.DD').format('YYYYMMDD');

  const current_date = moment().format('YYYYMMDD');
  const diff_days = Number(departureMoment) - Number(current_date);

  const current_hour = currentMoment.hours();

  if (diff_days > 1) {
    return '10%';
  }

  if (diff_days === 1 && current_hour < 22) {
    return '10%';
  }

  return '100%';
};

export const calculatePenaltyFeeOut = (runningTimeString: string): string => {
  const currentMoment = moment();
  const departureMoment = moment(runningTimeString, 'YYYY.MM.DD HH:mm');

  const diff_days = departureMoment.diff(currentMoment, 'day');

  const current_hour = currentMoment.hours();

  if (diff_days >= 1) {
    return '10%';
  }

  if (diff_days === 0 && current_hour < 16) {
    return '10%';
  }

  return '100%';
};
