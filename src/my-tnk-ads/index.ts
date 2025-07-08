import {NativeModules} from 'react-native';

export enum AdsCode {
  CLOSE_SIMPLE = 0,
  CLOSE_CLICK = 1,
  CLOSE_EXIT = 2,
  CLOSE_REFUSE_PRIVACY = 3,
  FAIL_NO_AD = -1,
  FAIL_NO_IMAGE = -2,
  FAIL_TIMEOUT = -3,
  FAIL_CANCELED = -4,
  FAIL_NOT_PREPARED = -5,
  FAIL_SYSTEM = -9,
}

interface MyTnkAdsModule {
  exitDialogTnkAdOpen(): Promise<AdsCode>;
}

const {MyTnkAdsModule} = NativeModules;

export default MyTnkAdsModule as MyTnkAdsModule;
