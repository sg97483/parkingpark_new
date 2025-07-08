import {Coord} from '@mj-studio/react-native-naver-map';

/*
Congestion code
1 - Clear
2 - Slow-moving
3 - Heavily-congested
*/

export interface DrivingSectionModel {
  congestion: number;
  pointIndex: number;
  pointCount: number;
}

export interface NaverDrivingModel {
  path: Coord[];
  duration: number; // minutes
  section: DrivingSectionModel[]; //congestion
  taxiFare: number;
  distance: number; // meters
}
