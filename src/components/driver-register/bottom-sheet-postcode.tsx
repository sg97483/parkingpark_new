import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {FlashList} from '@shopify/flash-list';
import React, {
  Ref,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  ScrollView as ScrollViewGestureHandler,
} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavigationState, Route, SceneMap, SceneRendererProps, TabView} from 'react-native-tab-view';
import {Icons} from '~/assets/svgs';
import Check from '~/assets/svgs/Check';
import CustomBackdrop from '~components/custom-backdrop';
import CustomTabView from '~components/custom-tab-view';
import CustomText from '~components/custom-text';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

export interface ModalBottomPostcodeRefs {
  show: () => void;
  hide: () => void;
}

interface Props {
  selected: string;
  onSelected: (item: string) => void;
}

interface TAB_MODEL {
  id: string;
  text: string;
}

const dataArea: TAB_MODEL[] = [
  {
    id: '1',
    text: '서울',
  },
  {
    id: '2',
    text: '경기',
  },
  {
    id: '3',
    text: '인천',
  },
  {
    id: '4',
    text: '대전',
  },
  {
    id: '5',
    text: '광주',
  },
  {
    id: '6',
    text: '울산',
  },
  {
    id: '7',
    text: '대구',
  },
  {
    id: '8',
    text: '부산',
  },
  {
    id: '9',
    text: '강원',
  },
  {
    id: '10',
    text: '충남',
  },
  {
    id: '11',
    text: '충북',
  },
  {
    id: '12',
    text: '전남',
  },
  {
    id: '13',
    text: '전북',
  },
  {
    id: '14',
    text: '경남',
  },
  {
    id: '15',
    text: '경북',
  },
  {
    id: '16',
    text: '제주',
  },
];

const TAB_PAGE_ENUM = {
  NUMBER: '0',
  AREA: '1',
};

const TAB_ROUTES: Route[] = [
  {key: TAB_PAGE_ENUM.NUMBER, title: strings.driver_register.number},
  {key: TAB_PAGE_ENUM.AREA, title: strings.driver_register.area},
];

const BottomSheetPostcode = forwardRef((props: Props, ref: Ref<any>) => {
  const {selected, onSelected} = props;

  const bottomSheetRefs = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['100%'], []);
  const insets = useSafeAreaInsets();

  const [selectedIndex, setSelectedIndex] = useState(parseInt(TAB_PAGE_ENUM.NUMBER));

  const [routes, setRoutes] = useState<Route[]>(TAB_ROUTES);

  const show = () => {
    bottomSheetRefs.current?.present();
  };

  const hide = () => {
    bottomSheetRefs.current?.close();
  };

  useImperativeHandle(ref, () => ({show, hide}), []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={'none'}
        onPressBackdrop={() => bottomSheetRefs.current?.close()}
      />
    ),
    [],
  );

  const renderItems = useCallback(
    ({item}: {item: TAB_MODEL}) => {
      return (
        <Pressable
          onPress={() => {
            onSelected(item.text);
            hide();
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <CustomText
            string={item.text}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_7}
            color={
              selected.toLocaleLowerCase() === item.text.toLocaleLowerCase()
                ? colors.primary
                : colors.menuTextColor
            }
            textStyle={{paddingVertical: heightScale1(15)}}
            lineHeight={fontSize1(22)}
            forDriveMe
          />
          {/* <Check stroke={colors.menuTextColor} /> */}
          {selected.toLocaleLowerCase() === item.text.toLocaleLowerCase() ? (
            <Check stroke={colors.primary} width={24} height={24} />
          ) : null}
        </Pressable>
      );
    },
    [selected],
  );

  const renderPageNumber = useCallback(() => {
    return (
      <ScrollViewGestureHandler
        contentContainerStyle={{paddingTop: heightScale1(30), paddingBottom: heightScale1(52)}}
        showsVerticalScrollIndicator={false}>
        <PaddingHorizontalWrapper forDriveMe>
          {Array.from({length: 18}, (_, index) => {
            return (
              <Pressable
                key={index}
                onPress={() => {
                  onSelected((index + 11).toString());
                  hide();
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <CustomText
                  string={(index + 11).toString()}
                  family={FONT_FAMILY.SEMI_BOLD}
                  size={FONT.CAPTION_7}
                  color={
                    selected === (index + 11).toString() ? colors.primary : colors.menuTextColor
                  }
                  textStyle={{paddingVertical: heightScale1(15)}}
                  forDriveMe
                />
                {selected === (index + 11).toString() ? (
                  <Icons.Check stroke={colors.primary} width={24} height={24} />
                ) : null}
              </Pressable>
            );
          })}
        </PaddingHorizontalWrapper>
      </ScrollViewGestureHandler>
    );
  }, [selected]);

  const renderPageArea = useCallback(() => {
    return (
      <PaddingHorizontalWrapper containerStyles={{flex: 1}} forDriveMe>
        <PanGestureHandler>
          <FlashList
            data={dataArea}
            renderItem={renderItems}
            estimatedItemSize={52}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: heightScale1(30),
              paddingBottom: heightScale1(52),
            }}
            renderScrollComponent={ScrollViewGestureHandler}
          />
        </PanGestureHandler>
      </PaddingHorizontalWrapper>
    );
  }, [selected]);

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
    [selectedIndex, selected],
  );

  const renderScene = SceneMap({
    '0': renderPageNumber,
    '1': renderPageArea,
  });

  return (
    <BottomSheetModal
      ref={bottomSheetRefs}
      index={0}
      handleComponent={() => null}
      enablePanDownToClose
      topInset={insets.top + heightScale1(48)}
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}>
      <BottomSheetView style={{flex: 1}}>
        <CustomText
          string={strings.driver_register.postCode}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_7}
          color={colors.menuTextColor}
          textStyle={styles.titleText}
        />

        <TabView
          navigationState={{index: selectedIndex, routes: routes}}
          renderScene={renderScene}
          onIndexChange={setSelectedIndex}
          renderTabBar={renderTabBar}
          lazy
          animationEnabled
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default BottomSheetPostcode;

const styles = StyleSheet.create({
  titleText: {
    marginVertical: PADDING1,
    alignSelf: 'center',
  },
});
