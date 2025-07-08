import {IS_ACTIVE} from '~constants/enum';

export interface CarModel {
  id: number;
  carColor: string;
  carModel: string;
  carNumber: string;
  carYear: string;
  mainCarYN: IS_ACTIVE;
  carCompany: string;
}
