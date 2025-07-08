import React, {ReactNode, memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomBoxSelectButton from '~components/commons/custom-box-select-button';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {DRIVER_STATUS_REGISTRATION, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface Props {
  title: string;
  content: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  statusText: ReactNode;
  status: DRIVER_STATUS_REGISTRATION;
  favoriteList: string[];
  isPending?: boolean;
}

const CarStyleRegister: React.FC<Props> = memo(props => {
  const {title, content, onPress, containerStyle, statusText, status, favoriteList, isPending} =
    props;
  const text = strings.driver_register;

  const isApproved = status === DRIVER_STATUS_REGISTRATION.APPROVED;

  return (
    <PaddingHorizontalWrapper containerStyles={[styles.container, containerStyle]} forDriveMe>
      <View style={[isPending ? {} : {minHeight: heightScale1(75)}]}>
        <HStack style={{gap: widthScale1(4)}}>
          <CustomText
            string={title}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.BODY}
            color={colors.menuTextColor}
            lineHeight={fontSize1(25)}
            forDriveMe
          />
          {isPending ? (
            <HStack style={{gap: widthScale1(4)}}>
              <Icons.Dot width={widthScale1(2)} height={widthScale1(2)} />
              {statusText}
            </HStack>
          ) : null}
        </HStack>

        {isPending ? (
          // render after register - PENDING - APPROVED - REJECTED
          <HStack
            style={{
              flexWrap: 'wrap',
              marginTop: heightScale1(10),
              gap: heightScale1(10),
            }}>
            {favoriteList.map((item, index) => (
              <CustomBoxSelectButton
                key={index}
                text={item}
                selected={false}
                onSelected={() => {}}
              />
            ))}
          </HStack>
        ) : (
          <CustomText
            string={content}
            family={FONT_FAMILY.REGULAR}
            size={FONT.CAPTION_6}
            color={colors.grayText2}
            textStyle={{paddingTop: widthScale1(10)}}
            lineHeight={fontSize1(20)}
            forDriveMe
          />
        )}
      </View>

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
        //disabled={isApproved}
        buttonHeight={48}
      />
    </PaddingHorizontalWrapper>
  );
});

export default CarStyleRegister;

const styles = StyleSheet.create({
  container: {
    marginTop: widthScale1(20),
    backgroundColor: colors.white,
    paddingVertical: heightScale1(16),
    borderRadius: scale1(8),
  },
});
