import {useNavigation} from '@react-navigation/native';
import React, {FC, memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize} from '~styles/typography';

interface Props {
  item: any;
}

const SettlementDetailItem: FC<Props> = memo(props => {
  const {item} = props;
  const navigation = useNavigation<UseRootStackNavigation>();
  return (
    <>
      <Pressable
        onPress={() => {
          navigation.navigate(ROUTE_KEY.DetailContentCarpool, {item: item, type: 'DRIVER_HISTORY'});
        }}
        style={{
          paddingHorizontal: widthScale1(20),
        }}>
        <HStack>
          <View
            style={[
              styles.enableTag,
              {backgroundColor: item?.isBackHome ? colors.colorStatus : '#060606'},
            ]}>
            <CustomText
              string={'출근길'}
              color={item?.isBackHome ? colors.menuTextColor : colors.white}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_4}
              forDriveMe
            />
          </View>
          <CustomText
            string={item?.isPenalty ? '패널티부과' : '카풀완료'}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_7}
            color={item?.isPenalty ? colors.rejectText : colors.disableButton}
            textStyle={{marginLeft: widthScale1(10)}}
            forDriveMe
          />
        </HStack>
        <CustomText
          string="2023.10.05(월)"
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.BODY}
          color={colors.menuTextColor}
          textStyle={{marginTop: widthScale1(10)}}
          forDriveMe
        />
        <View style={{marginTop: heightScale1(20)}}>
          <RoutePlanner
            startAddress="출발지"
            arriveAddress="도착지"
            timeStart="07:30"
            timeArrive="08:08"
            hideExpectations
          />
        </View>
        <HStack style={{alignSelf: 'flex-end', marginTop: heightScale1(20)}}>
          {item?.isDiscount ? (
            <>
              <CustomText
                string="18,000"
                size={FONT.CAPTION_6}
                color={colors.lineCancel}
                lineHeight={fontSize(19.6)}
                textStyle={{
                  textDecorationLine: 'line-through',
                }}
                forDriveMe
              />
              <CustomText
                string="15,000원"
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION_8}
                color={colors.menuTextColor}
                textStyle={{marginHorizontal: widthScale1(6)}}
                forDriveMe
              />
            </>
          ) : (
            <CustomText
              string="15,000원"
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_8}
              color={colors.menuTextColor}
              textStyle={{marginHorizontal: widthScale1(6)}}
              forDriveMe
            />
          )}
          <Icons.ChevronRight width={scale1(16)} height={scale1(16)} />
        </HStack>
      </Pressable>
      <Divider style={styles.divider} />
    </>
  );
});

export default SettlementDetailItem;

const styles = StyleSheet.create({
  enableTag: {
    backgroundColor: '#060606',
    borderRadius: scale1(4),
    height: scale1(27),
    width: scale1(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {backgroundColor: colors.policy, marginVertical: heightScale1(30)},
});
