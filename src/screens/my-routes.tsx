import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomText from '~components/custom-text';
import {NavigationState, Route, SceneMap, SceneRendererProps, TabView} from 'react-native-tab-view';
import CustomTabView from '~components/custom-tab-view';
import CustomHeader from '~components/custom-header';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import ChevronRight from '~/assets/svgs/ChevronRight';
import {FlashList} from '@shopify/flash-list';
import ItemDriverReservation from '~components/cancel-reservation/item-driver-reservation';

const TAB_PAGE_ENUM = {
  DRIVER: '0',
  PASSENGER: '1',
};

const TAB_ROUTES: Route[] = [
  {key: TAB_PAGE_ENUM.DRIVER, title: '드라이버'},
  {key: TAB_PAGE_ENUM.PASSENGER, title: '탑승객'},
];

const MyRoutes = (props: RootStackScreenProps<'MyRoutes'>) => {
  const {} = props;

  const [selectedIndex, setSelectedIndex] = useState(parseInt(TAB_PAGE_ENUM.DRIVER));
  const [routes, setRoutes] = useState<Route[]>(TAB_ROUTES);

  // render tab bar
  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
      },
    ) => {
      return (
        <CustomTabView
          tabViewProps={props}
          selectedTabIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      );
    },
    [selectedIndex],
  );

  // handle render item list driver route
  const renderItemsDriverRoute = useCallback(() => {
    return (
      <ItemDriverReservation
        noneShowDate
        rightContentHeader={
          <TouchableOpacity style={styles.button}>
            <CustomText
              string="변경"
              size={FONT.CAPTION_6}
              family={FONT_FAMILY.SEMI_BOLD}
              color={colors.lineCancel}
            />
          </TouchableOpacity>
        }
      />
    );
  }, []);

  // render driver tab
  const renderDriverTab = useCallback(() => {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.buttonBox}>
          <CustomText
            string="스타일 등록 변경하기"
            size={FONT.CAPTION_7}
            color={colors.grayText2}
          />
          <ChevronRight />
        </TouchableOpacity>

        <FlashList
          data={Array.from({length: 5})}
          renderItem={renderItemsDriverRoute}
          keyExtractor={(_, index) => index.toString()}
          estimatedItemSize={200}
          extraData={{}}
        />
      </View>
    );
  }, []);

  // render driver tab
  const renderPassengerTab = useCallback(() => {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.buttonBox}>
          <CustomText
            string="스타일 등록 변경하기"
            size={FONT.CAPTION_7}
            color={colors.grayText2}
          />
          <ChevronRight />
        </TouchableOpacity>

        <FlashList
          data={Array.from({length: 5})}
          renderItem={renderItemsDriverRoute}
          keyExtractor={(_, index) => index.toString()}
          estimatedItemSize={200}
          extraData={{}}
        />
      </View>
    );
  }, []);

  const renderScene = SceneMap({
    '0': renderDriverTab,
    '1': renderPassengerTab,
  });

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader text="나의 출퇴근 경로" />
      <TabView
        navigationState={{index: selectedIndex, routes: routes}}
        renderScene={renderScene}
        onIndexChange={setSelectedIndex}
        renderTabBar={renderTabBar}
        lazy
        animationEnabled
      />
    </FixedContainer>
  );
};

export default MyRoutes;

const styles = StyleSheet.create({
  buttonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING,
    paddingVertical: heightScale(16),
    backgroundColor: colors.policy,
    borderRadius: widthScale(4),
    marginTop: heightScale(20),
    marginHorizontal: PADDING,
  },
  button: {
    paddingVertical: heightScale(9),
    paddingHorizontal: widthScale(10),
    borderWidth: 1,
    borderColor: colors.disableButton,
    borderRadius: widthScale(8),
  },
});
