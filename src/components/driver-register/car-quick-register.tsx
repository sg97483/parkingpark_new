import React, {ReactNode, memo} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {DRIVER_STATUS_REGISTRATION, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {CarInsuranceInfo} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface Props {
  onPress: () => void;
  statusText: ReactNode;
  status: DRIVER_STATUS_REGISTRATION;
  isPending?: boolean;
  driverInfo: CarInsuranceInfo | undefined;
}

const CarQuickRegister: React.FC<Props> = memo(props => {
  const text = strings.driver_register;

  const {onPress, statusText, status, isPending, driverInfo} = props;

  const isApproved = status === DRIVER_STATUS_REGISTRATION.APPROVED;

  return (
    <PaddingHorizontalWrapper containerStyles={styles.container} forDriveMe>
      <View>
        <HStack style={{gap: widthScale1(4)}}>
          <CustomText
            string={text.quick_title}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.BODY}
            color={colors.menuTextColor}
            lineHeight={fontSize1(25)}
            forDriveMe
          />
        </HStack>

        <CustomText
          string={text.quick_content}
          color={colors.grayText2}
          textStyle={{paddingTop: heightScale1(10)}}
          lineHeight={heightScale1(20)}
          forDriveMe
        />
      </View>

      <CustomButton
        type="SECONDARY"
        outLine={false}
        buttonStyle={{backgroundColor: colors.primary}}
        text={text.quick_link}
        onPress={() => {
          Linking.openURL('http://pf.kakao.com/_HKZxgG/chat');
        }}
        buttonHeight={48}
      />

      {/*{!isApproved && (primary
      <CustomButton
        type={isPending ? 'TERTIARY' : 'SECONDARY'}
        outLine={isPending}
        buttonStyle={[isPending ? {backgroundColor: colors.white} : {}]}
        text={isPending ? '수정하기' : text.register}
        onPress={onPress}
        disabled={isApproved}
        buttonHeight={48}
      />
      )}*/}
    </PaddingHorizontalWrapper>
  );
});

export default CarQuickRegister;

const styles = StyleSheet.create({
  container: {
    marginTop: PADDING1,
    backgroundColor: colors.white,
    paddingVertical: heightScale1(16),
    borderRadius: widthScale1(8),
    gap: PADDING1,
  },
  boxImages: {
    marginTop: heightScale1(20),
    justifyContent: 'space-between',
  },
});
