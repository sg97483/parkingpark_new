import React, {ReactNode, memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {DRIVER_STATUS_REGISTRATION, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {VehicleInformation} from '~constants/types';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import DriverCarInformation from './driver-car-information';

interface Props {
  onPress: () => void;
  statusText: ReactNode;
  status: DRIVER_STATUS_REGISTRATION;
  isPending?: boolean;
}

const CarInformation: React.FC<Props> = memo(props => {
  const text = strings.driver_register;

  const {onPress, statusText, status, isPending} = props;
  const isApproved = status === DRIVER_STATUS_REGISTRATION.APPROVED;

  const {user} = useAppSelector(state => state.userReducer);

  const info = useMemo((): VehicleInformation => {
    return {
      car_color: user?.carColor === 'undefined' ? '' : (user?.carColor ?? ''),
      car_number: user?.carNumber ?? '',
      car_sample: user?.carModel ?? '',
      car_year: user?.carYear ?? '',
      production: user?.carCompany ?? '',
    };
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <CustomText
          string={text.car_infor}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.BODY}
          color={colors.menuTextColor}
          forDriveMe
        />
        {isPending ? (
          <HStack>
            <View style={styles.circle} />

            {statusText}
          </HStack>
        ) : null}
      </View>

      {isPending ? (
        <View>
          <DriverCarInformation item={info} />
        </View>
      ) : (
        <View>
          <CustomText
            string={text.obligate_sign_up_to_allow_pick_up}
            family={FONT_FAMILY.LIGHT}
            color={colors.grayText2}
            textStyle={{paddingTop: widthScale1(10)}}
            lineHeight={heightScale1(20)}
            forDriveMe
          />

          <View style={styles.boxList}>
            <CustomText
              string={text.car_is_available_or_doesnt_allow_run}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_7}
              lineHeight={heightScale1(22)}
              forDriveMe
            />

            <View style={styles.ruleList}>
              <CustomText
                string={'   \u2022   ' + '법인차량'}
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText2}
                lineHeight={heightScale1(20)}
                forDriveMe
              />
              <CustomText
                string={'   \u2022   ' + text.rental_car}
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText2}
                lineHeight={heightScale1(20)}
                forDriveMe
              />
              <CustomText
                string={'   \u2022   ' + text.shared_car}
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText2}
                lineHeight={heightScale1(20)}
                forDriveMe
              />
              <CustomText
                string={'   \u2022   ' + text.car_over_10_ages}
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText2}
                lineHeight={heightScale1(20)}
                forDriveMe
              />
              <CustomText
                string={'   \u2022   ' + text.light_car}
                family={FONT_FAMILY.MEDIUM}
                color={colors.grayText2}
                lineHeight={heightScale1(20)}
                forDriveMe
              />
            </View>
          </View>
        </View>
      )}

      {!isApproved && (
        <CustomButton
          type={isPending ? 'TERTIARY' : 'SECONDARY'}
          outLine={isPending}
          buttonStyle={[
            isPending ? {backgroundColor: colors.white} : {},
            {
              marginTop: heightScale1(20),
            },
          ]}
          text={isPending ? '수정하기' : text.register}
          onPress={onPress}
          disabled={isApproved}
          buttonHeight={48}
        />
      )}
    </View>
  );
});

export default CarInformation;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: PADDING1,
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(16),
    borderRadius: scale1(8),
  },
  boxList: {
    marginTop: PADDING1,
    paddingVertical: heightScale1(16),
    paddingHorizontal: PADDING1,
    backgroundColor: colors.gray7,
    borderRadius: widthScale1(4),
  },
  ruleList: {
    marginTop: widthScale1(17),
    gap: heightScale1(4),
  },
  textStyle: {
    fontSize: widthScale1(14),
    fontFamily: FONT_FAMILY.MEDIUM,
    lineHeight: widthScale1(20),
    paddingTop: widthScale1(4),
    color: colors.grayText2,
  },
  circle: {
    width: widthScale1(2),
    height: heightScale1(2),
    backgroundColor: colors.menuTextColor,
    borderRadius: widthScale1(999),
    marginHorizontal: widthScale1(4),
  },
});
