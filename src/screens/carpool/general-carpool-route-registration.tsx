import React from 'react';
import {Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IMAGES} from '~/assets/images-path';
import {Icons} from '~/assets/svgs';
import Star from '~/assets/svgs/Star';
import ItemDriverReservation from '~components/cancel-reservation/item-driver-reservation';
import CustomButton from '~components/commons/custom-button';
import IconButton from '~components/commons/icon-button';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import TickText from '~components/route-to-stopover-registration-completed/tick-text';
import VerificationCompleted from '~components/route-to-stopover-registration-completed/verification-completed';
import {IS_ANDROID, PADDING, PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {RecommendDriverProps, RoadRouteWorkProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {dayjs} from '~utils/dayjsUtil';
import {generateRandomId} from '~utils/encrypt';

const data: RecommendDriverProps = {
  id: '2',
  arriveAddress: '서울대 입구역 1번출구',
  carpoolRequestAmount: 10000,
  date: dayjs().toString(),
  driverAvatar: 'https://i.pravatar.cc/300',
  driverName: '닉네임',
  isVerify: true,
  numOfCarpool: 3,
  startAddress: '성수역 2번 출구',
  timeArrive: '08:08',
  timeStart: '07:30',
  isParking: false,
};

const GeneralCarPoolRouteRegistration = (
  props: RootStackScreenProps<'GeneralCarPoolRouteRegistration'>,
) => {
  const {navigation} = props;

  const insertSafe = useSafeAreaInsets();

  const route: RoadRouteWorkProps = {
    arriveAddress: '건대 커먼그라운드',
    startAddress: '낙성대역 2호선 3번출구',
    price: '9000',
    timeArrive: '07:30',
    timeStart: '07:30',
    stopOverAddress: '',
    priceStop: '',
  };

  return (
    <FixedContainer edges={['bottom']}>
      <IconButton
        icon={<Icons.ChevronLeft />}
        onPress={() => navigation.goBack()}
        position={{left: PADDING1, top: heightScale1(54)}}
      />
      <KeyboardAvoidingView style={{flex: 1}} behavior={IS_ANDROID ? undefined : 'position'}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: '100%',
              height: heightScale1(380) + insertSafe.top,
              backgroundColor: colors.gray,
            }}
          />

          <View style={{borderBottomWidth: 1, borderBottomColor: colors.policy}}>
            <ItemDriverReservation route={route} wayToWork noneDivider hideChevron />
          </View>

          <View style={[styles.view3]}>
            <View style={styles.view3Content}>
              <View style={styles.view1}>
                <Image source={IMAGES.event_banner_1} style={styles.imageAvatar} />
                <View>
                  <View style={styles.view1}>
                    <CustomText size={FONT.SUB_HEAD} string="닉네임 드라이버님" forDriveMe />
                    <VerificationCompleted />
                  </View>
                  <CustomText color={colors.lineCancel} string="총 카풀횟수 3회" forDriveMe />
                </View>
              </View>
              <Pressable onPress={() => navigation.navigate(ROUTE_KEY.PassengerProfile)}>
                <Star stroke={colors.grayText} />
              </Pressable>
            </View>
            <CustomText textStyle={{marginTop: heightScale1(20)}} string="자기소개" forDriveMe />
            <View style={styles.textContent}>
              <CustomText
                family={FONT_FAMILY.MEDIUM}
                color={colors.menuTextColor}
                lineHeight={fontSize1(20)}
                string="안녕하세요. 지루한 퇴근길 즐겁게 함께 카풀하면서 출퇴근 해요. 안심하고 카풀 신청하시면됩니다."
                forDriveMe
              />
            </View>
            <TickText key={generateRandomId()} text="면허증 인증완료" />
            <TickText key={generateRandomId()} text="보험 인증완료" />
            <TickText key={generateRandomId()} text="백신접종 인증완료" />
            <TickText key={generateRandomId()} text="명함 인증완료" />
          </View>
          <PaddingHorizontalWrapper containerStyles={{marginVertical: PADDING1 / 2}} forDriveMe>
            <CustomButton
              text={strings.car_pool.reply_requirements}
              onPress={() => navigation.navigate(ROUTE_KEY.CarPoolRouteChoice)}
              buttonHeight={58}
            />
          </PaddingHorizontalWrapper>
        </ScrollView>
      </KeyboardAvoidingView>
    </FixedContainer>
  );
};

export default GeneralCarPoolRouteRegistration;

const styles = StyleSheet.create({
  view3: {
    marginHorizontal: PADDING,
    marginTop: heightScale1(30),
    marginBottom: heightScale1(58),
    backgroundColor: colors.policy,
    padding: PADDING,
    borderRadius: 10,
  },
  view3Content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewStar: {
    backgroundColor: colors.evaluateBackground,
    padding: widthScale1(22),
    borderRadius: 8,
  },
  view1: {flexDirection: 'row', alignItems: 'center'},
  textContent: {
    padding: widthScale1(15),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.disableButton,
    marginTop: heightScale1(10),
    minHeight: heightScale1(110),
    marginBottom: heightScale1(20),
  },
  imageAvatar: {
    width: widthScale1(40),
    height: widthScale1(40),
    borderRadius: 100,
    marginRight: widthScale1(6),
  },
});
