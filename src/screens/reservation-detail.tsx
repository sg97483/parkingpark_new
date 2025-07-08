import moment from 'moment';
import React, {memo, useRef} from 'react';
import {Image, ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {ICONS} from '~/assets/images-path';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import AutoPayPopup, {AutoPayRefs} from '~components/usage-history.tsx/autopay-popup';
import CancelPaymentRecheckPopup, {
  CancelPaymentRecheckRefs,
} from '~components/usage-history.tsx/cancel-payment-recheck-popup';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useRequestRevocableQuery} from '~services/usageHistoryServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, heightScale1, widthScale} from '~styles/scaling-utils';
import {getDayName} from '~utils/hourUtils';
import {getMonthYearFromDtm, getYearMonthDateFromDtm} from '~utils/index';
import {getNumberWithCommas} from '~utils/numberUtils';
import CustomButton from '~components/commons/custom-button';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import ModalOfflineCancelPopup from '~components/modal-offlinecancel-popup'; // 수정된 부분

interface IRowItem {
  title: string;
  value: string;
  valueTextColor?: string;
  isShowButton?: boolean;
  buttonStyle?: ViewStyle;
  onPress?: () => void;
}

const RowItem = ({title, value, valueTextColor, isShowButton, buttonStyle, onPress}: IRowItem) => {
  return (
    <HStack style={styles.rowContainer}>
      <CustomText string={title} />

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <CustomText string={value} family={FONT_FAMILY.SEMI_BOLD} color={valueTextColor} />
        {isShowButton ? (
          <TouchableOpacity style={[styles.buttonWrapper, buttonStyle]} onPress={onPress}>
            <CustomText
              string="영수증 발행"
              size={FONT.CAPTION_2}
              color={colors.white}
              family={FONT_FAMILY.SEMI_BOLD}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </HStack>
  );
};

const ReservationDetail = memo((props: RootStackScreenProps<'ReservationDetail'>) => {
  const {route, navigation} = props;

  const reservation = route?.params?.item;

  const userToken = useAppSelector(state => state?.userReducer?.userToken);

  const {data: revocable} = useRequestRevocableQuery({
    historyID: reservation?.id,
    memberID: userToken?.id,
    memberPass: userToken?.password,
  });

  const cancelPopupRef = useRef<CancelPaymentRecheckRefs>(null);

  const autoPayComfirmRef = useRef<AutoPayRefs>(null); // 수정된 부분

  const helpofflinCancelReservationRef = useRef<any>(null);

  const userInfo = useAppSelector(state => state?.userReducer?.user);

  const productsList: string[] = ['60001', '60002', '60003', '60004', '60005'];

  const valetList: string[] = ['70001', '70002'];

  const getDateOfUse = () => {
    if (valetList?.includes(reservation?.parkingLotId)) {
      return reservation?.requirements;
    } else {
      let stDtm =
        getYearMonthDateFromDtm(reservation?.reservedStDtm) +
        ` (${getDayName(moment(reservation?.reservedStDtm, 'YYYYMMDDHHmm').valueOf())})`;

      let edDtm =
        getYearMonthDateFromDtm(reservation?.reservedEdDtm) +
        ` (${getDayName(moment(reservation?.reservedEdDtm, 'YYYYMMDDHHmm').valueOf())})`;
      if (stDtm === edDtm) {
        return stDtm;
      } else {
        let edDtmTextShort = getMonthYearFromDtm(reservation?.reservedEdDtm);
        return `${stDtm} ~ ${edDtmTextShort}`;
      }
    }
  };

  const handleCancel = () => {
    if (!reservation?.reservedStDtm || reservation?.reservedStDtm?.length < 8) {
      showMessage({
        message: '취소할 수 없습니다. 고객센터 혹은 문의게시판에 문의부탁드립니다.',
      });
      navigation.navigate(ROUTE_KEY.ContactUs);
    }

    if (!reservation?.authDate) {
      showMessage({
        message: '직접 취소가 불가능합니다. 게시판을 이용해주세요.',
      });
      navigation.navigate(ROUTE_KEY.ContactUs);
    }

    if (reservation?.TotalTicketType === '자동결제(후불) 서비스 신청') {
      cancelPopupRef?.current?.show(
        '자동결제서비스를 취소 하시겠습니까?',
        reservation?.id,
        reservation?.amt,
      );
    } else {
      if (reservation?.TotalTicketType) {
        const currentDateTime = moment().valueOf();
        const reservedTime = moment(reservation?.reservedStDtm, 'YYYYMMDDHHmm').valueOf();

        if (moment(currentDateTime).isAfter(reservedTime)) {
          if (revocable && revocable?.inCarCheck === IS_ACTIVE.YES) {
            helpofflinCancelReservationRef?.current?.show();
          } else {
            showMessage({
              message: '예약 및 취소 가능시간이 지났습니다.',
            });
            navigation.navigate(ROUTE_KEY.ContactUs);
          }
        } else {
          cancelPopupRef?.current?.show(
            '예약취소를 진행 하시겠습니까?',
            reservation?.id,
            reservation?.amt,
          );
        }
      } else {
        showMessage({
          message: '고객센터에 문의하세요.',
        });
        navigation.navigate(ROUTE_KEY.ContactUs);
      }
    }
  };

  const handleCancelOffline = () => {
    helpofflinCancelReservationRef?.current?.show();
  };

  const shouldHideComponents = ['대기신청', '자동결제', '자동신청'].some(keyword =>
    reservation?.TotalTicketType?.includes(keyword),
  );

  const shouldHideCancelButton =
    ['월주차', '월연장'].some(keyword => reservation?.TotalTicketType?.includes(keyword)) &&
    revocable?.inCarCheck === IS_ACTIVE.YES;

  const shouldHideInquiryButton = ['월주차', '월연장', '자동결제', '자동신청', '대기신청'].some(
    keyword => reservation?.TotalTicketType?.includes(keyword),
  );

  return (
    <FixedContainer>
      <CustomHeader text={strings.reservation_detail.title} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.wrapper}>
            {reservation?.TotalTicketType ? (
              <CustomText
                string={reservation?.TotalTicketType}
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.BODY}
                textStyle={{marginBottom: PADDING_HEIGHT / 2}}
              />
            ) : null}

            <RowItem
              title={
                productsList?.includes(reservation?.parkingLotId)
                  ? strings?.reservation_detail?.product_option
                  : strings.reservation_detail.date_of_use
              }
              value={getDateOfUse()}
            />

            {/* 입차예정시간 */}
            <RowItem
              title={'입차예정시간'}
              value={moment(reservation?.reservedStDtm, 'YYYYMMDDHHmm').format('HH시mm분')}
            />

            <RowItem
              isShowButton
              valueTextColor={colors.pink}
              title={strings.reservation_detail.amount_of_payment}
              value={`${getNumberWithCommas(Number(reservation?.amt))}${
                strings?.general_text?.won
              }`}
              onPress={() =>
                navigation.navigate(ROUTE_KEY.ParkingPaymentReceipt, {
                  tid: reservation?.tid,
                })
              }
              buttonStyle={{marginLeft: widthScale(10)}}
            />

            <RowItem
              title={strings.reservation_detail.reservation_for_use}
              value={`${getNumberWithCommas(Number(reservation?.usePoint))}${
                strings?.general_text?.won
              }`}
            />

            <RowItem
              title={strings.reservation_detail.charge_for_use}
              value={`${getNumberWithCommas(Number(reservation?.usePointSklent))}${
                strings?.general_text?.won
              }`}
            />

            <RowItem
              title={strings.reservation_detail.coupon_to_use}
              value={`${getNumberWithCommas(Number(reservation?.useCoupon))}${
                strings?.general_text?.won
              }`}
            />
          </View>

          <HStack style={styles.policy}>
            <Image source={ICONS.warning} style={styles.warningIcon} />

            <View style={{marginLeft: widthScale(10), flex: 1}}>
              <CustomText
                string={strings.reservation_detail.policy}
                family={FONT_FAMILY.SEMI_BOLD}
              />

              <CustomText
                string={'[일반주차권 구매시]'}
                family={FONT_FAMILY.SEMI_BOLD}
                textStyle={{marginTop: heightScale(10)}}
              />

              <CustomText
                string={strings.reservation_detail.back_all_money}
                family={FONT_FAMILY.SEMI_BOLD}
                textStyle={{marginTop: heightScale(2)}}
              />

              <CustomText
                string={strings.reservation_detail.can_not_back_money}
                family={FONT_FAMILY.SEMI_BOLD}
              />

              <CustomText
                string={'[월주차권 구매시]'}
                family={FONT_FAMILY.SEMI_BOLD}
                textStyle={{marginTop: heightScale(15)}}
              />

              <CustomText
                string={strings.reservation_detail.back_half_of_money3}
                family={FONT_FAMILY.SEMI_BOLD}
                textStyle={{marginTop: heightScale(2)}}
              />

              <CustomText
                string={strings.reservation_detail.back_half_of_money}
                family={FONT_FAMILY.SEMI_BOLD}
                textStyle={{marginTop: heightScale(2)}}
              />

              <CustomText
                string={strings.reservation_detail.back_half_of_money2}
                family={FONT_FAMILY.SEMI_BOLD}
              />

              <TouchableOpacity onPress={() => navigation.navigate(ROUTE_KEY.FAQ)}>
                <CustomText
                  color={colors.blue}
                  family={FONT_FAMILY.SEMI_BOLD}
                  string={'   자세한 이용규정 보러가기 (공통)'}
                />
              </TouchableOpacity>

              <CustomText
                string={strings.reservation_detail.note_first}
                textStyle={{marginTop: heightScale(16)}}
                size={FONT.CAPTION}
                family={FONT_FAMILY.SEMI_BOLD}
              />

              <CustomText
                string={strings.reservation_detail.note_second}
                size={FONT.CAPTION}
                family={FONT_FAMILY.SEMI_BOLD}
              />
            </View>
          </HStack>

          <View style={[styles.wrapper, {marginTop: PADDING, marginBottom: PADDING_HEIGHT}]}>
            <CustomText
              string={strings.reservation_detail.info_user}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.BODY}
              textStyle={{marginBottom: PADDING_HEIGHT / 2}}
            />

            <RowItem
              title={strings.reservation_detail.car_number}
              value={reservation?.agCarNumber || ''}
            />
            {/*<RowItem
              title={strings.reservation_detail.vehicle_type}
              value={userInfo?.carModel || ''}
            />*/}
            <RowItem
              title={strings.reservation_detail.vehicle_type}
              value={reservation?.weather || ''}
            />
            {/*<RowItem
              title={strings.reservation_detail.vehicle_color}
              value={userInfo?.carColor || ''}
            />*/}
            <RowItem title={strings.reservation_detail.contact} value={userInfo?.pnum || ''} />
            {/*<RowItem title={strings.reservation_detail.email} value={userInfo?.email || ''} />*/}
          </View>
        </View>
      </ScrollView>

      {moment().isAfter(moment(reservation?.reservedStDtm, 'YYYYMMDDHHmm'))
        ? !shouldHideCancelButton &&
          !shouldHideComponents && (
            <PaddingHorizontalWrapper
              containerStyles={{marginTop: heightScale(20), marginBottom: 10}}
              forDriveMe>
              <CustomButton
                text="현장결제 취소요청"
                buttonHeight={58}
                onPress={handleCancelOffline}
              />
            </PaddingHorizontalWrapper>
          )
        : !shouldHideCancelButton &&
          !shouldHideComponents && (
            <PaddingHorizontalWrapper
              containerStyles={{marginTop: heightScale(10), marginBottom: 10}}
              forDriveMe>
              <CustomButton
                text={
                  reservation?.TotalTicketType?.includes('자동신청') ||
                  reservation?.TotalTicketType?.includes('자동결제') ||
                  reservation?.requirements === '자동' ||
                  (revocable && revocable?.inCarCheck === IS_ACTIVE.YES)
                    ? '현장결제 취소요청'
                    : '예약취소'
                }
                buttonHeight={58}
                onPress={
                  reservation?.TotalTicketType?.includes('자동신청') ||
                  reservation?.TotalTicketType?.includes('자동결제') ||
                  reservation?.requirements === '자동' ||
                  (revocable && revocable?.inCarCheck === IS_ACTIVE.YES)
                    ? handleCancelOffline
                    : handleCancel
                }
              />
            </PaddingHorizontalWrapper>
          )}

      {/*{(reservation?.TotalTicketType?.includes('월주차') || reservation?.TotalTicketType?.includes('월연장')) &&
        !reservation?.TotalTicketType?.includes('자동결제') &&
        !reservation?.TotalTicketType?.includes('자동신청') &&
        !reservation?.TotalTicketType?.includes('대기신청') && (
          <TouchableOpacity onPress={() => autoPayComfirmRef.current?.show(reservation.id, reservation.amt)} style={styles.buttonAutoPayWrapper}>
            <Image
              source={ICONS.autopay_reg_btn} // 이미지 소스를 여기에 넣으세요
              style={{ width: 335, height: 58 ,marginBottom: heightScale1(10) }} // 원하는 스타일로 변경하세요
            />
          </TouchableOpacity>
      )}*/}

      {(reservation?.TotalTicketType?.includes('월주차') ||
        reservation?.TotalTicketType?.includes('월연장')) &&
        !reservation?.TotalTicketType?.includes('자동결제') &&
        !reservation?.TotalTicketType?.includes('자동신청') &&
        !reservation?.TotalTicketType?.includes('대기신청') && (
          <PaddingHorizontalWrapper forDriveMe>
            <CustomButton
              text="자동결제 신청하기"
              type="TERTIARY"
              outLine
              buttonStyle={[
                styles.buttonStyle,
                {
                  marginTop:
                    revocable?.inCarCheck === IS_ACTIVE.YES ? heightScale(10) : heightScale(0),
                  marginBottom: heightScale1(20),
                },
              ]}
              onPress={() => autoPayComfirmRef.current?.show(reservation.id, reservation.amt)}
            />
          </PaddingHorizontalWrapper>
        )}

      {!shouldHideInquiryButton && (
        <PaddingHorizontalWrapper forDriveMe>
          <CustomButton
            text="문의하기"
            type="TERTIARY"
            outLine
            buttonStyle={[
              styles.buttonStyle,
              {
                marginBottom: heightScale1(20),
              },
            ]}
            onPress={() => navigation.navigate(ROUTE_KEY.ContactUs)}
          />
        </PaddingHorizontalWrapper>
      )}

      {/* Cancel recheck popup */}
      <CancelPaymentRecheckPopup ref={cancelPopupRef} onSuccess={() => navigation.goBack()} />

      {/* AutoPay confirmation popup */}
      <AutoPayPopup ref={autoPayComfirmRef} onSuccess={() => navigation.goBack()} />

      {/* Modal for offline cancelation */}
      <ModalOfflineCancelPopup ref={helpofflinCancelReservationRef} />
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: PADDING / 2,
    paddingVertical: PADDING_HEIGHT,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    // overflow: 'hidden',
    borderRadius: widthScale(10),
  },
  content: {
    paddingHorizontal: PADDING / 2,
    marginTop: PADDING_HEIGHT,
  },
  rowContainer: {
    justifyContent: 'space-between',
    marginTop: PADDING_HEIGHT / 2,
    minHeight: heightScale(25),
  },
  radioBtn: {
    width: widthScale(24),
    height: heightScale(24),
  },
  warningIcon: {
    width: widthScale(20),
    height: heightScale(20),
  },
  policy: {
    marginTop: PADDING,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    backgroundColor: colors.black,
    width: 100,
    paddingVertical: heightScale(8),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonCancelWrapper: {
    backgroundColor: colors.black,
    height: heightScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAutoPayWrapper: {
    backgroundColor: colors.white,
    height: heightScale(90),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    minHeight: heightScale1(58),
  },
});

export default ReservationDetail;
