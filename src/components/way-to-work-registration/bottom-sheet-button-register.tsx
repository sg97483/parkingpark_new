import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {AddressKakaoProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getNameAddressKakao, getSubNameAddressKakao} from '~utils/common';

interface Props {
  onPressRegisterRoute: () => void;
  text: string;
  disable?: boolean;
  address: AddressKakaoProps;
  onChangeSize?: (size: number) => void;
}
const BottomSheetButtonRegister = (props: Props) => {
  const {onPressRegisterRoute, text, disable, address, onChangeSize} = props;

  const insertSafe = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View
        onLayout={e => {
          onChangeSize?.(e.nativeEvent.layout.height);
        }}
        style={styles.viewContent}>
        <View style={{gap: heightScale1(4)}}>
          <View style={styles.viewName}>
            {address?.isParking && <Icons.Park style={styles.iconPark} />}
            <CustomText
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
              string={getNameAddressKakao(address)}
              lineHeight={25}
              forDriveMe
            />
          </View>

          {getSubNameAddressKakao(address) ? (
            <CustomText
              lineHeight={20}
              color={colors.grayText}
              string={getSubNameAddressKakao(address)}
              size={FONT.CAPTION_6}
              family={FONT_FAMILY.MEDIUM}
              forDriveMe
            />
          ) : null}
        </View>
        <CustomButton
          isLoading={disable}
          buttonStyle={[styles.button, {marginBottom: insertSafe.bottom + PADDING1 / 2}]}
          onPress={onPressRegisterRoute}
          text={text}
          buttonHeight={58}
        />
      </View>
    </View>
  );
};

export default memo(BottomSheetButtonRegister);
const styles = StyleSheet.create({
  viewContent: {
    paddingHorizontal: PADDING1,
    paddingTop: PADDING1,
  },
  button: {
    marginTop: PADDING1,
  },
  viewName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPark: {
    marginRight: widthScale1(5),
  },
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.white,
    width: '100%',
    borderTopRightRadius: widthScale1(20),
    borderTopLeftRadius: widthScale1(20),
  },
});
