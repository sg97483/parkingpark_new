import {
  Alert,
  DeviceEventEmitter,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useRef, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {IS_IOS, PADDING, width} from '~constants/constant';
import {EMIT_EVENT, FONT, FONT_FAMILY, IS_ACTIVE} from '~constants/enum';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import HStack from '~components/h-stack';
import moment from 'moment';
import {getTimeAgo} from '~utils/hourUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MonthlyParkingDirectMenuItem from '~components/monthly-parking-direct/monthly-parking-direct-menu-item';
import {getNumberWithCommas} from '~utils/numberUtils';
import {getImageURL} from '~utils/getImageURL';
import Divider from '~components/divider';
import {useAppSelector} from '~store/storeHooks';
import {ROUTE_KEY} from '~navigators/router';
import {showMessage} from 'react-native-flash-message';
import {
  useCompleteMonthlyParkingDirectMutation,
  useCreateMonthlyParkingDirectCommentMutation,
  useDeleteMonthlyParkingDirectPostMutation,
} from '~services/monthlyParkingDirectServices';
import ImageViewer, {ImageViewRefs} from '~components/image-viewer';
import {strings} from '~constants/strings';
import ViewParkingLocationModal, {
  ViewParkingLocationModalRefs,
} from '~components/monthly-parking-direct/view-parking-location-modal';
import MonthlyParkingDirectComment from '~components/monthly-parking-direct/monthly-parking-direct-comment';

const MonthlyParkingDirectDetails = memo(
  (props: RootStackScreenProps<'MonthlyParkingDirectDetails'>) => {
    const {navigation, route} = props;
    const imageViewerRef = useRef<ImageViewRefs>(null);
    const viewParkingLocationRef = useRef<ViewParkingLocationModalRefs>(null);

    const [createMonthlyParkingDirectComment, {isLoading}] =
      useCreateMonthlyParkingDirectCommentMutation();
    const [deleteMonthlyParkingDirectPost] = useDeleteMonthlyParkingDirectPostMutation();
    const [completeMonthlyParkingDirect] = useCompleteMonthlyParkingDirectMutation();

    const data = route?.params?.data;
    const images = route?.params?.images;

    const userToken = useAppSelector(state => state?.userReducer?.userToken);

    const [commentText, setCommentText] = useState<string>('');

    const handleSunmitComment = () => {
      if (!userToken?.id || !userToken?.password) {
        navigation.navigate(ROUTE_KEY.Login);
        return;
      }

      if (!commentText) {
        showMessage({
          message: strings?.monthly_parking_direct_details?.please_input_your_comment,
        });
        return;
      }
      setCommentText('');
      createMonthlyParkingDirectComment({
        bbsId: data?.s_no,
        deviceToken: '',
        memberId: userToken?.id,
        memberPwd: userToken?.password,
        text: commentText,
      })
        .unwrap()
        .then(res => {
          if (res === '200') {
            DeviceEventEmitter.emit(EMIT_EVENT.MONTHLY_PARKING_DIRECT);
          } else {
            showMessage({
              message: strings?.general_text?.please_try_again,
            });
          }
        });
    };

    const handleDeleteBBS = () => {
      Alert.alert('', strings?.general_text?.are_you_sure_to_delete, [
        {
          text: strings?.general_text?.agree,
          onPress: () => {
            deleteMonthlyParkingDirectPost({
              id: data?.s_no,
              userID: userToken?.id,
            })
              .unwrap()
              .then(res => {
                if (res === '200') {
                  navigation.goBack();
                  DeviceEventEmitter.emit(EMIT_EVENT.MONTHLY_PARKING_DIRECT);
                }
              });
          },
        },
        {
          text: strings?.general_text?.cancel,
          style: 'cancel',
        },
      ]);
    };

    const handleCompleteMonthlyParkingDirect = () => {
      Alert.alert(
        '',
        strings?.monthly_parking_direct_details?.would_you_like_to_complete_transaction,
        [
          {
            text: strings?.general_text?.agree,
            onPress: () => {
              completeMonthlyParkingDirect({
                c_appYN: data?.c_appYN,
                id: data?.s_no,
                memberId: Number(data?.s_memberId),
              })
                .unwrap()
                .then(res => {
                  if (res === '200') {
                    navigation.goBack();
                    DeviceEventEmitter.emit(EMIT_EVENT.MONTHLY_PARKING_DIRECT);
                  } else {
                    showMessage({
                      message: strings?.general_text?.please_try_again,
                    });
                  }
                });
            },
          },
          {
            text: strings?.general_text?.cancel,
            style: 'cancel',
          },
        ],
      );
    };

    return (
      <FixedContainer>
        <CustomHeader
          text={strings?.monthly_parking_direct_details?.monthly_parking_direct_transaction}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView behavior={IS_IOS ? 'position' : undefined} style={styles.container}>
            {/* Status
              - transaction completed
              - trading
            */}
            {data?.c_appYN === IS_ACTIVE.YES ? (
              <View
                style={[
                  styles.statusWrapper,
                  {
                    backgroundColor: colors.darkGray,
                  },
                ]}>
                <CustomText
                  string={strings?.monthly_parking_direct_details?.transaction_completed}
                  color={colors.white}
                  family={FONT_FAMILY.SEMI_BOLD}
                />
              </View>
            ) : (
              <View style={styles.statusWrapper}>
                <CustomText
                  string={strings?.monthly_parking_direct_details?.transaction_trading}
                  color={colors.white}
                  family={FONT_FAMILY.SEMI_BOLD}
                />
              </View>
            )}

            {/* Subject */}
            <CustomText string={data?.s_subject} family={FONT_FAMILY.SEMI_BOLD} size={FONT.BODY} />
            {/* User info */}
            <HStack style={styles.userInfoWrapper}>
              <CustomText
                string={data?.memberNic}
                family={FONT_FAMILY.SEMI_BOLD}
                color={colors.darkBlue}
                size={FONT.CAPTION_2}
              />
              <CustomText
                string={` | ${moment(data?.regdate * 1000).format('MM.DD HH:mm')}  `}
                color={colors.darkGray}
                size={FONT.CAPTION_2}
              />
              {getTimeAgo(data?.regdate * 1000) ? (
                <HStack>
                  <Icon name="clock-outline" color={colors.darkGray} size={widthScale(15)} />
                  <CustomText
                    string={` ${getTimeAgo(data?.regdate * 1000)}`}
                    color={colors.darkGray}
                    size={FONT.CAPTION_2}
                  />
                </HStack>
              ) : null}
            </HStack>

            {/* Parking lot name */}
            <MonthlyParkingDirectMenuItem
              title={strings?.monthly_parking_direct_details?.parking_lot_name}
              value={data?.s_garageName}
            />

            {/* Amount */}
            <MonthlyParkingDirectMenuItem
              title={strings?.monthly_parking_direct_details?.amount}
              value={
                Number(data?.s_garagePay.replace(/,/g, ''))
                  ? `${getNumberWithCommas(Number(data?.s_garagePay?.replace(/,/g, '')))}${
                      strings?.general_text?.won
                    }`
                  : data?.s_garagePay
              }
            />

            {/* Number of parking spaces */}
            <MonthlyParkingDirectMenuItem
              title={strings?.monthly_parking_direct_details?.number_of_parking_spaces}
              value={data?.s_rSpace}
            />

            {/* Address */}
            <MonthlyParkingDirectMenuItem
              title={strings?.general_text?.address}
              value={data?.s_garageAddress}
              rightContent={
                <TouchableOpacity
                  onPress={() => viewParkingLocationRef?.current?.show(data?.s_garageAddress)}
                  style={styles.viewInMapWrapper}>
                  <CustomText
                    string={strings?.monthly_parking_direct_details?.view_location}
                    size={FONT.CAPTION_2}
                    color={colors.white}
                  />
                </TouchableOpacity>
              }
            />

            {/* Operating time */}
            <MonthlyParkingDirectMenuItem
              title={strings?.monthly_parking_direct_details?.operating_time}
              value={data?.s_gtime}
            />

            {/* Sales day */}
            <MonthlyParkingDirectMenuItem
              title={strings?.monthly_parking_direct_details?.sales_day}
              value={data?.s_gday}
            />

            {/* Phone number */}
            <MonthlyParkingDirectMenuItem
              title={strings?.general_text?.phone_number}
              value={data?.pnum}
            />

            {/* Uniqueness */}
            <MonthlyParkingDirectMenuItem
              title={strings?.monthly_parking_direct_details?.uniqueness}
              value={data?.s_garageInfo}
            />

            <HStack>
              <View style={styles.imageWrapper}>
                {images?.carImage1Id ? (
                  <TouchableOpacity
                    onPress={() =>
                      imageViewerRef.current?.show(getImageURL(images?.carImage1Id, false))
                    }>
                    <Image
                      source={{uri: getImageURL(images?.carImage1Id, true)}}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.image} />
                )}
                <CustomText
                  textStyle={styles.descriptionText}
                  string={strings?.monthly_parking_direct_details?.representative_photo}
                  size={FONT.CAPTION_2}
                />
              </View>
              <View style={styles.imageWrapper}>
                {images?.carImage2Id ? (
                  <TouchableOpacity
                    onPress={() =>
                      imageViewerRef.current?.show(getImageURL(images?.carImage2Id, false))
                    }>
                    <Image
                      source={{uri: getImageURL(images?.carImage2Id, true)}}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.image} />
                )}
                <CustomText
                  textStyle={styles.descriptionText}
                  string={strings?.monthly_parking_direct_details?.access}
                  size={FONT.CAPTION_2}
                />
              </View>
              <View style={styles.imageWrapper}>
                {images?.carImage3Id ? (
                  <TouchableOpacity
                    onPress={() =>
                      imageViewerRef.current?.show(getImageURL(images?.carImage3Id, false))
                    }>
                    <Image
                      source={{uri: getImageURL(images?.carImage3Id, true)}}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.image} />
                )}
                <CustomText
                  textStyle={styles.descriptionText}
                  string={strings?.monthly_parking_direct_details?.parking_space_1}
                  size={FONT.CAPTION_2}
                />
              </View>
              <View style={styles.imageWrapper}>
                {images?.carImage4Id ? (
                  <TouchableOpacity
                    onPress={() =>
                      imageViewerRef.current?.show(getImageURL(images?.carImage4Id, false))
                    }>
                    <Image
                      source={{uri: getImageURL(images?.carImage4Id, true)}}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.image} />
                )}
                <CustomText
                  textStyle={styles.descriptionText}
                  string={strings?.monthly_parking_direct_details?.parking_space_2}
                  size={FONT.CAPTION_2}
                />
              </View>
            </HStack>
            <Divider />

            <HStack style={styles.buttonGroupWrapper}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWraper}>
                <CustomText
                  string={strings?.general_text?.list}
                  color={colors.darkGray}
                  size={FONT.CAPTION}
                />
              </TouchableOpacity>

              {userToken?.id === Number(data?.s_memberId) ? (
                <HStack>
                  {data?.c_appYN === IS_ACTIVE.NO ? (
                    <TouchableOpacity onPress={handleCompleteMonthlyParkingDirect}>
                      <HStack
                        style={[
                          styles.iconWraper,
                          {
                            backgroundColor: colors.red,
                          },
                        ]}>
                        <Icon name="check" color={colors.white} />
                        <CustomText
                          string={` ${strings?.monthly_parking_direct_details?.transaction_completed}`}
                          color={colors.white}
                          size={FONT.CAPTION}
                        />
                      </HStack>
                    </TouchableOpacity>
                  ) : null}

                  {/* Delete bbs */}
                  <TouchableOpacity onPress={handleDeleteBBS} style={{marginLeft: widthScale(10)}}>
                    <HStack
                      style={[
                        styles.iconWraper,
                        {
                          backgroundColor: colors.blue,
                        },
                      ]}>
                      <Icon name="close" color={colors.white} />
                      <CustomText
                        string={` ${strings?.general_text?.delete}`}
                        color={colors.white}
                        size={FONT.CAPTION}
                      />
                    </HStack>
                  </TouchableOpacity>
                </HStack>
              ) : null}
            </HStack>

            {/* Comment */}
            <View style={styles.commentContent}>
              <CustomText string={strings?.general_text?.comment} family={FONT_FAMILY.SEMI_BOLD} />
              <TextInput
                placeholder={strings?.general_text?.wrire_a_comment}
                multiline
                style={styles.input}
                value={commentText}
                onChangeText={setCommentText}
                placeholderTextColor={colors.grayText}
              />
              <TouchableOpacity
                onPress={handleSunmitComment}
                style={styles.submitCommentWrapper}
                disabled={isLoading}>
                <CustomText
                  string={strings?.general_text?.enroll}
                  size={FONT.CAPTION_2}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>

            {/* Reply list */}
            <MonthlyParkingDirectComment BBSID={data?.s_no} />
          </KeyboardAvoidingView>
        </ScrollView>

        {/* Image Viewer */}
        <ImageViewer ref={imageViewerRef} />

        {/* View parking location */}
        <ViewParkingLocationModal ref={viewParkingLocationRef} />
      </FixedContainer>
    );
  },
);

