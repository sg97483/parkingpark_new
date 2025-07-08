import axios from 'axios';
import {BASE_URL} from '~constants/constant';

let API = axios.create({
  baseURL: BASE_URL,
  timeout: 25000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  validateStatus: () => true,
});

//! log URL API
API.interceptors.response.use(response => {
  if (response?.request?.responseURL) {
    console.log(
      'URL ->',
      '\u001b[34m' + decodeURI(response?.request?.responseURL.replace(BASE_URL, '')),
    );
  }
  return response;
});
export default API;
export const setDefaultToken = (token: string) => {
  API.defaults.headers.common.Authorization = `Bearer ${token}`;
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};
