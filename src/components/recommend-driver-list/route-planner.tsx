import React, {memo, useMemo, useState} from 'react';
import {View} from 'react-native';
import Dash from 'react-native-dash';
import {Icons} from '~/assets/svgs';
import Point from '~components/commons/point';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  timeStart: string;
  timeArrive: string;
  stopOverAddress?: string;
  startAddress: string;
  arriveAddress: string;
  isParking?: boolean;
  isParkingFrom?: boolean;
  hideExpectations?: boolean;
  isParkingStop?: boolean;
}

const RoutePlanner: React.FC<Props> = memo(props => {
  const {
    arriveAddress,
    startAddress,
    stopOverAddress,
    timeArrive,
    timeStart,
    isParking,
    hideExpectations,
    isParkingFrom,
    isParkingStop,
  } = props;

  const [element1Height, setElement1Height] = useState<number>(0);
  const [element2Height, setElement2Height] = useState<number>(0);
  const [element3Height, setElement3Height] = useState<number>(0);

  const renderLine = useMemo(() => {
    return (
      <View
        style={{
          position: 'absolute',
          left: widthScale1(48 + 4.25),
          top: element1Height,
        }}>
        <View
          style={{
            width: 1,
            height: stopOverAddress ? element1Height + element2Height / 4 : element1Height,
            backgroundColor: colors.heavyGray,
          }}
        />

        {stopOverAddress ? (
          <Dash
            dashLength={4}
            dashGap={1}
            dashColor={colors.heavyGray}
            dashThickness={1}
            style={{height: element2Height / 2, flexDirection: 'column'}}
          />
        ) : null}

        <View
          style={{
            width: 1,
            height: stopOverAddress ? element3Height + element2Height / 4 : element3Height,
            backgroundColor: colors.heavyGray,
          }}
        />
      </View>
    );
  }, [element1Height, element2Height, element3Height, stopOverAddress]);

  return (
    <View>
      {renderLine}

      {/* Start Place */}
      <HStack
        style={{
          minHeight: heightScale1(35),
        }}
        onLayout={e => {
          setElement1Height(e?.nativeEvent?.layout?.height / 2);
        }}>
        <View style={{width: widthScale1(48)}}>
          <CustomText
            string={timeStart || '00:00'}
            forDriveMe
            color={colors.lineCancel}
            lineHeight={20}
            numberOfLines={1}
          />
        </View>

        <Point />
        <HStack style={{flexShrink: 1, marginLeft: widthScale1(10), gap: widthScale1(6)}}>
          {isParkingFrom && <Icons.LocalParking />}
          <CustomText
            string={startAddress}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            lineHeight={20}
            textStyle={{
              flexShrink: 1,
            }}
            color={colors.black}
          />
        </HStack>
      </HStack>

      {/* Stopover Place */}
      {stopOverAddress && (
        <HStack
          style={{
            minHeight: heightScale1(35),
          }}
          onLayout={e => {
            setElement2Height(e?.nativeEvent?.layout?.height);
          }}>
          <View style={{width: widthScale1(48)}}>
            <CustomText
              string="경유지"
              forDriveMe
              lineHeight={20}
              color={colors.lineInput}
              numberOfLines={1}
            />
          </View>

          <Point transparent />
          {isParkingStop && <Icons.LocalParking />}

          <CustomText
            string={stopOverAddress}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            lineHeight={20}
            textStyle={{
              marginLeft: widthScale1(10),
              flexShrink: 1,
            }}
            color={colors.black}
          />
        </HStack>
      )}

      {/* End Place */}
      <HStack
        style={{
          minHeight: heightScale1(35),
        }}
        onLayout={e => {
          setElement3Height(e?.nativeEvent?.layout?.height / 2);
        }}>
        <View style={{width: widthScale1(48)}}>
          {!hideExpectations && (
            <CustomText
              forDriveMe
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION_4}
              string="예상도착"
              color={colors.lineCancel}
              lineHeight={15}
              numberOfLines={1}
            />
          )}

          <CustomText
            string={timeArrive}
            numberOfLines={1}
            forDriveMe
            color={colors.lineCancel}
            lineHeight={20}
            textStyle={{flexShrink: 1}}
          />
        </View>

        <Point type="ARRIVE" />

        <HStack style={{flexShrink: 1, marginLeft: widthScale1(10), gap: widthScale1(6)}}>
          {isParking && <Icons.LocalParking />}

          <CustomText
            string={arriveAddress}
            forDriveMe
            family={FONT_FAMILY.MEDIUM}
            lineHeight={20}
            textStyle={{
              flexShrink: 1,
            }}
            color={colors.black}
          />
        </HStack>
      </HStack>
    </View>
  );
});

export default RoutePlanner;