export default MonthlyParkingDirectDetails;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: PADDING,
  },
  statusWrapper: {
    backgroundColor: colors.blue,
    width: widthScale(70),
    maxWidth: widthScale(100),
    height: heightScale(30),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING / 2,
  },
  userInfoWrapper: {
    marginTop: PADDING / 2,
    marginBottom: PADDING,
  },
  viewInMapWrapper: {
    backgroundColor: colors.blue,
    height: heightScale(25),
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: PADDING / 2,
    marginLeft: widthScale(5),
  },
  imageContent: {
    marginTop: PADDING,
  },
  imageWrapper: {
    width: (width - PADDING * 2 - widthScale(24)) / 4,
    marginHorizontal: widthScale(3),
    alignItems: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: widthScale(5),
    marginTop: PADDING / 2,
    backgroundColor: colors.gray,
  },
  descriptionText: {
    marginTop: PADDING / 2,
    marginBottom: PADDING,
  },
  buttonGroupWrapper: {
    marginTop: PADDING,
    justifyContent: 'space-between',
  },
  iconWraper: {
    minHeight: heightScale(30),
    padding: PADDING / 2,
    backgroundColor: colors.gray,
    borderRadius: widthScale(5),
  },
  commentContent: {
    marginVertical: PADDING,
  },
  submitCommentWrapper: {
    backgroundColor: colors.red,
    width: widthScale(65),
    minHeight: heightScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthScale(5),
    alignSelf: 'flex-end',
  },
  input: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.REGULAR,
    minHeight: heightScale(80),
    backgroundColor: `${colors.gray}50`,
    marginVertical: PADDING / 2,
    padding: PADDING / 2,
    textAlignVertical: 'top',
    borderRadius: widthScale(5),
  },
});
