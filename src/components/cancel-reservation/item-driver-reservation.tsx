import React, {memo, ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {RoadRouteWorkProps} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

interface Props {
  wayToWork?: boolean;
  noneShowDate?: boolean;
  bottomContent?: React.ReactElement;
  rightContentHeader?: ReactNode;
  noneShowPrice?: boolean;
  textStatus?: string;
  colorStatus?: string;
  noneDivider?: boolean;
  route: RoadRouteWorkProps;
  onPress?: () => void;
  hideChevron?: boolean;
}
const ItemDriverReservation = (props: Props) => {
  const {
    wayToWork,
    noneShowDate,
    bottomContent,
    noneShowPrice,
    textStatus,
    colorStatus,
    rightContentHeader,
    noneDivider,
    route,
    onPress,
    hideChevron,
  } = props;

  return (
    <>
      <View style={styles.view}>
        <View style={[styles.view1]}>
          <HStack>
            <RouteBadge type={wayToWork ? 'WAY_WORK' : 'WAY_HOME'} />
            <CustomText
              string={textStatus || ''}
              color={colorStatus}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_4}
              lineHeight={fontSize1(15)}
            />
          </HStack>

          {rightContentHeader || null}
        </View>
        {!noneShowDate && (
          <CustomText
            textStyle={styles.textDate}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.BODY}
            string="2023.10.11.(화)"
            lineHeight={fontSize1(25)}
          />
        )}
        <RoutePlanner
          arriveAddress={route.arriveAddress ?? ''}
          startAddress={route.startAddress ?? ''}
          timeArrive={route.timeArrive ?? ''}
          timeStart={route.timeStart ?? ''}
          stopOverAddress={route.stopOverAddress ?? ''}
        />

        {!noneShowPrice && (
          <InfoPriceRoute
            onPress={onPress}
            style={{marginBottom: heightScale1(10)}}
            price={route.price}
            hideChevron={hideChevron}
            soPrice={route?.priceStop?.toString() === '0' ? '' : route?.priceStop}
          />
        )}
        {bottomContent}
      </View>

      {!noneDivider && <View style={styles.divider} />}
    </>
  );
};

export default memo(ItemDriverReservation);

const styles = StyleSheet.create({
  view: {marginTop: heightScale1(30), marginHorizontal: PADDING1, paddingBottom: PADDING1},
  viewCenter: {marginTop: heightScale1(20), flexDirection: 'row', marginBottom: heightScale1(30)},
  view2: {justifyContent: 'space-between'},
  divider: {width: '100%', height: 1, backgroundColor: colors.policy},
  textContent: {marginTop: heightScale1(6)},
  textDate: {marginTop: heightScale1(4)},
  view1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: PADDING1,
  },
  text20: {lineHeight: heightScale1(20)},
  border: {
    width: widthScale1(9),
    height: widthScale1(9),
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 100,
  },
  borderBlack: {
    width: widthScale1(9),
    height: widthScale1(9),
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 100,
    backgroundColor: colors.black,
  },
  line: {height: heightScale1(25), width: 1, backgroundColor: colors.black},
  line18: {height: heightScale1(18), width: 1, backgroundColor: colors.black},
  viewLine: {alignItems: 'center', marginTop: scale1(6), marginRight: widthScale1(10)},
  viewBlack: {
    backgroundColor: colors.black,
    width: widthScale1(45),
    height: heightScale1(27),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginRight: widthScale1(10),
  },
  viewBottom: {flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'},
  bottom: {
    marginTop: heightScale1(20),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  dot: {
    width: 1,
    height: 2,
    borderRadius: 100,
    backgroundColor: colors.black,
    marginVertical: 1,
  },
  viewPark: {height: heightScale1(33), alignItems: 'center', flexDirection: 'row'},
});
