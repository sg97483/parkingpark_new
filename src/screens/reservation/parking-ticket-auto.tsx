import {FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback, useRef, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {useAppSelector} from '~store/storeHooks';
import {useTicketInfoQuery} from '~services/parkingServices';
import {useRequestPayInfoQuery} from '~services/reservationServices';
import UsageHistoryMenuText from '~components/usage-history.tsx/usage-history-menu-text';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {PADDING} from '~constants/constant';
import {DATE_PICKER_MODE, FONT, FONT_FAMILY} from '~constants/enum';
import HStack from '~components/h-stack';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {ROUTE_KEY} from '~navigators/router';
import {getNumberWithCommas} from '~utils/numberUtils';
import {strings} from '~constants/strings';
import CouponSelector from '~components/valet-parking-reservation/coupon-selector';
import {useGetParkingCouponQuery} from '~services/couponServices';
import Divider from '~components/divider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker, {DateTimePickerRefs} from '~components/date-time-picker';
import moment from 'moment';
import {TicketProps} from '~constants/types';
import Checkbox from '~components/checkbox';
import TicketAutoItem from '~components/reservation/ticket-auto-item';
import {showMessage} from 'react-native-flash-message';

const ParkingTicketAuto = memo((props: RootStackScreenProps<'ParkingTicketAuto'>) => {
  const {navigation, route} = props;

  const parkingLotID = route?.params?.parkingLotId;

  const datePickerRef = useRef<DateTimePickerRefs>(null);

  const userInfo = useAppSelector(state => state?.userReducer?.user);
  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const [point, setPoint] = useState<string>('0');
  const [memberIDUse, setMemberIDUse] = useState<string>('0');
  const [coupon, setCoupon] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [requirements, setRequirements] = useState<string>('자동');
  const [selectedTicket, setSelectedTicket] = useState<TicketProps | null>(null);
  const [isAgreeTerms, setIsAgreeTerms] = useState<boolean>(false);

  const {data: couponList} = useGetParkingCouponQuery({
    memberId: userToken?.id,
    memberPwd: userToken?.password,
    parkingLotId: parkingLotID,
  });

  const {data: ticketList} = useTicketInfoQuery({
    id: parkingLotID,
  });

  const {data: payInfo} = useRequestPayInfoQuery({
    id: userToken?.id,
    parkingID: parkingLotID,
    pass: userToken?.password,
  });

  const mPoint = Number(userInfo?.mpoint) || 0;
  let usePoint = 0;
  if (userInfo?.usePointSum) {
    usePoint = Number(userInfo?.usePointSum);
  }

  let cancelPoint = 0;
  if (userInfo?.cancelPoint) {
    cancelPoint = Number(userInfo?.cancelPoint);
  }

  const userPoint = mPoint - usePoint + cancelPoint || 0;

  const getDayOfWeek = () => {
    const day = moment(selectedDate).day() + 1;

    switch (day) {
      case 1:
        return '(일)';
      case 2:
        return '(월)';
      case 3:
        return '(화)';
      case 4:
        return '(수)';
      case 5:
        return '(목)';
      case 6:
        return '(금)';
      case 7:
        return '(토)';
      default:
        return '';
    }
  };

  const renderItem = useCallback(
    ({item, index}: {item: TicketProps; index: number}) => {
      return (
        <TicketAutoItem
          index={index}
          item={item}
          onItemPress={() => {
            setSelectedTicket(item);
          }}
          selectedTicket={selectedTicket as TicketProps}
        />
      );
    },
    [selectedTicket],
  );

  const handleConfirm = () => {
    if (!payInfo?.cardName) {
      showMessage({
        message: '추가정보입력란 바로가기에서 수정해주세요',
      });
      return;
    }

    if (!selectedDate) {
      showMessage({
        message: '날짜를 선택해 주세요',
      });
      return;
    }

    if (!point) {
      setPoint('0');
    }

    const pointString = point.substring(point.length - 1);

    if (pointString !== '0') {
      showMessage({
        message: '1원단위는 사용불가능합니다.',
      });
      return;
    }

    if (!payInfo?.carNumber) {
      showMessage({
        message: '차량번호를 입력하시지않으셨습니다.\n상단 추가정보 입력에서 입력바랍니다.',
      });
      return;
    }

    if (!payInfo?.pnum) {
      showMessage({
        message: '핸드폰번호를 입력하시지않으셨습니다.\n상단 추가정보 입력에서 입력바랍니다.',
      });
      return;
    }

    if (Number(point) > 1000) {
      showMessage({
        message: '회당 적립금 1천원까지 사용가능합니다.',
      });
      return;
    }

    if (Number(point) > userPoint) {
      showMessage({
        message: '입력하신 적립금이 적립금 잔액보다 작습니다.',
      });
      return;
    }

    if (payInfo?.limitedNumber < 1) {
      showMessage({
        message: '현재 주차자리가 없어서 구매 불가합니다.',
      });
      return;
    }

    if (!memberIDUse) {
      setMemberIDUse('0');
    }

    if (!selectedTicket) {
      showMessage({
        message: '주차권을 선택하세요.',
      });
      return;
    }

    if (!isAgreeTerms) {
      showMessage({
        message: '위 내용을 모두 확인하세요.',
      });
      return;
    }

    navigation.navigate(ROUTE_KEY.ParkingTicketAutoDetail, {
      coupon: Number(coupon),
      memberIDUse: memberIDUse,
      parkingLotID: parkingLotID,
      payInfo: payInfo,
      requirements: requirements,
      selectedDate: selectedDate,
      selectedTicket: selectedTicket,
      usePoint: Number(point),
    });
  };

  return (
    <FixedContainer>
      <CustomHeader text="주차 이용권 구매" />

      <ScrollView nestedScrollEnabled={true}>
        <UsageHistoryMenuText
          title="주차장명"
          content={<CustomText string={payInfo?.garageName || ''} family={FONT_FAMILY.BOLD} />}
        />
        <UsageHistoryMenuText
          title="결제카드"
          content={
            <CustomText
              string={`${payInfo?.cardName} ${payInfo?.number1}********${payInfo?.number4}`}
              family={FONT_FAMILY.BOLD}
            />
          }
        />
        <UsageHistoryMenuText
          title="차량번호"
          content={<CustomText string={payInfo?.carNumber || ''} family={FONT_FAMILY.BOLD} />}
        />
        <UsageHistoryMenuText
          title="필수정보입력"
          titleColor={colors.blue}
          content={
            <View
              style={{
                width: '100%',
                padding: PADDING / 1.5,
              }}>
              <TouchableOpacity onPress={() => navigation.navigate(ROUTE_KEY.EditUserInfo)}>
                <HStack style={styles.editInfoButtonWrapper}>
                  <CustomText
                    string="추가정보 입력"
                    size={FONT.CAPTION}
                    family={FONT_FAMILY.SEMI_BOLD}
                  />
                </HStack>
              </TouchableOpacity>

              <CustomText
                string="주차권 결제시 휴대폰, 차량, 결제카드 정보 필수입력"
                size={FONT.CAPTION_3}
                family={FONT_FAMILY.SEMI_BOLD}
                color={colors.red}
                textStyle={{
                  textAlign: 'center',
                  marginTop: PADDING / 2,
                }}
              />
            </View>
          }
        />
        <UsageHistoryMenuText
          title={'이용안내\n(필독)'}
          titleColor={colors.blue}
          content={
            <CustomText
              string={payInfo?.issue_text || ''}
              textStyle={{
                padding: widthScale(5),
                textAlign: 'center',
              }}
              size={FONT.CAPTION}
              family={FONT_FAMILY.BOLD}
            />
          }
        />
        <UsageHistoryMenuText
          title="아이디입력"
          content={
            <View style={styles.contentViewWrapper}>
              <HStack>
                <View style={styles.inputWrapper}>
                  <TextInput
                    value={point}
                    placeholder="입력란"
                    onChangeText={setPoint}
                    keyboardType="numeric"
                    style={styles.input}
                    maxLength={4}
                    placeholderTextColor={colors.grayText}
                  />
                </View>

                <View
                  style={[
                    styles.inputWrapper,
                    {
                      marginHorizontal: widthScale(5),
                    },
                  ]}>
                  <TextInput
                    value={memberIDUse}
                    placeholder="입력란"
                    onChangeText={setMemberIDUse}
                    keyboardType="numeric"
                    style={styles.input}
                    multiline={false}
                    maxLength={7}
                    placeholderTextColor={colors.grayText}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                  }}>
                  <CustomText
                    string={`${getNumberWithCommas(userPoint)}${strings?.general_text?.won}`}
                    size={FONT.CAPTION_2}
                    numberOfLines={1}
                    family={FONT_FAMILY.BOLD}
                  />
                </View>
              </HStack>
            </View>
          }
        />
        <UsageHistoryMenuText
          title="쿠폰사용"
          content={
            <>
              {couponList?.length ? (
                <CouponSelector data={couponList || []} onSelect={setCoupon} />
              ) : (
                <CustomText string="쿠폰없음" size={FONT.CAPTION} family={FONT_FAMILY.SEMI_BOLD} />
              )}
            </>
          }
        />
        <UsageHistoryMenuText
          title={'주차 실시간\n가능면수'}
          content={
            <HStack>
              <CustomText
                string={`${payInfo?.limitedNumber} ${payInfo?.dayNameGubun}`}
                family={FONT_FAMILY.BOLD}
                color={colors.blue}
                size={FONT.TITLE_3}
              />
              <CustomText string=" 면" size={FONT.CAPTION} family={FONT_FAMILY.SEMI_BOLD} />
            </HStack>
          }
          isLastIndex={true}
        />

        {/* Parking hours and fees */}
        <View style={styles.feeViewWrapper}>
          <View style={styles.titleWrapper}>
            <CustomText
              string="주차시간 및 이용요금"
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.CAPTION}
            />
          </View>

          <Divider darkLine />

          <View
            style={{
              padding: PADDING / 2,
            }}>
            {/* Date */}
            <HStack
              style={{
                marginBottom: PADDING / 2,
              }}>
              <TouchableOpacity
                onPress={() => datePickerRef?.current?.show()}
                style={styles.calendarButtonWrapper}>
                <HStack>
                  <Icon name="calendar-month-outline" size={widthScale(22)} color={colors.blue} />
                  <CustomText
                    string=" 날짜선택"
                    size={FONT.CAPTION}
                    family={FONT_FAMILY.SEMI_BOLD}
                  />
                </HStack>
              </TouchableOpacity>
              <View style={{flex: 1, alignItems: 'center'}}>
                {selectedDate ? (
                  <CustomText
                    string={`${moment(selectedDate).format('YYYY년 MM월 DD일')} ${getDayOfWeek()}`}
                    family={FONT_FAMILY.BOLD}
                  />
                ) : null}
              </View>
            </HStack>

            <UsageHistoryMenuText
              title={'주차장 입차\n예정시간'}
              isLastIndex
              content={
                <View
                  style={[
                    styles.contentViewWrapper,
                    {
                      padding: 0,
                    },
                  ]}>
                  <TextInput
                    value={requirements}
                    onChangeText={setRequirements}
                    placeholder="자동"
                    style={[
                      styles.inputWrapper,
                      {
                        width: '100%',
                        flex: 1,
                      },
                    ]}
                    placeholderTextColor={colors.grayText}
                  />
                </View>
              }
              noPadding
            />

            <View style={{height: PADDING / 2}} />

            <FlatList
              data={ticketList}
              numColumns={3}
              renderItem={renderItem}
              scrollEnabled={false}
              keyExtractor={(_, index) => `${index}`}
              contentContainerStyle={{
                paddingBottom: PADDING / 2,
              }}
            />

            <Divider />

            <HStack
              style={{
                marginTop: PADDING / 2,
                alignItems: 'flex-start',
              }}>
              <Icon name="map-marker-alert" size={widthScale(30)} color={colors.darkGray} />
              <View style={{flex: 1, marginLeft: widthScale(5)}}>
                <CustomText
                  size={FONT.CAPTION}
                  color={colors.darkGray}
                  string={
                    '주차비 결제완료 후 결제확인 문자를 보내드립니다.\n정해진 시간에 출차가 이루어져야 합니다.\n이후 출차시 주차비가 추가로 부과됩니다.\n주차권은 적어도 하루전에 미리 구매하시는 것이 좋습니다.\n적립금 사용시 회당 1,000원 까지 사용가능합니다.'
                  }
                />
              </View>
            </HStack>
          </View>
        </View>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginBottom: PADDING,
          }}
          onPress={() => setIsAgreeTerms(!isAgreeTerms)}>
          <HStack>
            <Checkbox isChecked={isAgreeTerms} onPress={() => setIsAgreeTerms(!isAgreeTerms)} />
            <CustomText string=" 위 내용을 모두 확인했습니다." />
          </HStack>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
        <CustomText string="결제 계속하기" family={FONT_FAMILY.BOLD} color={colors.white} />
      </TouchableOpacity>

      <DateTimePicker ref={datePickerRef} mode={DATE_PICKER_MODE.DATE} onSelect={setSelectedDate} />
    </FixedContainer>
  );
});

export default ParkingTicketAuto;

const styles = StyleSheet.create({
  editInfoButtonWrapper: {
    backgroundColor: colors.gray,
    alignSelf: 'center',
    paddingHorizontal: PADDING,
    paddingVertical: PADDING / 2,
    borderRadius: widthScale(5),
    borderWidth: 1,
    borderColor: colors.darkGray,
  },
  contentViewWrapper: {
    width: '100%',
    padding: widthScale(3),
  },
  inputWrapper: {
    backgroundColor: colors.gray,
    minHeight: heightScale(45),
    width: widthScale(80),
    paddingHorizontal: widthScale(5),
    borderColor: colors.darkGray,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: colors.red,
    fontFamily: FONT_FAMILY.BOLD,
  },
  feeViewWrapper: {
    borderWidth: 1,
    borderColor: colors.darkGray,
    margin: PADDING,
  },
  titleWrapper: {
    minHeight: heightScale(45),
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarButtonWrapper: {
    borderWidth: 1,
    paddingHorizontal: PADDING / 2,
    paddingVertical: PADDING / 3,
    borderRadius: widthScale(5),
    borderColor: colors.darkGray,
    marginRight: widthScale(5),
  },
  confirmButton: {
    minHeight: heightScale(50),
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
