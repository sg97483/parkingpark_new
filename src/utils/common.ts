import {groupBy} from 'lodash';
import {Linking} from 'react-native';
import {MessageGroupByDateModel, MessageModel} from '~/model/chat-model';
import {IS_ANDROID} from '~constants/constant';

export const handleCallHotLine = (hotlineNumber: string) => {
  let phoneNumber = hotlineNumber;
  if (!IS_ANDROID) {
    phoneNumber = `telprompt:${hotlineNumber}`;
  } else {
    phoneNumber = `tel:${hotlineNumber}`;
  }
  Linking.openURL(phoneNumber);
};

export const generateFileName = (): string => {
  const currentDate = new Date();
  const formattedDate = currentDate
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, -3);
  const randomInt = Math.floor(Math.random() * 10);
  return formattedDate + randomInt.toString();
};

export const groupMessageDataByDate = (data: MessageModel[]): MessageGroupByDateModel[] => {
  const groupedData: Record<string, MessageModel[]> = groupBy(data, message => {
    const date = new Date(message.timestamp);
    return date.toISOString().split('T')[0];
  });

  return Object.entries(groupedData)
    .map(([date, messages]) => ({
      date,
      messages,
    }))
    .reverse();
};

export const makeCommaNumber = (input: any) => {
  try {
    return new Intl.NumberFormat('en-US').format(input);
  } catch (error) {
    return '';
  }
};

export const formatPhoneNumber = (inputString: string): string => {
  return inputString?.toString()?.replace(/\B(?=(\d{4})+(?!\d))/g, '-');
};

export const getNameAddressKakao = (data: any) => {
  if (data) {
    const address_name =
      data?.road_address?.address_name || data?.address_name || data?.address?.address_name;
    const buildingName = data?.road_address?.building_name || address_name;

    return buildingName;
  } else {
    return '';
  }
};

export const getSubNameAddressKakao = (data: any) => {
  const address_name =
    data?.road_address?.address_name || data?.address_name || data?.address?.address_name;
  const content = data?.road_address?.building_name ? address_name : '';

  return content;
};
