import React, {memo, useCallback, useMemo, useState} from 'react';
import {Pressable, StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {AddressKakaoProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {getNameAddressKakao, getSubNameAddressKakao} from '~utils/common';
import CustomButton from './custom-button';
import CustomCheckbox from './custom-checkbox';

interface Props {
  isPark?: boolean;
  textSearch?: string;
  onPress?: () => void;
  isCheckBox?: boolean;
  isChecked?: boolean;
  hideArrive?: boolean;
  isDepart?: boolean;
  style?: StyleProp<ViewStyle>;
  colorName?: string;
  item: AddressKakaoProps;
  isStop?: boolean;
  checkAll?: boolean;
}
const ItemAddressSearch = (props: Props) => {
  const {
    isPark,
    onPress,
    textSearch,
    isCheckBox,
    isChecked,
    hideArrive,
    isDepart,
    style,
    colorName,
    item,
    isStop = false,
    checkAll,
  } = props;

  const [pressed, setPressed] = useState(false);

  const title = useMemo(() => getNameAddressKakao(item), [item]);
  const content = useMemo(() => getSubNameAddressKakao(item), [item]);

  const onPressIn = useCallback(() => setPressed(true), []);
  const onPressOut = useCallback(() => setPressed(false), []);

  const renderColorText = (text: string, textSearch?: string) => {
    if (!text) {
      return null;
    }
    const parts = text.split(new RegExp(/textSearch?.trim()/, 'gi'));
    return (
      <CustomText
        numberOfLines={1}
        textStyle={{flexShrink: 1}}
        color={colorName}
        size={!content && checkAll ? FONT.CAPTION_7 : FONT.SUB_HEAD}
        lineHeight={!content && checkAll ? heightScale1(22) : heightScale1(21)}
        family={FONT_FAMILY.MEDIUM}
        forDriveMe
        string={
          parts.map((part, index) =>
            part.toLowerCase() === textSearch?.trim().toLowerCase() ? (
              <Text key={index} style={styles.colorSearch}>
                {part}
              </Text>
            ) : (
              part
            ),
          ) as any
        }
      />
    );
  };

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: pressed ? colors.policy : colors.white,
        },
      ]}>
      <HStack style={{flex: 1}}>
        {isCheckBox && (
          <CustomCheckbox
            onPress={onPress}
            isChecked={isChecked}
            style={{
              marginRight: !content ? widthScale1(4) : widthScale1(10),
            }}
          />
        )}
        <View style={[styles.viewItemSearch, style, {}]}>
          <HStack>
            {isPark && <Icons.Park style={styles.iconPark} />}
            {renderColorText(title, textSearch)}
          </HStack>
          {!!content && (
            <CustomText forDriveMe size={FONT.CAPTION_6} string={content} color={colors.grayText} />
          )}
        </View>
      </HStack>

      {!hideArrive && (
        <CustomButton
          buttonStyle={styles.buttonStyle}
          onPress={onPress}
          type="TERTIARY"
          text={isDepart ? '출발' : isStop ? '경유' : '도착'}
          outLine
          buttonHeight={38}
          textSize={FONT.CAPTION_6}
        />
      )}
    </Pressable>
  );
};

export default memo(ItemAddressSearch);

const styles = StyleSheet.create({
  viewItemSearch: {
    gap: heightScale1(4),
    paddingVertical: heightScale1(20),
    flex: 1,
  },
  iconPark: {
    marginRight: widthScale1(5),
  },
  colorSearch: {
    color: colors.primary,
  },
  container: {
    paddingHorizontal: PADDING1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: colors.policy,
    borderBottomWidth: heightScale1(1),
  },
  buttonStyle: {
    minWidth: widthScale1(45),
    paddingHorizontal: widthScale1(10),
  },
});
