import React, {memo} from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
// import {fontSize1} from '~styles/typography'; // getFontSize가 CustomText에서 오므로 직접 필요 없을 수 있음

interface Props {
  text: string;
  subText?: string;
  onPress?: () => void;
  hideChevron?: boolean;
  disabled?: boolean;
  menuHeight?: number;
  normalText?: boolean;
  isShowDot?: boolean;
}

const CustomMenu: React.FC<Props> = memo(props => {
  const {onPress, text, hideChevron, disabled, subText, menuHeight, normalText, isShowDot} = props;

  return (
    <TouchableHighlight
      underlayColor={colors.policy} // 사용자가 누르고 있을 때 보여줄 배경색
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.containerStyle, // 여기에 backgroundColor 추가
        {
          minHeight: menuHeight ? heightScale1(menuHeight) : heightScale1(56),
        },
      ]}>
      <HStack style={styles.contentStyle}>
        <View style={{gap: normalText ? heightScale1(6) : heightScale1(2), flex: 1}}>
          {/* 텍스트 영역이 잘리지 않도록 flex: 1 추가 */}
          <View style={styles.viewText}>
            <CustomText
              forDriveMe
              size={normalText ? FONT.CAPTION_7 : FONT.SUB_HEAD}
              family={normalText ? FONT_FAMILY.REGULAR : FONT_FAMILY.MEDIUM}
              string={text ?? ''}
              lineHeight={heightScale1(21)}
              numberOfLines={1}
            />
            {isShowDot && (
              <Icons.Dot width={widthScale1(6)} height={widthScale1(6)} fill={colors.primary} />
            )}
          </View>
          {subText && (
            <CustomText
              forDriveMe
              size={normalText ? FONT.CAPTION : FONT.SUB_HEAD}
              family={FONT_FAMILY.MEDIUM}
              string={subText ?? ''}
              lineHeight={heightScale1(21)}
              color={colors.grayText}
              numberOfLines={1}
            />
          )}
        </View>

        {hideChevron ? null : <Icons.ChevronRight stroke={colors.grayText} />}
      </HStack>
    </TouchableHighlight>
  );
});

export default CustomMenu;

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: PADDING1,
    paddingVertical: heightScale1(16),
    justifyContent: 'center',
    flex: 1,
    backgroundColor: colors.white, //  명시적인 배경색 추가
  },
  contentStyle: {
    justifyContent: 'space-between',
    alignItems: 'center', // 아이콘과 텍스트 수직 정렬을 위해 추가
  },
  viewText: {
    flexDirection: 'row',
    gap: widthScale1(6),
    alignItems: 'center', // 점과 텍스트 수직 정렬
  },
});
