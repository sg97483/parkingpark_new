import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {VehicleInformation} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  item: VehicleInformation | undefined;
}

const DriverCarInformation: React.FC<Props> = memo(props => {
  const {item} = props;

  const text = strings.vehicle_number;

  return (
    <View style={{gap: PADDING1, marginTop: PADDING1}}>
      {/* Car number */}
      <HStack
        style={{
          alignSelf: 'center',
        }}>
        <HStack style={styles.carNumber}>
          <Icons.Dot width={widthScale1(4)} height={widthScale1(4)} />
          <CustomText
            string={item?.car_number as string}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_11}
            color={colors.menuTextColor}
            lineHeight={heightScale1(36)}
            forDriveMe
          />
          <Icons.Dot width={widthScale1(4)} height={widthScale1(4)} />
        </HStack>
      </HStack>

      {/* vehicle information */}
      <HStack>
        <View style={styles.boxInfor}>
          <CustomText
            string={text.title2}
            family={FONT_FAMILY.REGULAR}
            size={FONT.CAPTION_6}
            color={colors.grayText2}
            lineHeight={heightScale1(20)}
            forDriveMe
          />
          <CustomText
            string={item?.car_sample as string}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_6}
            color={colors.menuTextColor}
            lineHeight={heightScale1(20)}
            forDriveMe
            numberOfLines={1}
          />
        </View>

        <View style={styles.lineVertical} />

        <View style={styles.boxInfor}>
          <CustomText
            string={text.title4}
            family={FONT_FAMILY.REGULAR}
            size={FONT.CAPTION_6}
            color={colors.grayText2}
            lineHeight={heightScale1(20)}
            forDriveMe
          />
          <CustomText
            string={item?.car_year as string}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_6}
            color={colors.menuTextColor}
            lineHeight={heightScale1(20)}
            forDriveMe
            numberOfLines={1}
          />
        </View>

        <View style={styles.lineVertical} />

        <View style={styles.boxInfor}>
          <CustomText
            string={'차량색상'}
            family={FONT_FAMILY.REGULAR}
            size={FONT.CAPTION_6}
            color={colors.grayText2}
            lineHeight={heightScale1(20)}
            forDriveMe
          />
          <CustomText
            string={item?.car_color || '정보없음'}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_6}
            color={item?.car_color ? colors.menuTextColor : colors.disableButton}
            lineHeight={heightScale1(20)}
            forDriveMe
            numberOfLines={1}
          />
        </View>
      </HStack>
    </View>
  );
});

export default DriverCarInformation;

const styles = StyleSheet.create({
  carNumber: {
    paddingHorizontal: widthScale1(12),
    paddingVertical: heightScale1(6),
    borderWidth: 1,
    borderColor: colors.menuTextColor,
    borderRadius: scale1(4),
    gap: widthScale1(10),
  },
  lineVertical: {
    height: '100%',
    width: 1,
    backgroundColor: colors.grayCheckBox,
  },
  boxInfor: {
    alignItems: 'center',
    paddingHorizontal: widthScale1(15),
    flex: 1,
    gap: heightScale1(4),
    width: widthScale1(79),
  },
});
