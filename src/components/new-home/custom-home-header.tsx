import {DrawerActions, useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  Text,
  Platform, // 🚩 [추가] Platform API를 import 합니다.
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ICONS} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING, PADDING1, WIDTH} from '~constants/constant';
import {FONT} from '~constants/enum';
import {strings} from '~constants/strings';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, scale, widthScale, widthScale1} from '~styles/scaling-utils';
import {isIphoneX} from 'react-native-iphone-x-helper';
import FilterItem from './filter-item';
import {Icons} from '~/assets/svgs';
import HotPlaceButton from '~components/commons/hot-place-button';

interface Props {
  onFilterPress: () => void;
  onSearch: (text: string) => void;
  onReservationSimplePress: () => void;
  onWeatherPress: () => void;
}

const CustomHomeHeader: React.FC<Props> = props => {
  const insets = useSafeAreaInsets();
  const {onFilterPress, onReservationSimplePress, onWeatherPress, onSearch} = props;
  const navigation: UseRootStackNavigation = useNavigation();

  const [textSearch, setTextSearch] = useState('');

  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const parkingFilter = useAppSelector(state => state?.parkingReducer?.parkingFilter);
  const refFilter = useRef<ScrollView>(null);

  useEffect(() => {
    refFilter.current?.scrollTo({x: 0, y: 0});
  }, [parkingFilter]);

  const handleReservationSimple = () => {
    if (!userToken?.id || !userToken?.password) {
      showMessage({
        message: strings?.general_text?.login_first,
      });
      navigation.navigate(ROUTE_KEY.Login);
      return;
    }
    onReservationSimplePress?.();
  };

  const screenWidth = Dimensions.get('window').width;
  const isIPad = screenWidth > 768;

  return (
    <View
      style={[
        styles.container,
        {
          top: isIphoneX() ? insets.top / 1.5 : insets.top + PADDING / 3,
        },
      ]}>
      <HStack style={styles.searchWrapper}>
        {/* 🚩 [수정] 검색창의 이중 View 구조를 하나로 합칩니다. */}
        <View style={styles.searchContainer}>
          <HStack>
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}>
              <Icon name="menu" color={colors.black} size={widthScale(25)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputWrapper} onPress={() => onSearch(textSearch)}>
              <Text
                style={{color: textSearch ? colors.black : colors.grayText, fontSize: scale(13)}}>
                {textSearch || '주차장명 또는 지역명을 입력해주세요!'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSearch(textSearch)}>
              <Icon name="magnify" color={colors.black} size={widthScale(25)} />
            </TouchableOpacity>
          </HStack>
        </View>

        <TouchableOpacity
          onPress={handleReservationSimple}
          style={isIPad ? styles.reservationSimpleWrapperIpad : styles.reservationSimpleWrapper}>
          <Image resizeMode="contain" style={styles.phoneIcon} source={ICONS.phone_check} />
          <CustomText
            size={FONT.CAPTION_3}
            string="간편예약"
            color={colors.white}
            textStyle={{marginTop: 3}}
          />
        </TouchableOpacity>
      </HStack>

      {/* 이하 코드는 동일합니다. */}
      <View style={{flexDirection: 'row'}}>
        <TouchableWithoutFeedback onPress={onFilterPress}>
          <HStack style={styles.filterWrapper}>
            <Image source={ICONS.filter} style={styles.filterIcon} />
            <CustomText string=" 필터" color={colors.red} />
          </HStack>
        </TouchableWithoutFeedback>
        <ScrollView
          contentContainerStyle={{marginLeft: PADDING / 3, paddingRight: PADDING / 1.3}}
          horizontal
          ref={refFilter}
          showsHorizontalScrollIndicator={false}>
          {parkingFilter &&
            parkingFilter?.map((item, index) => !!item && <FilterItem item={item} key={index} />)}
        </ScrollView>
      </View>
      <HStack style={styles.buttonWrapperStyle}>
        <HotPlaceButton
          text="주말 핫플레이스 주차장 한눈에"
          type="light-blue"
          icon={
            <Icons.ChevronRight
              stroke={colors.success}
              width={widthScale1(17)}
              height={widthScale1(17)}
            />
          }
          iconPosition="right"
          onPress={() => navigation.navigate(ROUTE_KEY.HotPlace)}
        />
      </HStack>
    </View>
  );
};

export default CustomHomeHeader;

const styles = StyleSheet.create({
  container: {
    paddingTop: PADDING / 2,
    position: 'absolute',
    zIndex: 999,
    left: 0,
    right: 0,
  },
  searchWrapper: {
    marginBottom: PADDING / 2,
    marginHorizontal: PADDING,
    marginTop: PADDING / 1.5,
  },
  // 🚩 [수정] searchShadowContainer와 searchContentContainer를 합친 새로운 스타일
  searchContainer: {
    flex: 1,
    marginRight: widthScale(10),
    backgroundColor: colors.white,
    borderRadius: widthScale(8),
    padding: PADDING / 2,
    justifyContent: 'center',
    height: heightScale(55),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: widthScale(5),
    justifyContent: 'center',
    height: '100%',
  },
  reservationSimpleWrapper: {
    backgroundColor: colors.red,
    borderRadius: widthScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    height: heightScale(55),
    width: heightScale(55),
  },
  reservationSimpleWrapperIpad: {
    backgroundColor: colors.red,
    borderRadius: widthScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    height: heightScale(80),
    width: heightScale(80),
  },
  phoneIcon: {
    width: widthScale(20),
    height: widthScale(20),
  },
  filterIcon: {
    width: widthScale(16),
    height: widthScale(16),
  },
  filterWrapper: {
    backgroundColor: colors.white,
    width: widthScale(90),
    minHeight: heightScale(35),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.red,
    marginLeft: PADDING,
  },
  buttonWrapperStyle: {
    marginLeft: PADDING1,
    marginRight: PADDING1,
    width: WIDTH - PADDING1 * 2,
    marginTop: 10,
  },
});
