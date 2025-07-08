import moment from 'moment';
import {ICONS} from '~/assets/images-path';
import {solar} from '~constants/data';
import {MarkerProps} from '~constants/types';
import {widthScale} from '~styles/scaling-utils';

const isHoliday = solar?.includes(moment().format('MMDD')) ?? false;
const currentDay = moment().day();
const dayOfWeek = currentDay === 0 || currentDay === 6 || isHoliday ? '주말' : '평일';

const getCostIconRes = (charge: number, category: string): MarkerProps => {
  const baseWidth = widthScale(257 / 4);
  const baseHeight = widthScale(152 / 4);

  if (!charge) {
    const source = category === '공영' ? ICONS.icon_public : ICONS.icon_private;
    return {source, width: baseWidth, height: baseHeight};
  }

  const iconName = `icon_${charge}` as keyof typeof ICONS;

  if (ICONS[iconName]) {
    return {
      source: ICONS[iconName],
      width: baseWidth,
      height: baseHeight,
    };
  }

  const defaultSource = category === '공영' ? ICONS.icon_public : ICONS.icon_private;
  return {source: defaultSource, width: baseWidth, height: baseHeight};
};

const getMonthIconRes = (icon: number): MarkerProps => {
  const width = widthScale(360 / 4);
  const height = widthScale(232 / 4);
  const defaultMarker = {source: ICONS.icon_month_parkingpark, width, height};

  if (!icon || icon > 0) {
    return defaultMarker;
  }

  const price = Math.abs(icon) - 4;
  const iconName = `month${price}` as keyof typeof ICONS;

  if (price > 0 && ICONS[iconName]) {
    return {
      source: ICONS[iconName],
      width: width,
      height: height,
    };
  }

  return defaultMarker;
};

const getDayPriceIconRes = (price: number): MarkerProps => {
  const width = widthScale(360 / 4);
  const height = widthScale(152 / 4);
  const defaultMarker = {source: ICONS.icon_day_parkingpark, width, height};

  if (!price || price < 0) {
    return defaultMarker;
  }

  const iconName = `day${price}` as keyof typeof ICONS;

  if (ICONS[iconName]) {
    return {
      source: ICONS[iconName],
      width: width,
      height: height,
    };
  }

  return defaultMarker;
};

export const getMarker = (
  icon: number | undefined,
  charge: number | undefined,
  weekendPrice: number,
  category: string | undefined,
): MarkerProps | undefined => {
  if (icon != null && icon < 0) {
    if (icon > -10) {
      switch (icon) {
        case -1:
          return {source: ICONS.icon_free, width: widthScale(272 / 4), height: widthScale(152 / 4)};
        case -2:
        case -3:
        case -4:
        case -5:
          return getCostIconRes(charge ?? 0, category ?? '');
        case -6:
          return {
            source: ICONS.icon_position_greencar,
            width: widthScale(375 / 4),
            height: widthScale(152 / 4),
          };
        case -7:
          return {source: ICONS.icon_elec, width: widthScale(272 / 4), height: widthScale(152 / 4)};
        case -8:
          return {
            source: ICONS.icon_parkingpark,
            width: widthScale(135 / 2),
            height: widthScale(92 / 2),
          };
        case -9:
          return {
            source: ICONS.icon_sharepark,
            width: widthScale(272 / 4),
            height: widthScale(152 / 4),
          };
        default:
          return getCostIconRes(charge ?? 0, category ?? '');
      }
    } else {
      const iconStr = String(icon);
      if (iconStr.endsWith('4')) {
        return getMonthIconRes(icon);
      }
      if (iconStr.endsWith('3')) {
        if (dayOfWeek === '주말') {
          return getDayPriceIconRes(weekendPrice);
        } else {
          const weekdayPrice = Math.floor(Math.abs(icon) / 10) * 10;
          return getDayPriceIconRes(weekdayPrice);
        }
      }
      switch (icon) {
        case -10007:
          return {source: ICONS.icon_event, width: widthScale(195 / 2), height: widthScale(89 / 2)};
        case -10008:
          return {
            source: ICONS.icon_recommend,
            width: widthScale(195 / 2),
            height: widthScale(89 / 2),
          };
        default:
          return getCostIconRes(charge ?? 0, category ?? '');
      }
    }
  }

  const freeWidth = widthScale(272 / 4);
  const conditionWidth = widthScale(292 / 4);
  if (category === '무료') {
    return {source: ICONS.icon_free, width: freeWidth, height: widthScale(152 / 4)};
  }
  if (category === '조건부무료1') {
    return {source: ICONS.icon_cafe, width: freeWidth, height: widthScale(152 / 4)};
  }
  if (category === '조건부무료2') {
    return {source: ICONS.icon_mart, width: freeWidth, height: widthScale(152 / 4)};
  }
  if (category === '조건부무료3') {
    return {source: ICONS.icon_restaurant, width: conditionWidth, height: widthScale(152 / 4)};
  }
  if (category === '조건부무료4') {
    return {source: ICONS.icon_department, width: conditionWidth, height: widthScale(152 / 4)};
  }

  return getCostIconRes(charge ?? 0, category ?? '');
};
