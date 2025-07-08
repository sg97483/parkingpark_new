import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import {ScrollView, StyleSheet, Dimensions, Platform, View} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import ItemCondition from '~components/parking-filter-popup-new/item-condition';
import ItemTicket from '~components/parking-filter-popup-new/item-ticket';
import {IS_IOS, PADDING} from '~constants/constant';
import {FONT, FONT_FAMILY, PARKING_FILTER_TYPE} from '~constants/enum';
import {ParkingFilterProps} from '~constants/types';
import {cacheParkingFilter} from '~reducers/parkingReducer';
import {useAppDispatch, useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, heightScale1, widthScale, widthScale1} from '~styles/scaling-utils';
import CustomFilterCheckbox from '~components/custom-filter-checkbox';
import SwitchButtonBottomNew from '~components/switch-button-bottom-new';
import HStack from '~components/h-stack';
import CustomButton from '~components/commons/custom-button';

interface Props {}
export interface ParkingFilterRefs {
  show: () => void;
  hide: () => void;
}

// 현재 디바이스의 화면 크기 가져오기
const {width, height} = Dimensions.get('window');

// 아이패드인지 여부를 확인
const isiPad = Platform.OS === 'ios' && (width >= 768 || height >= 768);

// 아이패드일 경우 높이를 크게 조정
const switchButtonHeight = isiPad ? 80 : 80;

const MOCKING_DATA_TICKET: ParkingFilterProps[] = [
  {
    title: '평일 1일권',
    value: PARKING_FILTER_TYPE.WEEKDAY,
  },
  {
    title: '평일 시간권',
    value: PARKING_FILTER_TYPE.WEEKDAYTIME,
  },
  {
    title: '심야권',
    value: PARKING_FILTER_TYPE.NIGHT,
  },
  {
    title: '연박권',
    value: PARKING_FILTER_TYPE.CONNIGHT,
  },
  {
    title: '주말 1일권',
    value: PARKING_FILTER_TYPE.WEEKEND,
  },
  {
    title: '주말 시간권',
    value: PARKING_FILTER_TYPE.WEEKENDTIME,
  },
  {
    title: '저녁권',
    value: PARKING_FILTER_TYPE.DINNER,
  },
  {
    title: '월주차권',
    value: PARKING_FILTER_TYPE.MONTH,
  },
];

const MOCKING_DATA_CONDITION: ParkingFilterProps[] = [
  {
    title: '민영 주차장',
    value: PARKING_FILTER_TYPE.PRIVATE,
  },
  {
    title: '전기차 충전소',
    value: PARKING_FILTER_TYPE.ELEC,
  },
  {
    title: '그린카 쉐어링',
    value: PARKING_FILTER_TYPE.GREENCAR,
  },
  {
    title: '조건부 무료',
    value: PARKING_FILTER_TYPE.IFFREE,
  },
  {
    title: '공영 주차장',
    value: PARKING_FILTER_TYPE.PUBLIC,
  },
  {
    title: '파킹박 공유 주차',
    value: PARKING_FILTER_TYPE.SHARECAR,
  },
  {
    title: '카드사 제휴 무료',
    value: PARKING_FILTER_TYPE.CARD,
  },
  {
    title: '무료 주차장',
    value: PARKING_FILTER_TYPE.FREE,
  },
];

