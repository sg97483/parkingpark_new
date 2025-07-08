import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {ReactNode, memo, useCallback} from 'react';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import CustomText from '~components/custom-text';
import {DRIVER_STATUS_REGISTRATION, FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {strings} from '~constants/strings';
import {StyleProp} from 'react-native';
import Approved from '~/assets/svgs/Approved';
import Reject from '~/assets/svgs/Reject';
import BlueCheck from '~/assets/svgs/BlueCheck';

import CustomButton from '~components/commons/custom-button';
import {fontSize1} from '~styles/typography';

interface Props {
  title: string;
  content: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  statusText: ReactNode;
  status: DRIVER_STATUS_REGISTRATION;
  isPending?: boolean;
}

const CarCardRegister: React.FC<Props> = memo(props => {
  const {title, content, onPress, containerStyle, statusText, status, isPending} = props;

  const text = strings.driver_register;

  const isApproved = status === DRIVER_STATUS_REGISTRATION.APPROVED;

  const renderIcons = useCallback(() => {
    switch (status) {
      case DRIVER_STATUS_REGISTRATION.APPROVED:
        return <Approved />;
      case DRIVER_STATUS_REGISTRATION.REJECTED:
        return <Reject />;
      default:
        return <BlueCheck />;
    }
  }, [status]);

  return (
    <PaddingHorizontalWrapper containerStyles={[styles.container, containerStyle]} forDriveMe>
      <View style={[isPending ? {} : {minHeight: heightScale1(75)}]}>
        <CustomText
          string={title}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.BODY}
          color={colors.menuTextColor}
          lineHeight={fontSize1(25)}
          forDriveMe
        />

        {isPending ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: heightScale1(10),
              minWidth: '100%',
              marginBottom: heightScale1(20),
              marginTop: heightScale1(10),
            }}>
            {renderIcons()}
            <View style={{width: widthScale1(4)}} />
            {statusText}
          </View>
        ) : (
          <CustomText
            string={content}
            family={FONT_FAMILY.LIGHT}
            size={FONT.CAPTION_6}
            color={colors.grayText2}
            textStyle={{paddingTop: widthScale1(10), paddingBottom: heightScale1(20)}}
            lineHeight={fontSize1(20)}
            forDriveMe
          />
        )}
      </View>

      {!isApproved && (
        <CustomButton
          type={isPending ? 'TERTIARY' : 'SECONDARY'}
          outLine={isPending}
          buttonStyle={[isPending ? {backgroundColor: colors.white} : {}]}
          text={isPending ? '수정하기' : text.register}
          onPress={onPress}
          buttonHeight={48}
        />
      )}
    </PaddingHorizontalWrapper>
  );
});

export default CarCardRegister;

const styles = StyleSheet.create({
  container: {
    marginTop: widthScale1(20),
    backgroundColor: colors.white,
    paddingVertical: heightScale1(16),
    borderRadius: widthScale1(8),
  },
});
