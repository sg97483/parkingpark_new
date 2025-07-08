import {CordinateProps} from '~constants/types';
import Geolocation from 'react-native-geolocation-service';
import {Alert, Linking, PermissionsAndroid} from 'react-native';
import {IS_ANDROID, IS_IOS} from '~constants/constant';

export const requestLocationPermisstion = () => {
  const getAlert = () => {
    Alert.alert(
      '위치 액세스 거부되었습니다',
      '파킹박이 당신의 위치를 ​​파악할 수 있도록 위치 서비스를 켜십시오.',
      [{text: '설정으로 바로 가기', onPress: () => Linking.openSettings()}],
    );
  };

  return new Promise<boolean>(async (resolve, reject) => {
    if (IS_ANDROID) {
      const granted = await PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION');
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        resolve(true);
      } else {
        getAlert();
        reject(false);
      }
    }
    if (IS_IOS) {
      const status = await Geolocation.requestAuthorization('whenInUse');

      if (status === 'granted') {
        resolve(true);
      }

      if (status === 'denied' || status === 'disabled') {
        getAlert();
        reject(false);
      }
    }
  });
};

export const getMyLocation = () => {
  return new Promise<CordinateProps>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const data: CordinateProps = {
          lat: position?.coords?.latitude,
          long: position?.coords?.longitude,
        };
        resolve(data);
      },
      error => {
        reject(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
      },
    );
  });
};

export const getLocationDelta = (lat: number, long: number, accuracy: number) => {
  const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
  const circumference = (40075 / 360) * 1000;

  const latDelta = accuracy * (1 / (Math.cos(lat) * circumference));
  const lonDelta = accuracy / oneDegreeOfLongitudeInMeters;

  return {
    latitude: lat,
    longitude: long,
    latitudeDelta: Math.max(0, latDelta),
    longitudeDelta: Math.max(0, lonDelta),
  };
};

export const deg2rad = (deg: number): number => {
  return (deg * Math.PI) / 180.0;
};

export const rad2deg = (rad: number) => {
  return rad / (Math.PI / 180);
};

export const getDistance = (defaultDistanceKm?: number): number => {
  if (defaultDistanceKm == 1) {
    return 0.9999999875;
  } else if (defaultDistanceKm == 2) {
    return 0.9999999507;
  } else if (defaultDistanceKm == 3) {
    return 0.999999889;
  } else {
    return 0.9999999507; //default 2km
  }
};

export const getDistanceFromTwoPosition = (
  from: {lat: number; long: number},
  to: {lat: number; long: number},
) => {
  return getDistanceFromTwoLatLong(from.lat, from.long, to.lat, to.long);
};

export const getDistanceFromTwoLatLong = (
  lat1: number,
  long1: number,
  lat2: number,
  long2: number,
) => {
  let theta: number;
  let dist: number;
  theta = long1 - long2;

  dist =
    Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
  dist = Math.acos(dist);
  dist = rad2deg(dist);
  dist = dist * 60 * 1.1515;
  dist = dist * 1609.344;

  return dist;
};
