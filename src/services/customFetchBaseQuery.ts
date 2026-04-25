import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseQueryApi} from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import {BASE_URL} from '~constants/constant';

function safeJsonParse(text: string): {ok: true; value: any} | {ok: false; error: unknown} {
  const trimmed = (text ?? '').trim();
  if (!trimmed) {
    return {ok: true, value: null};
  }
  try {
    return {ok: true, value: JSON.parse(trimmed)};
  } catch (error) {
    return {ok: false, error};
  }
}

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
    const text = await result.text();
    console.log('🚀 ~ file: customFetchBaseQuery.ts:34 ~ data:', text);

    const parsed = safeJsonParse(text);
    if (!parsed.ok) {
      return {
        error: {
          status: result.status,
          message: 'Invalid JSON response',
          raw: text,
        },
      };
    }

    return {data: parsed.value};
  } catch (error: any) {
    let errContent = 'Error';
    if (error?.text) {
      errContent = await error.text();
    } else if (error?.bodyString) {
      const parsed = safeJsonParse(String(error?.bodyString ?? ''));
      errContent = parsed.ok ? parsed.value : String(error?.bodyString ?? '');
    } else if (error?.message) {
      errContent = error?.message;
    }
    console.log(errContent, error);
    return {error: errContent};
  }
};

export default customBaseQuery;
