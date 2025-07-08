import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {FC, memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomButton from '~components/commons/custom-button';
import RouteBadge from '~components/commons/route-badge';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT} from '~constants/enum';
import {RoadInDriverUpdateProps} from '~constants/types';
import {RouteRegisterModel} from '~model/driver-model';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';
import {dayjs} from '~utils/dayjsUtil';

interface CarpoolProps {
  route: RouteRegisterModel;
  routeInRegistered?: RoadInDriverUpdateProps;
  isPastDay: boolean;
}

const CarpoolNotRegister: FC<CarpoolProps> = memo(props => {
  const {route, routeInRegistered, isPastDay} = props;
  const navigation = useNavigation<UseRootStackNavigation>();
  const currentDay = moment().format('YYYY.MM.DD');

  const disableSubmit = useMemo((): boolean => {
    const selectedDay = route?.selectDate?.slice(0, 10);
    const hour = dayjs().hour();

    if (moment(currentDay, 'YYYY.MM.DD').isBefore(moment(selectedDay, 'YYYY.MM.DD'))) {
      return false;
    }
    if (moment(currentDay, 'YYYY.MM.DD').isSame(moment(selectedDay, 'YYYY.MM.DD'))) {
      if (route?.carInOut === 'in') {
        if (hour >= 9) {
          return true;
        } else {
          return false;
        }
      }
      if (route?.carInOut === 'out') {
        if (hour >= 20) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }

    return true;
  }, [route, currentDay]);

  const handle = () => {
    navigation.navigate(ROUTE_KEY.CarPoolRouteChoice, {
      route: route,
      routeInRegistered: routeInRegistered,
    });
  };

  return (
    <HStack style={styles.container}>
      <View>
        <RouteBadge
          type={route?.carInOut === 'in' ? 'WAY_WORK' : 'WAY_HOME'}
          disabled={isPastDay}
        />

        <CustomText
          string={'일정없음'}
          size={FONT.CAPTION_6}
          color={colors.disableButton}
          textStyle={{marginTop: heightScale1(20)}}
          forDriveMe
        />
      </View>

      {isPastDay ? null : (
        <CustomButton
          text="등록하기"
          onPress={handle}
          type={'SECONDARY'}
          buttonHeight={38}
          buttonStyle={{paddingHorizontal: widthScale1(10)}}
          textSize={FONT.CAPTION_6}
          borderRadiusValue={6}
          disabled={disableSubmit}
        />
      )}
    </HStack>
  );
});

export default CarpoolNotRegister;

const styles = StyleSheet.create({
  container: {justifyContent: 'space-between', paddingHorizontal: widthScale1(20)},
  registerButton: {
    backgroundColor: colors.heavyGray,
    borderRadius: scale1(6),
    height: scale1(38),
    width: scale1(69),
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestTag: {
    backgroundColor: colors.verificationSuccess,
    paddingVertical: heightScale1(4),
    paddingHorizontal: widthScale1(6),
    borderRadius: scale1(4),
    marginTop: heightScale1(20),
    marginBottom: heightScale1(10),
    alignSelf: 'flex-start',
  },
  suggestRoute: {
    justifyContent: 'space-between',
    backgroundColor: colors.policy,
    borderRadius: scale1(8),
    paddingVertical: heightScale1(14),
    paddingHorizontal: widthScale1(16),
  },
});
