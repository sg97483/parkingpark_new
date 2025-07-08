import {useNavigation} from '@react-navigation/native';
import React, {forwardRef, useCallback, useImperativeHandle, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icons} from '~/assets/svgs';
import {MyDriverModel} from '~/model/driver-model';
import FloatingButton from '~components/commons/floating-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1, WIDTH} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {CarpoolPayHistoryModel} from '~model/passenger-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import MainRoute from './MainRoute';
import MainFilter from './main-filter';

interface Props {
  onLayout: (height: number) => void;
  myRoadInfo?: MyDriverModel;
  haveAReservationIsRunning?: CarpoolPayHistoryModel | undefined;
}

export interface MapHeaderRefs {
  showRecommandDriverButton: (value: boolean) => void;
}

const MapHeader = forwardRef((props: Props, ref) => {
  const {onLayout, myRoadInfo, haveAReservationIsRunning} = props;
  const insets = useSafeAreaInsets();
  const naviagtion: UseRootStackNavigation = useNavigation();

  const [showRecommandButton, setShowRecommandButton] = useState<boolean>(true);

  const showRecommandDriverButton = useCallback((value: boolean) => {
    setShowRecommandButton(value);
  }, []);

  useImperativeHandle(ref, () => ({showRecommandDriverButton}), []);

  return (
    <View
      onLayout={e => {
        onLayout && onLayout(e?.nativeEvent?.layout?.height - PADDING1 - heightScale1(54));
      }}
      style={[
        styles.containerStyle,
        {
          paddingTop: insets.top + PADDING1,
          zIndex: 1,
          paddingBottom: PADDING1 / 2,
        },
      ]}>
      <MainRoute myRoadInfo={myRoadInfo as MyDriverModel} />

      <MainFilter />

      <HStack style={styles.buttonWrapperStyle}>
        {showRecommandButton && (
          <FloatingButton
            text="추천"
            type="light-blue"
            icon={
              <Icons.ChevronRight
                stroke={colors.success}
                width={widthScale1(17)}
                height={widthScale1(17)}
              />
            }
            iconPosition="right"
            onPress={() => naviagtion.navigate(ROUTE_KEY.RecommendDriverList)}
          />
        )}

        {haveAReservationIsRunning ? (
          <Pressable
            onPress={() => {
              naviagtion.navigate(ROUTE_KEY.Running, {
                item: haveAReservationIsRunning,
              });
            }}
            style={styles.runingButtonStyle}>
            <CustomText
              color={colors.primary}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              string="운행중"
            />
          </Pressable>
        ) : null}
      </HStack>
    </View>
  );
});

export default React.memo(MapHeader);

const styles = StyleSheet.create({
  containerStyle: {
    position: 'absolute',
    width: '100%',
    alignItems: 'flex-start',
    gap: heightScale1(12),
  },
  buttonWrapperStyle: {
    marginLeft: PADDING1,
    marginRight: PADDING1,
    width: WIDTH - PADDING1 * 2,
  },
  runingButtonStyle: {
    width: widthScale1(69),
    height: heightScale1(40),
    borderWidth: 1,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.primary,
    backgroundColor: colors.white,
    marginLeft: 'auto',
  },
});
