import RNFS from 'react-native-fs';
import Realm from 'realm';
import {IS_ANDROID} from '~constants/constant';
import {PARKING_FILTER_TYPE} from '~constants/enum';
import {CordinateProps, ParkingMapProps} from '~constants/types';
import {CodeRegionSchema} from '~schemas/code-region-schema';
import {FirebaseUserSchema, ParkingSchema} from '~schemas/parking-schema';
import {deg2rad, getDistanceFromTwoLatLong} from '~utils/getMyLocation';

export const getRealm = async () => {
  return Realm.open({
    schema: [ParkingSchema, FirebaseUserSchema],
  });
};

const readCSVFile = async (path: string) => {
  const data = IS_ANDROID
    ? await RNFS.readFileAssets(path, 'utf8')
    : await RNFS.readFile(`${RNFS.MainBundlePath}/code_region.csv`, 'utf8');
  const rows = data.trim().split(/\r?\n/);
  const headers = rows[0].split(',');
  const contents = rows.slice(1).map(row => row.split(','));
  return contents.map(row => row.reduce((acc, curr, i) => ({...acc, [headers[i]]: curr}), {}));
};

export const initCodeRegionRealm = async (userCordinate: CordinateProps) => {
  const cosLat = Math.cos(deg2rad(Number(userCordinate?.lat)));
  const sinLat = Math.sin(deg2rad(Number(userCordinate?.lat)));
  const cosLng = Math.cos(deg2rad(Number(userCordinate?.long)));
  const sinLng = Math.sin(deg2rad(Number(userCordinate?.long)));

  const myData = await readCSVFile('code_region.csv');

  const realm = await Realm.open(
    IS_ANDROID
      ? {
          path: '/data/data/kr.wisemobile.parking/files/coderegion.realm',
          schema: [CodeRegionSchema],
        }
      : {
          path: `${RNFS.DocumentDirectoryPath}/coderegion.realm`,
          schema: [CodeRegionSchema],
        },
  );

  realm.write(() => {
    realm.delete(realm.objects('CodeRegion'));
    myData.forEach(item => {
      const data: Record<string, string> = item;
      const result: Record<string, number | string> = {};

      for (const key in data) {
        const value = data[key];
        if (
          key === '"code"' ||
          key === '"lat"' ||
          key === '"lng"' ||
          key === '"coslat"' ||
          key === '"coslng"' ||
          key === '"sinlat"' ||
          key === '"sinlng"'
        ) {
          result[key.replace(/"/g, '')] = parseFloat(value.replace(/"/g, ''));
        } else {
          result[key.replace(/"/g, '')] = value.replace(/"/g, '');
        }
      }

      const distance =
        cosLat *
          Number(result?.coslat) *
          (cosLng * Number(result?.coslng) + sinLng * Number(result?.sinlng)) +
        sinLat * Number(result?.sinlat);

      realm.create('CodeRegion', {
        ...result,
        distance: distance,
      });
    });
  });

  realm.close();
};

export const getCodeRegionRealm = () => {
  return Realm.open({
    schema: [CodeRegionSchema],
    path: IS_ANDROID
      ? '/data/data/kr.wisemobile.parking/files/coderegion.realm'
      : `${RNFS.DocumentDirectoryPath}/coderegion.realm`,
  });
};

export const fetchParkingList = async ({
  center,
  parkingFilter,
}: {
  center: {lat: number; long: number};
  parkingFilter: PARKING_FILTER_TYPE[];
}): Promise<ParkingMapProps[]> => {
  const realm = await getRealm();
  const data = realm.objects<ParkingMapProps>('Parking');

  const distanceKM = 0.9999999875;

  const cosLat = Math.cos(deg2rad(center.lat));
  const cosLong = Math.cos(deg2rad(center.long));
  const sinLat = Math.sin(deg2rad(center.lat));
  const sinLong = Math.sin(deg2rad(center.long));

  const baseQuery = `(${cosLat} * coslat * (${cosLong} * coslng + ${sinLong} * sinlng) + ${sinLat} * sinlat) >= ${distanceKM}`;
  let filteredData: ParkingMapProps[] = [];

  if (Array.isArray(parkingFilter) && parkingFilter.length > 0) {
    const filterClauses: string[] = parkingFilter
      .map(filterType => {
        switch (filterType) {
          case PARKING_FILTER_TYPE.ALLOWBOOKING:
            return "(limitedNumber !=0 AND ticketPartnerYN == 'Y')";
          case PARKING_FILTER_TYPE.ALLOWBOOKINGPARTNER:
            return "(ticketPartnerYN == 'Y')";
          case PARKING_FILTER_TYPE.WEEKDAY:
            return "weekdayYN == 'Y'";
          case PARKING_FILTER_TYPE.WEEKEND:
            return "weekendYN == 'Y'";
          case PARKING_FILTER_TYPE.NIGHT:
            return "nightYN == 'Y'";
          case PARKING_FILTER_TYPE.MONTH:
            return "monthYN == 'Y'";
          case PARKING_FILTER_TYPE.WEEKDAYTIME:
            return "weekdayTimeYN == 'Y'";
          case PARKING_FILTER_TYPE.WEEKENDTIME:
            return "weekendTimeYN == 'Y'";
          case PARKING_FILTER_TYPE.DINNER:
            return "dinnerYN == 'Y'";
          case PARKING_FILTER_TYPE.CONNIGHT:
            return "conNightYN == 'Y'";
          case PARKING_FILTER_TYPE.CARD:
            return '((id >= 33001 AND id <= 33074) OR (id >= 35492 AND id <= 45000))';
          case PARKING_FILTER_TYPE.ELEC:
            return '(id >= 50001 AND id <= 55000)';
          case PARKING_FILTER_TYPE.FREE:
            return "category == '무료'";
          case PARKING_FILTER_TYPE.GREENCAR:
            return 'category CONTAINS[c] "그린카"';
          case PARKING_FILTER_TYPE.IFFREE:
            return 'category CONTAINS[c] "조건부무료"';
          case PARKING_FILTER_TYPE.PRIVATE:
            return "category == '민영'";
          case PARKING_FILTER_TYPE.PUBLIC:
            return 'category CONTAINS[c] "공영"';
          case PARKING_FILTER_TYPE.SHARECAR:
            return 'category CONTAINS[c] "공유주차장"';
          default:
            return '';
        }
      })
      .filter(Boolean);

    let plusString = '';
    if (filterClauses.length > 0) {
      plusString = filterClauses.join(' OR ');
    }

    if (plusString) {
      const query = baseQuery + ` AND (${plusString})`;
      try {
        // 👇 이렇게 수정해주세요.
        const results = Array.from(data.filtered(query)); // 1. 먼저 쿼리 결과를 변수에 담습니다.

        // 3. 그 다음, 결과 변수를 가지고 나머지 작업을 합니다.
        filteredData = results
          .map(item => ({
            ...item,
            _distance: getDistanceFromTwoLatLong(center.lat, center.long, item.lat, item.lng),
          }))
          .sort((a, b) => a._distance - b._distance)
          .slice(0, 70);
      } catch (e) {
        console.error('[디버그 4-2] Realm 쿼리 중 에러:', e, 'Query:', query); // 4. 에러 로그를 추가합니다.
      }
    }
  } else {
    const partnerList = Array.from(data.filtered(baseQuery + " AND ticketPartnerYN == 'Y'"));
    const nonPartnerList = Array.from(data.filtered(baseQuery + " AND ticketPartnerYN != 'Y'"))
      .map(item => ({
        ...item,
        _distance: getDistanceFromTwoLatLong(center.lat, center.long, item.lat, item.lng),
      }))
      .sort((a, b) => a._distance - b._distance)
      .slice(0, 100);

    const partnerIds = new Set(partnerList.map(item => item.id));
    filteredData = [...partnerList, ...nonPartnerList.filter(item => !partnerIds.has(item.id))];
  }

  return filteredData;
};
