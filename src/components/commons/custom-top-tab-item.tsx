import {Pressable, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import Divider from '~components/divider';
import {colors} from '~styles/colors';
import {FONT, FONT_FAMILY} from '~constants/enum';
import CustomText from '~components/custom-text';
import {heightScale1} from '~styles/scaling-utils';

type CustomTabBarProps = MaterialTopTabBarProps & {
  onItemPress?: (index: number) => void;
};

const CustomTopTabItem: React.FC<CustomTabBarProps> = memo(props => {
  const {state, onItemPress, navigation} = props;
  return (
    <View>
      <PaddingHorizontalWrapper forDriveMe containerStyles={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const handlePress = () => {
            if (!isFocused) {
              onItemPress && onItemPress(index);
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={handlePress}
              style={[
                styles.tabBarItem,
                {
                  borderBottomWidth: 2,
                  borderColor: isFocused ? colors.heavyGray : colors.transparent,
                },
              ]}>
              <CustomText
                forDriveMe
                string={route?.name}
                size={FONT.CAPTION_7}
                family={isFocused ? FONT_FAMILY.SEMI_BOLD : FONT_FAMILY.MEDIUM}
                color={isFocused ? colors.heavyGray : colors.disableButton}
              />
            </Pressable>
          );
        })}
      </PaddingHorizontalWrapper>

      <Divider />
    </View>
  );
});

export default CustomTopTabItem;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    minHeight: heightScale1(44),
    justifyContent: 'center',
  },
});
