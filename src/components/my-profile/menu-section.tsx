import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomMenu from '~components/commons/custom-menu';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {FONT_FAMILY} from '~constants/enum';
import {MenuProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface Props {
  icon: React.ReactNode;
  title: string;
  subTitle?: string;
  menuList: MenuProps[];
}

const MenuSection: React.FC<Props> = memo(props => {
  const {icon, menuList, title, subTitle} = props;
  return (
    <View style={styles.containerStyle}>
      <PaddingHorizontalWrapper forDriveMe>
        <HStack
          style={{
            marginBottom: heightScale1(10),
          }}>
          {icon}
          <HStack style={{gap: widthScale1(6)}}>
            <Text style={styles.haederTextStyle}>{title}</Text>
            {subTitle && <Icons.Dot />}
            {subTitle && <Text style={styles.subHaederTextStyle}>{subTitle}</Text>}
          </HStack>
        </HStack>
      </PaddingHorizontalWrapper>

      {menuList?.map((item, index) => {
        return (
          <CustomMenu
            isShowDot={item.isShowDot}
            text={item?.title}
            key={index}
            onPress={item?.onPress}
          />
        );
      })}
    </View>
  );
});

export default MenuSection;

const styles = StyleSheet.create({
  containerStyle: {
    marginBottom: 0,
  },
  haederTextStyle: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(18),
    color: colors.menuTextColor,
    marginLeft: widthScale1(6),
  },
  subHaederTextStyle: {
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(18),
    color: colors.menuTextColor,
  },
  menuWrapperStyle: {
    justifyContent: 'space-between',
    minHeight: heightScale1(24),
    marginTop: heightScale1(30),
  },
  menuTextStyle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: fontSize1(15),
    color: colors.menuTextColor,
  },
});
