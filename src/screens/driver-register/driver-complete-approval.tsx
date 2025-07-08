import React, {useMemo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {IMAGES} from '~/assets/images-path';
import CustomButton from '~components/commons/custom-button';
import LineButton from '~components/commons/line-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheIsFirstTimeApproval} from '~reducers/carpoolReducer';
import {changeCarpoolMode} from '~reducers/userReducer';
import {useGetMyDriverRoadQuery} from '~services/carpoolServices';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';

const DriverCompleteApproval = (props: RootStackScreenProps<'DriverCompleteApproval'>) => {
  const {navigation} = props;

  const {CMemberID, userID} = userHook();
  const dispatch = useAppDispatch();

  const {data} = useGetMyDriverRoadQuery({id: CMemberID!, memberId: userID!});

  const haveRoadRider = useMemo(
    () =>
      (!!data?.startPlaceIn &&
        !!data?.startTimeIn &&
        !!data?.splatIn &&
        !!data?.splngIn &&
        !!data?.endPlaceIn &&
        !!data?.eplatIn &&
        !!data?.eplngIn &&
        !!data?.priceIn) ||
      (!!data?.startPlaceOut &&
        !!data?.startTimeOut &&
        !!data?.splatOut &&
        !!data?.splngOut &&
        !!data?.endPlaceOut &&
        !!data?.eplatOut &&
        !!data?.eplngOut &&
        !!data?.priceOut),

    [data],
  );

  return (
    <FixedContainer edges={['bottom', 'top']}>
      <CustomHeader
        hideBack
        rightContent={
          <LineButton
            text="닫기"
            onPress={() => navigation.navigate(ROUTE_KEY.ParkingParkHome, {selectedTab: 2})}
          />
        }
      />
      <View style={styles.container}>
        <Image
          source={IMAGES.finish_approval}
          style={{width: widthScale1(100), height: heightScale1(120)}}
          resizeMode="contain"
        />
        <CustomText
          string="드라이버 승인이 완료되었습니다."
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_8}
          color={colors.black}
          textStyle={{marginTop: heightScale1(30), textAlign: 'center'}}
          lineHeight={fontSize1(28)}
          forDriveMe
        />
      </View>
      <PaddingHorizontalWrapper
        forDriveMe
        containerStyles={{
          marginBottom: PADDING1 / 2,
        }}>
        <CustomButton
          text={haveRoadRider ? '태워줘 시작하기' : '경로 등록하기'}
          onPress={() => {
            dispatch(cacheIsFirstTimeApproval(false));
            if (haveRoadRider) {
              requestAnimationFrame(() => {
                dispatch(changeCarpoolMode('DRIVER'));
                navigation.navigate(ROUTE_KEY.ParkingParkHome, {selectedTab: 3});
              });
            } else {
              requestAnimationFrame(() => {
                navigation.navigate(ROUTE_KEY.DriverWayToWork1);
              });
            }
          }}
          buttonHeight={58}
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default DriverCompleteApproval;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
