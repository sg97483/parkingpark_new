import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import ModalCreateReview, {ModalCreateReviewRef} from '~components/eval-list/modal-create-review';
import FixedContainer from '~components/fixed-container';
import ParkingEvalItem from '~components/parking-details/parking-eval-item';
import Spinner from '~components/spinner';
import {PADDING} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {RootStackScreenProps} from '~navigators/stack';
import {
  useCreateTextReviewMutation,
  useParkingEvalListQuery,
  useParkingReviewListQuery,
} from '~services/parkingServices';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const EvalList = (props: RootStackScreenProps<'EvalList'>) => {
  const {navigation, route} = props;
  const parkingData = route.params?.parkingData;
  const createReviewRef = useRef<ModalCreateReviewRef>(null);
  const userToken = useAppSelector(state => state?.userReducer?.userToken);
  const codeRegion = useAppSelector(state => state?.weatherReducer?.codeRegion);
  const [createTextReview] = useCreateTextReviewMutation();

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

  // Add new review listeners
  useEffect(() => {
    const addNewReviewListeners = DeviceEventEmitter.addListener(EMIT_EVENT.ADD_REVIEW, () =>
      refetchReview(),
    );
    return () => addNewReviewListeners.remove();
  }, []);

  const onPressReview = (numberStar: number, textReview: string) => {
    if (!textReview) {
      return;
    }
    Spinner.show();
    createTextReview({
      memberId: userToken?.id,
      memberPwd: userToken?.password,
      parkingLotId: parkingData?.id,
      city: codeRegion?.city || '',
      state: codeRegion?.state || '',
      text: textReview,
      _eval: `${numberStar}.0`,
    })
      .unwrap()
      .then(res => {
        if (res == '200') {
          DeviceEventEmitter.emit(EMIT_EVENT.ADD_REVIEW);
          createReviewRef.current?.hide();
        } else {
          showMessage({
            message: strings?.general_text?.please_try_again,
          });
        }
      })
      .finally(() => Spinner.hide());
  };

  return (
    <FixedContainer>
      <CustomHeader
        text="이용 평점"
        rightContent={
          <TouchableOpacity onPress={() => createReviewRef.current?.show()}>
            <CustomText string="글쓰기" />
          </TouchableOpacity>
        }
      />
      <View>
        {isFetching ? (
          <View style={styles.placeholderWrapper}>
            <ActivityIndicator color={colors.red} />
          </View>
        ) : listData?.length ? (
          <ScrollView>
            {listData?.map((item, index) => (
              <View key={index}>
                <ParkingEvalItem item={item} index={index} />
                {index !== listData?.length - 1 ? <Divider /> : null}
              </View>
            ))}
          </ScrollView>
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
      </View>
      <ModalCreateReview ref={createReviewRef} onPressReview={onPressReview} />
    </FixedContainer>
  );
};

export default EvalList;

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
