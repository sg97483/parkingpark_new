import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseQueryApi} from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import {BASE_URL} from '~constants/constant';
const customBaseQuery: any = async (args: any, api: BaseQueryApi, extraOptions: {}) => {
  try {
    const baseUrl = `${BASE_URL}`;
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    const headers: any = {
      'Content-Type': 'multipart/form-data',
    };
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    const reqBody: any = {};
    if (args.method) {
      reqBody.method = args.method;
    }
    console.log('🚀 ~ file: customFetchBaseQuery.ts:22 ~ headers:', headers);
    if (headers && Object.keys(headers).length > 0) {
      reqBody.headers = headers;
    }
    reqBody.body = args.body;

    // if (args.body && JSON.stringify(args.body)) {
    //   reqBody.body = JSON.stringify(args.body);
    // }
    console.log('🚀 ~ file: customFetchBaseQuery.ts:27 ~ reqBody:', reqBody);
    const reqUrl = baseUrl + (typeof args === 'string' ? args : args.url || '');

    const result = await fetch(reqUrl, reqBody);
    console.log('🚀 ~ file: customFetchBaseQuery.ts:32 ~ result:', result);
    const data = await result.text();
    console.log('🚀 ~ file: customFetchBaseQuery.ts:34 ~ data:', data);
    return {data: JSON.parse(data)};
  } catch (error: any) {
    let errContent = 'Error';
    if (error?.text) {
      errContent = await error.text();
    } else if (error?.bodyString) {
      errContent = JSON.parse(error?.bodyString);
    } else if (error?.message) {
      errContent = error?.message;
    }
    console.log(errContent, error);
    return {error: errContent};
  }
};

export default customBaseQuery;
