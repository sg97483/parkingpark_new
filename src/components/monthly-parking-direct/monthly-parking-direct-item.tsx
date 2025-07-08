import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {MonthlyParkingDirectProps} from '~constants/types';
import HStack from '~components/h-stack';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {BASE_URL, PADDING} from '~constants/constant';
import CustomText from '~components/custom-text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {getNumberWithCommas} from '~utils/numberUtils';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {useGetMonthlyParkingDirectImageQuery} from '~services/monthlyParkingDirectServices';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '~navigators/router';
import {strings} from '~constants/strings';
import {useAppSelector} from '~store/storeHooks';
import {showMessage} from 'react-native-flash-message';

interface Props {
  item: MonthlyParkingDirectProps;
}

const MonthlyParkingDirectItem: React.FC<Props> = memo(props => {
  const {item} = props;
  const navigation: UseRootStackNavigation = useNavigation();
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const {data} = useGetMonthlyParkingDirectImageQuery(
    {
      userID: Number(item?.s_memberId),
    },
    {skip: !item?.s_memberId},
  );

  const imageID =
    data &&
    (data?.find(it => it?.bbsId === item?.s_no)?.carImage1Id ||
      data?.find(it => it?.bbsId === item?.s_no)?.carImage2Id ||
      data?.find(it => it?.bbsId === item?.s_no)?.carImage3Id ||
      data?.find(it => it?.bbsId === item?.s_no)?.carImage4Id);

  return (
    <TouchableOpacity
      onPress={() => {
        if (userToken?.id && userToken?.password) {
          navigation.navigate(ROUTE_KEY.MonthlyParkingDirectDetails, {
            data: item,
            images: data?.find(it => it?.bbsId === item?.s_no) || undefined,
          });
        } else {
          navigation.navigate(ROUTE_KEY.Login);
          showMessage({
            message: strings?.general_text?.login_first,
          });
          return;
        }
      }}>
      <HStack style={styles.container}>
        <View style={styles.imageWrapper}>
          {imageID ? (
            <Image
              style={styles.imageWrapper}
              source={{
                uri: `${BASE_URL}photo/view?id=${imageID}&thumbnail=true`,
              }}
            />
          ) : null}
        </View>
        <View style={styles.rightContent}>
          <HStack>
            <View style={{flex: 1}}>
              <CustomText
                numberOfLines={1}
                string={item?.s_subject}
                family={FONT_FAMILY.SEMI_BOLD}
                textStyle={{marginBottom: heightScale(5)}}
              />
            </View>

            <CustomText
              string={`(${item?.replyCount})`}
              color={colors.darkBlue}
              textStyle={{
                marginHorizontal: PADDING / 2,
              }}
            />

            <HStack style={{minWidth: widthScale(50), justifyContent: 'flex-end'}}>
              <Icon name="eye-outline" size={widthScale(20)} />
              {item?.s_shareSpace ? <CustomText string={` ${item?.s_shareSpace}`} /> : null}
            </HStack>
          </HStack>
          <CustomText string={item?.s_garageAddress} textStyle={{marginBottom: heightScale(13)}} />
          <HStack>
            <HStack style={{flexGrow: 1}}>
              <CustomText
                string={
                  item?.carNumber
                    ? `${item?.memberNic} / ${item?.carNumber.substring(
                        0,
                        item?.carNumber?.length - 2,
                      )}**`
                    : `${item?.memberNic} / ${strings?.general_text?.do_not_exist}`
                }
                size={FONT.CAPTION_3}
              />
              <CustomText
                string={`  ${moment(item?.regdate * 1000).format('MM.DD HH:mm')}`}
                size={FONT.CAPTION_3}
                color={colors.darkGray}
              />
            </HStack>
            <View style={{flexShrink: 1}}>
              {Number(item?.s_garagePay.replace(/,/g, '')) ? (
                <CustomText
                  string={`${getNumberWithCommas(Number(item?.s_garagePay?.replace(/,/g, '')))}${
                    strings?.general_text?.won
                  }`}
                  color={colors.red}
                  family={FONT_FAMILY.BOLD}
                />
              ) : (
                <CustomText
                  string={item?.s_garagePay}
                  color={colors.red}
                  family={FONT_FAMILY.BOLD}
                />
              )}
            </View>
          </HStack>
        </View>
      </HStack>
    </TouchableOpacity>
  );
});

export default MonthlyParkingDirectItem;

const styles = StyleSheet.create({
  container: {
    padding: PADDING / 2,
  },
  imageWrapper: {
    borderWidth: widthScale(1),
    borderColor: colors.gray,
    width: widthScale(85),
    aspectRatio: 1,
  },
  rightContent: {
    flex: 1,
    marginLeft: PADDING / 2,
  },
});
