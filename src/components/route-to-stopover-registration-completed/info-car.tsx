import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  carNumber: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleYear: string;
  isLock?: boolean;
}

const InfoCar = (props: Props) => {
  const {carNumber, vehicleColor, vehicleModel, vehicleYear, isLock} = props;

  return (
    <View style={styles.view}>
      <CustomText
        family={FONT_FAMILY.SEMI_BOLD}
        size={FONT.BODY}
        string="차량정보"
        textStyle={styles.title}
        forDriveMe
      />

      <View style={{gap: heightScale1(14)}}>
        <View style={styles.viewInfo}>
          <CustomText forDriveMe color={colors.grayText} string="차량번호" />
          {isLock ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icons.Lock style={{marginRight: widthScale1(4)}} />
              <CustomText
                forDriveMe
                color={colors.disableButton}
                string={'정보보호'}
                family={FONT_FAMILY.MEDIUM}
              />
            </View>
          ) : (
            <CustomText
              forDriveMe
              string={carNumber || '정보없음'}
              family={FONT_FAMILY.MEDIUM}
              color={carNumber ? colors.menuTextColor : colors.disableButton}
            />
          )}
        </View>
        <View style={styles.viewInfo}>
          <CustomText forDriveMe color={colors.grayText} string="차량모델" />
          <CustomText
            forDriveMe
            string={vehicleModel || '정보없음'}
            family={FONT_FAMILY.MEDIUM}
            color={vehicleModel ? colors.menuTextColor : colors.disableButton}
          />
        </View>
        <View style={styles.viewInfo}>
          <CustomText forDriveMe color={colors.grayText} string="차량색상" />
          <CustomText
            forDriveMe
            string={vehicleColor || '정보없음'}
            family={FONT_FAMILY.MEDIUM}
            color={vehicleColor ? colors.menuTextColor : colors.disableButton}
          />
        </View>

        <View style={styles.viewInfo}>
          <CustomText forDriveMe color={colors.grayText} string="차량연식" />
          <CustomText
            forDriveMe
            color={vehicleYear ? colors.menuTextColor : colors.disableButton}
            string={vehicleYear || '정보없음'}
            family={FONT_FAMILY.MEDIUM}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(InfoCar);

const styles = StyleSheet.create({
  viewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  view: {
    paddingHorizontal: PADDING1,
  },
  title: {
    marginBottom: PADDING1,
  },
});
