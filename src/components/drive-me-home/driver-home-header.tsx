import {useNavigation} from '@react-navigation/native';
import React, {FC, memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {changeCarpoolMode} from '~reducers/userReducer';
import {useGetMyRiderRoadQuery} from '~services/carpoolServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

const DriverHomeHeader: FC = memo(props => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<UseRootStackNavigation>();

  const {CMemberID, userID} = userHook();
  const {data: passengerDataRoad} = useGetMyRiderRoadQuery({
    memberId: userID as number,
    id: CMemberID as number,
  });

  const isRegisteredPassengerRoad = useMemo(
    () =>
      passengerDataRoad?.startPlaceIn &&
      passengerDataRoad?.startPlaceOut &&
      passengerDataRoad?.endPlaceIn &&
      passengerDataRoad?.endPlaceOut,
    [passengerDataRoad],
  );

  const onChangeCarpoolMode = () => {
    if (isRegisteredPassengerRoad) {
      showMessage({
        message: '탑승객 모드로 전환되었습니다.',
        position: 'bottom',
        style: {marginBottom: 30},
      });
      dispatch(changeCarpoolMode('PASSENGER'));
    } else {
      navigation.navigate(ROUTE_KEY.DriverCommunicationRegistration, {isPassenger: true});
    }
  };

  return (
    <HStack style={styles.container}>
      <CustomText
        string={strings.drive_me_home.title}
        size={FONT.BODY}
        family={FONT_FAMILY.SEMI_BOLD}
        lineHeight={heightScale1(25)}
        textStyle={{
          flexShrink: 1,
        }}
        forDriveMe
      />
      {/*
      <CustomButton
        type="TERTIARY"
        outLine
        buttonHeight={38}
        text={strings.drive_me_home.switch_mode}
        textSize={FONT.CAPTION_6}
        leftIconReload
        iconType="SWITCH_ACCOUNT"
        onPress={onChangeCarpoolMode}
        borderRadiusValue={6}
        buttonStyle={{
          paddingHorizontal: widthScale1(10),
        }}
      />
      */}
    </HStack>
  );
});

export default DriverHomeHeader;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    marginVertical: heightScale1(20),
  },
  buttonContainer: {
    paddingVertical: heightScale1(9),
    paddingHorizontal: widthScale1(10),
    borderRadius: scale1(6),
    borderWidth: scale1(1),
    borderColor: colors.disableButton,
    backgroundColor: colors.white,
  },
  iconContainer: {marginRight: widthScale1(2)},
});
