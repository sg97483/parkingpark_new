import {useNavigation} from '@react-navigation/native';
import React, {memo, useEffect} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {ParkingProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {useParkingEvalListQuery, useParkingReviewListQuery} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import ParkingEvalItem from './parking-eval-item';

interface Props {
  parkingData: ParkingProps;
}

const ParkingEval: React.FC<Props> = memo(props => {
  const {parkingData} = props;
  const navigation: UseRootStackNavigation = useNavigation();
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const {
    data: LIST_PARKING_EVAL,
    isFetching,
    refetch: refetchEval,
  } = useParkingEvalListQuery({id: parkingData?.id}, {skip: !parkingData});

  const {data: REVIEW_PARKING, refetch: refetchReview} = useParkingReviewListQuery(
    {
      id: parkingData?.id,
    },
    {skip: !parkingData},
  );

  const listData =
    LIST_PARKING_EVAL && REVIEW_PARKING ? [...REVIEW_PARKING, ...LIST_PARKING_EVAL] : [];

  useEffect(() => {
    DeviceEventEmitter.emit(EMIT_EVENT.DATA_EVAL, listData);
  }, [listData]);

  // Add new review listeners
  useEffect(() => {
    const addNewReviewListeners = DeviceEventEmitter.addListener(EMIT_EVENT.ADD_REVIEW, () => {
      refetchReview();
    });

    return () => {
      addNewReviewListeners.remove();
    };
  }, []);

  return (
    <View style={{paddingHorizontal: PADDING / 2}}>
      <CustomText
        string="이용 후기"
        family={FONT_FAMILY.BOLD}
        size={FONT.SUB_HEAD}
        color={colors.heavyGray}
      />

      {isFetching ? (
        <View style={styles.placeholderWrapper}>
          <ActivityIndicator color={colors.red} />
        </View>
      ) : listData && listData?.length > 0 ? (
        <View style={{marginTop: PADDING / 2}}>
          {listData?.map((item, index) => {
            return (
              <View key={item.id}>
                <ParkingEvalItem item={item} index={index} />
                {index !== listData?.length - 1 ? <Divider /> : null}
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyWrapper}>
          <CustomText
            string="이용후기"
            family={FONT_FAMILY.BOLD}
            size={FONT.SUB_HEAD}
            textStyle={{
              marginBottom: heightScale(10),
            }}
          />
          <CustomText
            string="'파킹박'은 이용자분들의 참여로 더욱 유용한 앱으로 만들어집니다."
            size={FONT.CAPTION}
            family={FONT_FAMILY.SEMI_BOLD}
          />
          <CustomText
            string="이용후기나 노하우를 살며시 남겨주세요. 행운이 함께 합니다."
            size={FONT.CAPTION}
            family={FONT_FAMILY.SEMI_BOLD}
          />
        </View>
      )}

      <TouchableOpacity
        onPress={() => {
          if (!userToken?.id || !userToken?.password) {
            navigation.navigate(ROUTE_KEY.Login);
            return;
          }
          navigation.navigate(ROUTE_KEY.CreateReview, {parkingData});
        }}
        style={styles.createButtonWrapper}>
        <HStack>
          <Icon name="lead-pencil" size={widthScale(17)} color={colors.white} style={styles.icon} />
          <CustomText string="후기쓰기" color={colors.white} size={FONT.CAPTION} />
        </HStack>
      </TouchableOpacity>
    </View>
  );
});
export default ParkingEval;

const styles = StyleSheet.create({
  createButtonWrapper: {
    width: widthScale(100),
    borderRadius: 5,
    paddingVertical: widthScale(10),
    marginBottom: PADDING / 2,
    backgroundColor: colors.blackGray,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightScale(16),
  },
  icon: {
    marginBottom: 2,
    marginRight: widthScale(3),
  },
  placeholderWrapper: {
    height: heightScale(150),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrapper: {
    backgroundColor: `${colors.gray}90`,
    padding: PADDING,
    marginTop: PADDING / 2,
    borderRadius: 10,
  },
});
