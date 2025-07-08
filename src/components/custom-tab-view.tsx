import React, {memo} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {NavigationState, Route, SceneRendererProps} from 'react-native-tab-view';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import CustomText from './custom-text';

interface Props {
  tabViewProps: SceneRendererProps & {
    navigationState: NavigationState<Route>;
  };
  selectedTabIndex: number;
  setSelectedIndex: (index: number) => void;
  tabStyle?: StyleProp<ViewStyle>;
}

const CustomTabView: React.FC<Props> = memo(props => {
  const {selectedTabIndex, setSelectedIndex, tabViewProps, tabStyle} = props;

  const {navigationState} = tabViewProps;

  return (
    <View style={styles.tabContainer}>
      {navigationState.routes.map((route, index) => {
        const isFocused = selectedTabIndex === index;

        return (
          <Pressable
            key={route.key}
            onPress={() => setSelectedIndex(index)}
            style={[
              styles.tabPage,
              tabStyle,
              {
                borderBottomColor: isFocused ? colors.menuTextColor : colors.transparent,
              },
            ]}>
            <CustomText
              string={route.title as string}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_7}
              color={isFocused ? colors.menuTextColor : colors.disableButton}
              textStyle={{alignSelf: 'center'}}
            />
          </Pressable>
        );
      })}
    </View>
  );
});

export default CustomTabView;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayCheckBox,
    paddingHorizontal: PADDING1,
    minHeight: heightScale1(44),
  },
  tabPage: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: heightScale1(1),
  },
});
