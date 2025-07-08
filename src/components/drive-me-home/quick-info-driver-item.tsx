import moment from 'moment';
import React, {memo, useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import Avatar from '~components/commons/avatar';
import InfoPriceRoute from '~components/commons/info-price-route';
import RouteBadge from '~components/commons/route-badge';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import RoutePlanner from '~components/recommend-driver-list/route-planner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {DriverRoadDayModel} from '~model/driver-model';
import {useGetDrivingDirectionQuery} from '~services/naverMapServices';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  item: DriverRoadDayModel;
  onPress: () => void;
}

const QuickInfoDriverItem: React.FC<Props> = memo(props => {
  const {item, onPress} = props;

  const isHaveStopOverPlace = useMemo(
    (): boolean =>
      item?.stopOverPlace && item?.soplat && item?.soplng && item?.soPrice && item?.soPrice !== '0'
        ? true
        : false,
    [item],
  );

  const {data: direction} = useGetDrivingDirectionQuery(
    {
      start: `${item?.splng},${item?.splat}`,
      end: `${item?.eplng},${item?.eplat}`,
      waypoints: isHaveStopOverPlace ? `${item?.soplng},${item?.soplat}` : '',
    },
    {skip: !item},
  );

  return (
    <Pressable onPress={onPress}>
      <PaddingHorizontalWrapper forDriveMe>
        <HStack
          style={{
            gap: widthScale1(10),
          }}>
          <RouteBadge type={item?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'} />

          {item?.selectDay ? (
            <CustomText
              string={item?.selectDay ?? ''}
              size={FONT.BODY}
              family={FONT_FAMILY.SEMI_BOLD}
              forDriveMe
            />
          ) : null}

          <CustomText
            color={item?.selectDay ? colors.heavyGray : colors.lineInput}
            family={FONT_FAMILY.SEMI_BOLD}
            string={item?.selectDay ? '등록완료' : '등록예정'}
            forDriveMe
          />
        </HStack>

        {/* Driver profile section */}
        <HStack
          style={{
            gap: widthScale1(6),
            marginTop: heightScale1(5),
            marginBottom: heightScale1(16),
          }}>
          <Avatar
            uri={item?.profileImageUrl ?? ''}
            size={22}
            blurImage={item?.selectDay ? false : true}
          />

          <HStack>
            <CustomText
              numberOfLines={1}
              textStyle={{maxWidth: widthScale1(130)}}
              family={FONT_FAMILY.MEDIUM}
              forDriveMe
              string={`${item?.nic} `}
            />
            <CustomText
              numberOfLines={1}
              family={FONT_FAMILY.MEDIUM}
              forDriveMe
              string={'드라이버님 '}
            />
            {item?.selectDay && <Icons.VerificationMark />}
          </HStack>

          <CustomText
            string={`총 카풀횟수 ${item?.driverCnt ?? 0}회`}
            family={FONT_FAMILY.MEDIUM}
            size={FONT.CAPTION}
            color={colors.lineCancel}
            textStyle={{flexShrink: 1}}
            numberOfLines={1}
            forDriveMe
          />
        </HStack>

        <View>
          <RoutePlanner
            timeStart={item?.startTime ?? ''}
            timeArrive={moment(item?.startTime, 'HH:mm')
              .add(direction?.duration, 'minutes')
              .format('HH:mm')}
            startAddress={item?.startPlace ?? ''}
            arriveAddress={item?.endPlace ?? ''}
            stopOverAddress={isHaveStopOverPlace ? item?.stopOverPlace : ''}
          />
        </View>

        <HStack
          style={{
            gap: widthScale1(4),
            justifyContent: 'flex-end',
            marginTop: PADDING1,
          }}>
          <InfoPriceRoute
            price={item?.price ?? ''}
            soPrice={isHaveStopOverPlace ? item?.soPrice : ''}
            onPress={onPress}
          />
        </HStack>
      </PaddingHorizontalWrapper>
    </Pressable>
  );
});

export default QuickInfoDriverItem;

const styles = StyleSheet.create({
  favoriteButton: {
    marginLeft: 'auto',
  },
});
