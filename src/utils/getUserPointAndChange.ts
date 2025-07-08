import {UserProps} from '~constants/types';

export const getUserPointAndChange = (
  userInfo: UserProps,
): {
  userPoint: number;
  userCharge: number;
} => {
  const mPoint = Number(userInfo?.mpoint) || 0;
  let usePoint = 0;
  if (userInfo?.usePointSum) {
    usePoint = Number(userInfo?.usePointSum);
  }

  const mCharge = Number(userInfo?.chargeMoney) || 0;

  let mChargeSum = 0;
  if (userInfo?.usePointSumSklent) {
    mChargeSum = Number(userInfo?.usePointSumSklent);
  }

  let cancelPoint = 0;
  if (userInfo?.cancelPoint) {
    cancelPoint = Number(userInfo?.cancelPoint);
  }

  let cancelCharge = 0;
  if (userInfo?.cancelPointSklent) {
    cancelCharge = Number(userInfo?.cancelPointSklent);
  }

  const userPoint = mPoint - usePoint + cancelPoint || 0;
  const userCharge = mCharge - mChargeSum + cancelCharge || 0;

  return {userPoint, userCharge};
};
