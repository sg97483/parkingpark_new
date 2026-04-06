import axios from 'axios';
import {KEY_KAKAO} from '~constants/constant';
import {getNameAddressKakao} from '~utils/common';
import {getRealm} from './realm';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Parking {
  lat: number;
  lng: number;
  onedayTicketCost: number;
  garageName: string;
  limitedNumber: number;
  ticketPartnerYN: string;
}

const initializeAxios = () =>
  axios.create({
    baseURL: '',
    timeout: 10000,
    validateStatus: () => true,
    headers: {
      Authorization: `KakaoAK ${KEY_KAKAO}`,
    },
  });

const API_KAKAO = initializeAxios();

API_KAKAO.interceptors.response.use(response => response.data);

export const searchAddressKakao = async (text: string) => {
  try {
    const res: any = await API_KAKAO.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
      params: {
        query: text,
      },
    });
    const newData = [];

    for (let i = 0; i < (res.documents || []).length; i++) {
      const element = (res.documents || [])[i];
      newData.push({
        id: element.id,
        address: {address_name: element.address_name},
        address_name: element.address_name,
        road_address: {building_name: element.place_name},
        x: element.x,
        y: element.y,
      });
    }

    newData.sort((a: any, b: any) => {
      let nameA = getNameAddressKakao(a).toLowerCase();
      let nameB = getNameAddressKakao(b).toLowerCase();
      let matchA = nameA.includes(text.toLowerCase());
      let matchB = nameB.includes(text.toLowerCase());
      if (matchA && !matchB) {
        return -1;
      } else if (matchB && !matchA) {
        return 1;
      } else {
        return 0;
      }
    });

    // search parking
    const realm = await getRealm();
    const allData = realm.objects('Parking');
    const trimmedKeyword = text.trim();

    // creditCardYN === 'A' 인 주차장은 검색 결과(Realm 기반)에서도 제외
    const hideMarkerQuery = "(creditCardYN != 'A' OR creditCardYN == nil)";

    // 0순위: keyword 매칭, 1순위: 제휴(Y)+주차장명 매칭, 2순위: 카카오 결과
    const keywordMatches = allData
      .filtered(`${hideMarkerQuery} AND keyword CONTAINS[c] $0`, trimmedKeyword)
      .sorted([
        ['ticketPartnerYN', true],
        ['paylank', true],
      ]);

    const partnerMatches =
      trimmedKeyword == '서울역'
        ? allData
            .filtered(
              `${hideMarkerQuery} AND ticketPartnerYN = "Y" AND garageName CONTAINS[c] $0`,
              trimmedKeyword,
            )
            .sorted([['id', false]])
        : allData
            .filtered(
              `${hideMarkerQuery} AND ticketPartnerYN = "Y" AND garageName CONTAINS[c] $0`,
              trimmedKeyword,
            )
            .sorted([
              ['ticketPartnerYN', true],
              ['paylank', true],
            ]);

    const seen = new Set<number | string>();
    const mapRealmToList = (source: any[]) => {
      const list = [];
      for (let i = 0; i < source.length; i++) {
        const item = source[i];
        if (seen.has(item.id)) {
          continue;
        }
        seen.add(item.id);
        const address = `${item?.state || ''} ${item?.city || ''} ${
          item?.addressNew || item?.addressOld || ''
      }`;
        list.push({
          id: item.id,
        address: {address_name: address},
        address_name: address,
          road_address: {building_name: item?.garageName},
          x: item?.lng,
          y: item?.lat,
        isParking: true,
      });
        if (list.length >= 10) {
          // 상위 10개만 우선 노출
          break;
        }
      }
      return list;
    };

    const keywordList = mapRealmToList(keywordMatches as any);
    const partnerList = mapRealmToList(partnerMatches as any);

    // Kakao 결과에서도 중복 제거
    const kakaoList = newData.filter(item => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });

    const data =
      keywordList.length > 0
        ? [...keywordList, ...partnerList, ...kakaoList]
        : [...partnerList, ...kakaoList];
    return data as any;
  } catch (error) {
    return [];
  }
};

export const searchCoordinateKakao = async (longitude: number, latitude: number) => {
  try {
    const response: any = await API_KAKAO.get(
      'https://dapi.kakao.com/v2/local/geo/coord2address.json',
      {
        params: {
          input_coord: 'WGS84',
          x: longitude,
          y: latitude,
        },
      },
    );

    return response?.documents?.[0];
  } catch (error) {
    console.error(error);
    return [];
  }
};
export const getParkingNearest = (coord: Coordinate) =>
  new Promise<{nearestParking: Parking | null; distance: number}>(async (resolve, reject) => {
    try {
      const realm = await getRealm();
      const allData = realm.objects('Parking');

      let nearestDistance = Infinity;
      let nearestParking: Parking | null = null;

      allData.forEach(parking => {
        const parkingCoord = {latitude: Number(parking.lat), longitude: Number(parking.lng)};
        const distance = haversineDistance(coord, parkingCoord);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestParking = parking as any;
        }
      });

      resolve({
        nearestParking: nearestParking,
        distance: nearestDistance,
      } as any);
    } catch (error) {
      reject(null);
    }
  });

export default API_KAKAO;

const haversineDistance = (coords1: Coordinate, coords2: Coordinate): number => {
  const toRadian = (angle: number): number => (Math.PI / 180) * angle;
  const earthRadius = 6371000; // Bán kính Trái Đất tính bằng mét

  const dLat = toRadian(coords2.latitude - coords1.latitude);
  const dLng = toRadian(coords2.longitude - coords1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadian(coords1.latitude)) *
      Math.cos(toRadian(coords2.latitude)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c; // Kết quả tính bằng mét
};
