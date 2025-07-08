import {Dimensions, Platform} from 'react-native';
import {heightScale, widthScale, widthScale1} from '~styles/scaling-utils';
export const {width, height} = Dimensions.get('screen');

export const BASE_URL = 'http://cafe.wisemobile.kr:8080/';
export const BASE_URL2 = 'http://192.168.0.29:8080/parkingpark/';
export const BASE_URL_NAVER = 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/';

export const VERIFY_PHONE_NUMBER_WEBVIEW_URL =
  'https://cafe.wisemobile.kr/imobile/check/check_pnum_main_android_t.php';
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
export const WIDTH = width;
export const HEIGHT = height;
export const LIMIT_ITEM = 10;
export const PADDING = widthScale(20);
export const PADDING1 = widthScale1(20);
export const PADDING_HEIGHT = heightScale(15);
export const URL_HYUNDAI =
  'https://prd.kr-ccapi.hyundai.com/api/v1/user/oauth2/authorize?client_id=971e18fc-b77a-46d1-a495-7f53228fd12c&redirect_uri=http://cafe.wisemobile.kr/imobile/valet/profile_hyun_con.php&response_type=code&state=';
export const URL_KID =
  'https://prd.kr-ccapi.kia.com/api/v1/user/oauth2/authorize?client_id=754ea69c-79e9-4415-a929-6825bc156e53&redirect_uri=http://cafe.wisemobile.kr/imobile/valet/profile_kia_con.php&response_type=code&state=';
export const URL_GENESIS =
  'https://accounts.genesis.com/api/authorize/ccsp/oauth?clientId=2db76deb-4615-46c5-a6ef-f36d7af8dba7&host=http://cafe.wisemobile.kr&state=';
export const URL_CHECK_PNUM =
  'https://cafe.wisemobile.kr/imobile/check/check_pnum_main_android_t.php';
export const URL_CARPOOL_GUIDE =
  'http://cafe.wisemobile.kr/imobile/partner_list/theme_carpool_guide.php';
export const WEATHER_APP_GOOGLE_PLAY =
  'https://play.google.com/store/apps/details?id=com.wisemobile.openweather';
export const WEATHER_APP_STORE =
  'https://apps.apple.com/us/app/오픈웨더-날씨-기상청-여행날씨-날씨카메라-알람/id1014964277';

export const URL_COVID_GUIDE = 'http://cafe.wisemobile.kr/imobile/covid_guide.php';
export const URL_CARPOOL_ADDRESS_SEARCH =
  'http://cafe.wisemobile.kr/imobile/carpool_address_search.html';

export const URL_API_SEARCH_ADDRESS_KAKAO = 'https://dapi.kakao.com/v2/local/search/address.json';

export const BUNDLE_ID = 'kr.wisemobile.parking';

export const NAVER_KEY = {
  appName: '파킹박',
  consumerKey: 'YFo9o9INxTOezx7QNbba',
  consumerSecret: 'f6wfDAsa_f',
  serviceUrlScheme: IS_IOS ? BUNDLE_ID : '',
  isNaverAppOauthEnable: true,
};

export const KEY_KAKAO = 'c1dcfd5c80912db0eaa585fe3c81e055';

export const API_KEY_ID_NAVER = 'taykdvx2ps';
export const API_KEY_NAVER = 'QG5Ne2Xb3P3MPp21N0gkJcMpmNJfNMN93S8MB8cT';

export const MAXIMUM_DISTANCE = 80; // km
