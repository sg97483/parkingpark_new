import {View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {NavigationState, Route, SceneMap, SceneRendererProps, TabView} from 'react-native-tab-view';
import CustomTabView from '~components/custom-tab-view';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import CarPoolRouteRealtimeItem from '~components/carpool-request-registration-list/car-pool-route-realtime-item';
import {FlashList} from '@shopify/flash-list';
import {heightScale} from '~styles/scaling-utils';

const TAB_PAGE_ENUM = {
  WAY_TO_WORK: '0',
  WAY_TO_HOME: '1',
};

const TAB_ROUTES: Route[] = [
  {key: TAB_PAGE_ENUM.WAY_TO_WORK, title: '출근길'},
  {key: TAB_PAGE_ENUM.WAY_TO_HOME, title: '퇴근길'},
];

const CarPoolRouteRealtime = (props: RootStackScreenProps<'CarPoolRouteRealtime'>) => {
  const {navigation} = props;

  const [selectedIndex, setSelectedIndex] = useState(parseInt(TAB_PAGE_ENUM.WAY_TO_WORK));
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

  // render way to work items
  const renderWayToWorkItems = useCallback(() => {
    return <CarPoolRouteRealtimeItem />;
  }, []);

  // render way to work list
  const renderWayToWorkList = useCallback(() => {
    return (
      <PaddingHorizontalWrapper containerStyles={{flex: 1}}>
        <FlashList
          data={Array.from({length: 5})}
          renderItem={renderWayToWorkItems}
          keyExtractor={(_, index) => index.toString()}
          estimatedItemSize={200}
          ListHeaderComponent={() => <View style={{height: heightScale(20)}} />}
          ItemSeparatorComponent={() => <View style={{height: heightScale(30)}} />}
        />
      </PaddingHorizontalWrapper>
    );
  }, [selectedIndex]);

  // render way to home items
  const renderWayToHomeItems = useCallback(() => {
    return <CarPoolRouteRealtimeItem />;
  }, []);

  // render way to home list
  const renderWayToHomeList = useCallback(() => {
    return (
      <PaddingHorizontalWrapper containerStyles={{flex: 1}}>
        <FlashList
          data={Array.from({length: 5})}
          renderItem={renderWayToHomeItems}
          keyExtractor={(_, index) => index.toString()}
          estimatedItemSize={200}
          ListHeaderComponent={() => <View style={{height: heightScale(20)}} />}
          ItemSeparatorComponent={() => <View style={{height: heightScale(30)}} />}
        />
      </PaddingHorizontalWrapper>
    );
  }, [selectedIndex]);

  const renderScene = SceneMap({
    '0': renderWayToWorkList,
    '1': renderWayToHomeList,
  });

  return (
    <FixedContainer edges={['top', 'bottom']}>
      <CustomHeader text={'실시간 추천 카풀 경로'} />
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

export default CarPoolRouteRealtime;
