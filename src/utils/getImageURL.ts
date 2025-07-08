import {BASE_URL} from '~constants/constant';

export const getImageURL = (id: number, thumbnail: boolean) => {
  if (id) {
    return `${BASE_URL}photo/view?id=${id}&thumbnail=${thumbnail}`;
  }
  return '';
};
