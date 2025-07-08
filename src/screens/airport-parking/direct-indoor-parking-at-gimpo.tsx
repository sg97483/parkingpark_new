import React, {memo, useEffect, useState} from 'react';
import {ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IMAGES} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ParkingMapProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {getRealm} from '~services/realm';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getValetParkingNameByID} from '~utils/valetParkingUtils';

const DirectIndoorParkingAtGimpo = memo(
  (props: RootStackScreenProps<'DirectIndoorParkingAtGimpo'>) => {
    const {navigation} = props;

    const [data, setData] = useState<ParkingMapProps[]>([]);

    const loadParkingAtIncheon = async () => {
      const realm = await getRealm();
      const data = realm.objects('Parking');

      const results = data.filtered("id IN {'70007','70008','70009','70010'}") as any;
      setData(results);
    };

    useEffect(() => {
      loadParkingAtIncheon();
    }, []);

    return (
      <FixedContainer edges={['left', 'right']}>
        {/* <CustomHeader
          text="인천공항 직접(셀프)주차 서비스"
          contentHeaderStyle={styles.header}
        /> */}
        <ImageBackground source={IMAGES.valet_bg} resizeMode="stretch" style={styles.container}>
          <View style={styles.textViewWrapper}>
            <CustomText
              string="파킹박 김포/인천공항"
              size={FONT.TITLE_3}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.darkGray}
            />
            <CustomText
              string="직접주차 서비스란?"
              size={FONT.TITLE_1}
              family={FONT_FAMILY.BOLD}
              textStyle={styles.titleText}
            />
            <CustomText
              color={colors.darkGray}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_2}
              string="공항 이용 시 주차비용 부담을 해결하고자"
            />
            <CustomText
              color={colors.darkGray}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_2}
              string="기존 공항 주차장 대비 50~70% 할인된 금액으로 공항 주변"
            />
            <CustomText
              color={colors.darkGray}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_2}
              string="파킹박 제휴주차장에 연박 주차가 가능한 서비스입니다."
            />

            <View style={styles.boxWrapper}>
              <CustomText string="필독 공지사항" color={colors.white} />
            </View>

            <CustomText
              color={colors.darkGray}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_2}
              string="* 주차 후에 지하철이나 택시를 이용하여 공항으로 이동해 주시면 됩니다."
              textStyle={styles.subText}
            />
            <CustomText
              color={colors.darkGray}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_2}
              string="* 해당 서비스는 무료 셔틀버스를 제공하고있지 않으므로 주의해 주십시오."
              textStyle={styles.subText}
            />
            <CustomText
              color={colors.darkGray}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_2}
              string="* 출차 시 차단기가 자동으로 열리지 않을 경우, 호출 버튼을 누르신 후 관리자에게 파킹박'에서 결제했다고 하시면 출차 가능합니다."
              textStyle={styles.subText}
            />
          </View>
          <View>
            {data?.map(item => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(ROUTE_KEY.ValetParkingSelfDetail, {
                      parkingID: item?.id,
                      title: '김포공항 직접주차 예약',
                    })
                  }
                  style={styles.buttonWrapper}
                  key={item?.id}>
                  <HStack>
                    <Icon
                      name="map-marker"
                      size={widthScale(25)}
                      color={colors.darkGray}
                      style={{marginLeft: -widthScale(5)}}
                    />
                    <View style={{flex: 1, marginLeft: widthScale(5)}}>
                      <CustomText
                        string={
                          getValetParkingNameByID(item?.id)
                            ? getValetParkingNameByID(item?.id)
                            : item?.garageName
                        }
                        numberOfLines={1}
                        family={FONT_FAMILY.SEMI_BOLD}
                      />
                    </View>
                    <Icon
                      name="chevron-right"
                      size={widthScale(20)}
                      color={colors.red}
                      style={{marginRight: -widthScale(5)}}
                    />
                  </HStack>
                </TouchableOpacity>
              );
            })}
          </View>
        </ImageBackground>
      </FixedContainer>
    );
  },
);

export default DirectIndoorParkingAtGimpo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    left: PADDING * 2,
    right: PADDING * 2,
  },
  textViewWrapper: {
    paddingHorizontal: PADDING,
    paddingTop: PADDING * 3,
  },
  titleText: {
    paddingTop: heightScale(5),
    paddingBottom: heightScale(10),
  },
  boxWrapper: {
    minHeight: heightScale(35),
    backgroundColor: colors.darkGray,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: PADDING,
  },
  subText: {
    marginBottom: heightScale(10),
  },
  buttonWrapper: {
    minHeight: heightScale(50),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray,
  },
});
