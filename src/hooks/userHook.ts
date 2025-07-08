import {useMemo} from 'react';
import {useAppSelector} from '~store/storeHooks';

export const useUserHook = () => {
  const userData = useAppSelector(state => state?.userReducer) || {};
  const myLocation = useAppSelector(state => state?.coordinateReducer?.userCordinate);

  const {FCMToken, myDriverInfo, user, userToken} = userData;

  const userID = userToken?.id;
  const CMemberID = myDriverInfo?.id;

  const isLogin = useMemo(() => {
    if (userToken?.id && userToken?.password) {
      return true;
    } else {
      return false;
    }
  }, [userToken]);

  return {FCMToken, myDriverInfo, user, userToken, isLogin, userID, CMemberID, myLocation};
};

// 🔥 추가할 부분 (맨 마지막에)
export {useUserHook as userHook};
