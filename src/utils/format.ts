import {Moment} from 'moment';

export const formatDistance = (distance: number) => {
  if (distance >= 1000) {
    return (distance / 1000.0).toFixed(1) + ' km';
  } else if (distance >= 100) {
    return Math.round(distance) + ' m';
  } else {
    return distance.toFixed(2) + ' m';
  }
};

export const formatKoreanDate = (date: Moment) => {
  return `${date.format('YYYY')}년${date.format('MM')}}월 ${date.format('DD')}일 ${date.format(
    'hh',
  )}시 ${date.format('mm')}분`;
};