const ParkingFilterPopup = forwardRef((props: Props, ref) => {
  const dispatch = useAppDispatch();
  const parkingFilter = useAppSelector(state => state?.parkingReducer?.parkingFilter);
  const insets = useSafeAreaInsets();

  const isOpenAffiliated =
    parkingFilter &&
    parkingFilter?.find(
      item =>
        item === PARKING_FILTER_TYPE.WEEKDAY ||
        item === PARKING_FILTER_TYPE.WEEKEND ||
        item === PARKING_FILTER_TYPE.NIGHT ||
        item === PARKING_FILTER_TYPE.MONTH ||
        item === PARKING_FILTER_TYPE.WEEKDAYTIME ||
        item === PARKING_FILTER_TYPE.WEEKENDTIME ||
        item === PARKING_FILTER_TYPE.DINNER ||
        item === PARKING_FILTER_TYPE.CONNIGHT,
    );

  const isOpenGeneral =
    parkingFilter &&
    parkingFilter?.find(
      item =>
        item === PARKING_FILTER_TYPE.IFFREE ||
        item === PARKING_FILTER_TYPE.PUBLIC ||
        item === PARKING_FILTER_TYPE.PRIVATE ||
        item === PARKING_FILTER_TYPE.CARD ||
        item === PARKING_FILTER_TYPE.ELEC ||
        item === PARKING_FILTER_TYPE.GREENCAR ||
        item === PARKING_FILTER_TYPE.SHARECAR ||
        item === PARKING_FILTER_TYPE.FREE,
    );

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedCondition, setSelectedCondition] = useState<PARKING_FILTER_TYPE[]>(
    parkingFilter ? parkingFilter : [],
  );
  const [isCheckAffiliated, setIsCheckAffiliated] = useState<boolean>(
    isOpenAffiliated ? true : false,
  );
  const [isCheckGeneral, setIsCheckGeneral] = useState<boolean>(isOpenGeneral ? true : false);
  const [isPartnerOnly, setIsPartnerOnly] = useState<boolean>(false);

  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [],
  );

  useEffect(() => {
    setIsPartnerOnly(selectedCondition.includes(PARKING_FILTER_TYPE.ALLOWBOOKINGPARTNER));
  }, [selectedCondition]);

  const checkAffiliatedSelected = useCallback((conditions: any[]) => {
    return conditions.some(
      (item: PARKING_FILTER_TYPE) =>
        item === PARKING_FILTER_TYPE.WEEKDAY ||
        item === PARKING_FILTER_TYPE.WEEKEND ||
        item === PARKING_FILTER_TYPE.NIGHT ||
        item === PARKING_FILTER_TYPE.MONTH ||
        item === PARKING_FILTER_TYPE.WEEKDAYTIME ||
        item === PARKING_FILTER_TYPE.WEEKENDTIME ||
        item === PARKING_FILTER_TYPE.DINNER ||
        item === PARKING_FILTER_TYPE.CONNIGHT,
    );
  }, []);

  const onTicketPress = (item: PARKING_FILTER_TYPE) => {
    let updatedSelectedCondition;
    if (!selectedCondition?.includes(item)) {
      updatedSelectedCondition = [...selectedCondition, item];
    } else {
      updatedSelectedCondition = [...selectedCondition].filter(it => it !== item);
    }
    setSelectedCondition(updatedSelectedCondition);
    setIsCheckAffiliated(checkAffiliatedSelected(updatedSelectedCondition));
  };

  const onConditionPress = (item: PARKING_FILTER_TYPE) => {
    let updatedSelectedCondition;
    if (!selectedCondition?.includes(item)) {
      updatedSelectedCondition = [...selectedCondition, item];
    } else {
      updatedSelectedCondition = [...selectedCondition].filter(it => it !== item);
    }
    setSelectedCondition(updatedSelectedCondition);

    const isAnyConditionSelected = updatedSelectedCondition.length > 0;
    setIsCheckGeneral(isAnyConditionSelected);
  };

  const handleResetFilter = () => {
    setSelectedCondition([]);
    setIsCheckAffiliated(false);
    setIsCheckGeneral(false);
    setIsPartnerOnly(false);
  };

  const handleSubmitFilter = () => {
    if (selectedCondition?.length === 0) {
      dispatch(cacheParkingFilter([]));
    } else {
      let tempt = [...selectedCondition];
      if (!isCheckAffiliated) {
        tempt = tempt
          .filter(item => item !== PARKING_FILTER_TYPE.WEEKDAY)
          .filter(item => item !== PARKING_FILTER_TYPE.WEEKEND)
          .filter(item => item !== PARKING_FILTER_TYPE.NIGHT)
          .filter(item => item !== PARKING_FILTER_TYPE.MONTH)
          .filter(item => item !== PARKING_FILTER_TYPE.WEEKDAYTIME)
          .filter(item => item !== PARKING_FILTER_TYPE.WEEKENDTIME)
          .filter(item => item !== PARKING_FILTER_TYPE.DINNER)
          .filter(item => item !== PARKING_FILTER_TYPE.CONNIGHT);
      }
      if (!isCheckGeneral) {
        tempt = tempt
          .filter(item => item !== PARKING_FILTER_TYPE.IFFREE)
          .filter(item => item !== PARKING_FILTER_TYPE.PUBLIC)
          .filter(item => item !== PARKING_FILTER_TYPE.PRIVATE)
          .filter(item => item !== PARKING_FILTER_TYPE.CARD)
          .filter(item => item !== PARKING_FILTER_TYPE.ELEC)
          .filter(item => item !== PARKING_FILTER_TYPE.GREENCAR)
          .filter(item => item !== PARKING_FILTER_TYPE.SHARECAR)
          .filter(item => item !== PARKING_FILTER_TYPE.FREE);
      }
      dispatch(cacheParkingFilter(tempt || []));
    }
    hide();
  };

  const handleSearchAllFilter = () => {
    handleResetFilter();
    dispatch(cacheParkingFilter([]));
    hide();
  };

  const handleViewOnlyCurrentlyAvailableParkingLots = () => {
    let updatedSelectedCondition;
    if (selectedCondition.includes(PARKING_FILTER_TYPE.ALLOWBOOKING)) {
      updatedSelectedCondition = selectedCondition.filter(
        it => it !== PARKING_FILTER_TYPE.ALLOWBOOKING,
      );
    } else {
      updatedSelectedCondition = [
        ...selectedCondition.filter(it => !MOCKING_DATA_CONDITION.some(cond => cond.value === it)),
        PARKING_FILTER_TYPE.ALLOWBOOKING,
      ];

      // CustomFilterCheckbox가 체크될 때 SwitchButtonBottomNew를 무조건 실행
      if (!selectedCondition.includes(PARKING_FILTER_TYPE.ALLOWBOOKINGPARTNER)) {
        updatedSelectedCondition.push(PARKING_FILTER_TYPE.ALLOWBOOKINGPARTNER);
        setIsPartnerOnly(true);
      }
    }
    setSelectedCondition(updatedSelectedCondition);
  };

  const handleViewOnlyCurrentlyAvailableParkingLotsPartner = (
    updatedSelectedCondition?: PARKING_FILTER_TYPE[],
  ) => {
    let conditionToUpdate = updatedSelectedCondition || selectedCondition;
    let newIsPartnerOnly = false;
    if (conditionToUpdate.includes(PARKING_FILTER_TYPE.ALLOWBOOKINGPARTNER)) {
      conditionToUpdate = conditionToUpdate.filter(
        it => it !== PARKING_FILTER_TYPE.ALLOWBOOKINGPARTNER,
      );
      conditionToUpdate = conditionToUpdate.filter(it => it !== PARKING_FILTER_TYPE.ALLOWBOOKING); // ALLOWBOOKING도 제거
    } else {
      conditionToUpdate = [
        ...conditionToUpdate.filter(it => !MOCKING_DATA_CONDITION.some(cond => cond.value === it)),
        PARKING_FILTER_TYPE.ALLOWBOOKINGPARTNER,
      ];
      newIsPartnerOnly = true;
    }
    setSelectedCondition(conditionToUpdate);
    setIsPartnerOnly(newIsPartnerOnly);
  };

  const handleViewOnlyGeneralParkingLotParkingTikets = () => {
    setIsCheckGeneral(!isCheckGeneral);
  };

  return (
    <Modal
      isVisible={isVisible}
      useNativeDriver
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      onBackButtonPress={hide}
      style={{
        margin: 0,
      }}>
      <FixedContainer
        style={[
          styles.container,
          {
            paddingTop: IS_IOS ? insets.top / 1.5 : 0,
          },
        ]}>
        <View style={styles.viewHeader}>
          <CustomHeader
            onPressIconBackX={hide}
            hideBack
            isIconBackX={true}
            text="검색필터"
            rightContent={null}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <SwitchButtonBottomNew
            style={styles.marginView}
            onPressSwitch={() => handleViewOnlyCurrentlyAvailableParkingLotsPartner()}
            isOn={selectedCondition.includes(PARKING_FILTER_TYPE.ALLOWBOOKINGPARTNER)}
            title="제휴 주차장만 보기"
          />

          <CustomFilterCheckbox
            style={styles.marginView}
            isChecked={selectedCondition.includes(PARKING_FILTER_TYPE.ALLOWBOOKING)}
            text="현재 구매 불가 제외"
            onPress={handleViewOnlyCurrentlyAvailableParkingLots}
          />

          <View style={styles.divider1} />

          <View style={[styles.childrenAffiliated]}>
            <View style={styles.viewBottomTitle}>
              <CustomText
                string="제휴주차장 주차권 선택 "
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION_7}
                color={colors.menuTextColor}
                forDriveMe
              />
              <CustomText
                string="   중복선택 가능"
                family={FONT_FAMILY.REGULAR}
                size={FONT.CAPTION}
                color={colors.grayText}
                forDriveMe
              />
            </View>
            <View style={styles.viewTicket}>
              <View style={styles.viewFlex}>
                {MOCKING_DATA_TICKET.slice(0, MOCKING_DATA_TICKET.length / 2).map(item => (
                  <ItemTicket
                    key={JSON.stringify(item)}
                    item={item}
                    onPress={() => onTicketPress(item?.value)}
                    isSelected={selectedCondition?.includes(item?.value)}
                  />
                ))}
              </View>
              <View style={styles.viewFlex}>
                {MOCKING_DATA_TICKET.slice(
                  MOCKING_DATA_TICKET.length / 2,
                  MOCKING_DATA_TICKET.length,
                ).map(item => (
                  <ItemTicket
                    key={JSON.stringify(item)}
                    item={item}
                    onPress={() => onTicketPress(item?.value)}
                    isSelected={selectedCondition?.includes(item?.value)}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.divider2} />

          <View style={styles.viewBottomCondition}>
            <View style={styles.viewBottomTitle}>
              <CustomText
                string="일반주차장 필터 선택"
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION_7}
                color={colors.menuTextColor}
                forDriveMe
              />
              <CustomText
                string="   중복선택 가능"
                family={FONT_FAMILY.REGULAR}
                size={FONT.CAPTION}
                color={colors.grayText}
                forDriveMe
              />
            </View>
            <View style={styles.viewTicket}>
              <View style={styles.viewFlex}>
                {MOCKING_DATA_CONDITION.slice(0, MOCKING_DATA_CONDITION.length / 2).map(item => (
                  <ItemCondition
                    key={JSON.stringify(item)}
                    item={item}
                    onPress={() => onConditionPress(item?.value)}
                    isSelected={selectedCondition?.includes(item?.value)}
                    disabled={isPartnerOnly} // 비활성화 조건 추가
                  />
                ))}
              </View>
              <View style={styles.viewFlex}>
                {MOCKING_DATA_CONDITION.slice(
                  MOCKING_DATA_CONDITION.length / 2,
                  MOCKING_DATA_CONDITION.length,
                ).map(item => (
                  <ItemCondition
                    key={JSON.stringify(item)}
                    item={item}
                    onPress={() => onConditionPress(item?.value)}
                    isSelected={selectedCondition?.includes(item?.value)}
                    disabled={isPartnerOnly} // 비활성화 조건 추가
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <HStack style={styles.footerStyle}>
          <CustomButton
            buttonStyle={{
              minWidth: widthScale1(100),
            }}
            type="TERTIARY"
            text="초기화"
            leftIconReload
            buttonHeight={58}
            onPress={handleResetFilter}
            outLine
          />

          <CustomButton
            buttonStyle={{
              flex: 1,
            }}
            text="적용하기"
            buttonHeight={58}
            onPress={handleSubmitFilter}
          />
        </HStack>
      </FixedContainer>
    </Modal>
  );
});

export default memo(ParkingFilterPopup);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textTitle: {
    marginHorizontal: PADDING,
    marginVertical: heightScale(10),
  },
  childrenAffiliated: {
    borderRadius: widthScale(8),
    marginBottom: 10,
    marginVertical: heightScale(10),
    padding: PADDING,
    backgroundColor: colors.white,
    marginHorizontal: PADDING / 2,
    height: heightScale(260),
  },
  itemTicket: {
    height: heightScale(30),
    width: '50%',
    marginVertical: heightScale(5),
    backgroundColor: colors.white, // 👈 배경색 추가 시도
  },
  viewBottomTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightScale(0),
    height: heightScale(30),
  },
  viewFlatList: {
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  viewHeader: {
    padding: PADDING / 4,
  },
  marginView: {
    marginHorizontal: 26, // 좌우 여백 제거
  },
  viewTicket: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  viewFlex: {
    flex: 1,
    fontFamily: FONT_FAMILY.REGULAR,
    paddingRight: 10,
  },
  viewFlex2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  viewFlex3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  viewBottomCondition: {
    borderRadius: widthScale(8),
    marginBottom: 10,
    marginVertical: heightScale(10),
    padding: PADDING,
    backgroundColor: colors.white,
    marginHorizontal: PADDING / 2,
    height: heightScale(280),
  },
  divider1: {
    marginTop: 24,
    backgroundColor: colors.gray9,
    height: heightScale(1),
  },
  divider2: {
    marginTop: 8,
    backgroundColor: colors.gray9,
    height: heightScale(1),
  },
  viewBottomNew: {
    borderRadius: widthScale(8),
    marginBottom: 10,
    marginVertical: heightScale(10),
    padding: PADDING,
    backgroundColor: colors.white,
    marginHorizontal: PADDING / 2,
    height: heightScale(160),
  },
  viewBottom: {
    flexDirection: 'row',
    marginHorizontal: PADDING,
    justifyContent: 'space-between',
    marginTop: PADDING,
  },

  icon: {
    width: widthScale(18),
    height: widthScale(18),
    tintColor: colors.grayText,
  },

  footerStyle: {
    marginTop: heightScale1(10),
    gap: widthScale1(10),
    marginHorizontal: 20, // 좌우 여백 제거
    marginBottom: heightScale1(30),
  },
});
