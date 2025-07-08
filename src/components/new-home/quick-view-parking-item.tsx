import React, {memo} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {ParkingMapProps} from '~constants/types';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '~navigators/router';
import {colors} from '~styles/colors';
import {heightScale, scale, widthScale} from '~styles/scaling-utils';
import {PADDING} from '~constants/constant';
import HStack from '~components/h-stack';
import {IMAGES} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {getNumberWithCommas} from '~utils/numberUtils';
import {strings} from '~constants/strings';
import {
  useGetParkingLimitQuery,
  useParkingDetailsQuery,
  useTicketInfoQuery,
} from '~services/parkingServices';
import FastImage from 'react-native-fast-image';

interface Props {
  item: ParkingMapProps;
  isSelected?: boolean; // 추가: 선택 여부
}

const QuickViewParkingItem: React.FC<Props> = memo(props => {
  const {item, isSelected = false} = props;

  const navigation: UseRootStackNavigation = useNavigation();

  // 선택된 항목일 때만 쿼리 실행 (skip: !isSelected)
  const {data: parkingDetail, isFetching: isFetchingParkingLot} = useParkingDetailsQuery(
    {id: item?.id},
    {skip: !isSelected},
  );
  const {data: parkingLimit, isFetching: isFetchingLimit} = useGetParkingLimitQuery(
    {parkingLotId: item?.id},
    {skip: !isSelected},
  );
  const {data: ticketInfo, isFetching: isFetchingTicketInfo} = useTicketInfoQuery(
    {id: item?.id},
    {skip: !isSelected},
  );

  const isLoading = isFetchingLimit || isFetchingParkingLot || isFetchingTicketInfo;

  const getDetailText = () => {
    if (parkingDetail?.wifiYN) {
      switch (parkingDetail?.wifiYN) {
        case IS_ACTIVE.YES:
          return '기계식';
        case IS_ACTIVE.NO:
          return '자주식';
        case IS_ACTIVE.A:
          return '혼합(자주,기계)';
        default:
          return '';
      }
    } else {
      return '';
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate(ROUTE_KEY.ParkingDetails, {id: item?.id})}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.placeholderViewWrapper}>
            <ActivityIndicator color={colors.red} />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <HStack style={{alignItems: 'flex-start', flex: 1}}>
              {parkingDetail?.image1 ? (
                <FastImage
                  source={{uri: parkingDetail?.image1}}
                  style={{
                    width: widthScale(100),
                    height: widthScale(100),
                    borderRadius: widthScale(8),
                  }}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={IMAGES.logo_parking_park}
                  style={{
                    width: widthScale(100),
                    height: widthScale(100),
                    borderRadius: widthScale(8),
                  }}
                />
              )}

              <View style={{flex: 1, marginLeft: widthScale(10)}}>
                {item?.brand ? (
                  <CustomText
                    family={FONT_FAMILY.BOLD}
                    size={FONT.TITLE_3}
                    string={`${item?.brand} ${item?.garageName}`}
                    numberOfLines={2}
                  />
                ) : (
                  <CustomText
                    family={FONT_FAMILY.BOLD}
                    size={FONT.TITLE_3}
                    string={`${item?.garageName}`}
                    numberOfLines={2}
                  />
                )}
                <CustomText textStyle={{marginVertical: heightScale(5)}} string={getDetailText()} />
                <CustomText string={parkingLimit?.textField || ''} numberOfLines={2} />
              </View>
            </HStack>

            {ticketInfo && ticketInfo?.length > 0 ? (
              <View>
                <Text style={{fontSize: scale(18), textAlign: 'right'}} numberOfLines={1}>
                  {ticketInfo[0]?.ticketName}{' '}
                  <Text style={{fontFamily: FONT_FAMILY.BOLD}}>
                    {`${getNumberWithCommas(Number(ticketInfo[0]?.ticketAmt))}${
                      strings?.general_text?.won
                    }`}
                  </Text>
                  {' (다른주차권보기)'}
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
});

export default QuickViewParkingItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    borderRadius: widthScale(8),
    padding: PADDING,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholderViewWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
