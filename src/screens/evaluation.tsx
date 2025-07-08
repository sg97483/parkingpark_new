import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icons} from '~/assets/svgs';
import Avatar from '~components/commons/avatar';
import CustomButton from '~components/commons/custom-button';
import CustomTextArea from '~components/commons/custom-text-area';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import RatingStar from '~components/evaluate/rating-star';
import FixedContainer from '~components/fixed-container';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import Spinner from '~components/spinner';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useCreateDriverRatingMutation} from '~services/passengerServices';
import {useReadMyDriverQuery} from '~services/userServices';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';

const Evaluation = (props: RootStackScreenProps<'Evaluation'>) => {
  const {navigation, route} = props;
  const {driverID, resId} = route?.params;
  const {userID} = userHook();

  const {data: driverInfo} = useReadMyDriverQuery(
    {
      memberId: driverID.toString(),
    },
    {skip: !driverID},
  );

  const [eval1, setEval1] = useState<number>(5);
  const [eval2, setEval2] = useState<number>(5);
  const [eval3, setEval3] = useState<number>(5);
  const [review, setReview] = useState<string>('');

  const [createDriverRating] = useCreateDriverRatingMutation();

  const handleCreateRating = useCallback(() => {
    Spinner.show();
    createDriverRating({
      resId: resId,
      driverId: driverID,
      memberId: userID,
      text: review,
      driverQ1: eval1,
      driverQ2: eval2,
      driverQ3: eval3,
    })
      .unwrap()
      .then(res => {
        setTimeout(() => {
          if (res === '200') {
            navigation.navigate(ROUTE_KEY.ParkingParkHome, {
              selectedTab: 1,
            });
            Spinner.hide();
          } else {
            showMessage({
              message: strings.general_text.please_try_again,
            });
            Spinner.hide();
          }
        }, 500);
      });
  }, [driverID, userID, review, eval1, eval2, eval3, navigation]);

  return (
    <FixedContainer>
      <CustomHeader
        hideBack
        text="평가하기"
        rightContent={
          <Pressable
            onPress={() => {
              navigation.navigate(ROUTE_KEY.ParkingParkHome, {
                selectedTab: 1,
              });
            }}>
            <Icons.IconX />
          </Pressable>
        }
      />

      <KeyboardAwareScrollView>
        <ScrollView contentContainerStyle={styles.view}>
          <View style={{gap: heightScale1(10)}}>
            <CustomText
              textStyle={{textAlign: 'center'}}
              size={FONT.CAPTION_8}
              family={FONT_FAMILY.SEMI_BOLD}
              string="오늘의 카풀은 어떠셨나요?"
              forDriveMe
              lineHeight={heightScale1(28)}
            />

            <Avatar size={55} uri={driverInfo?.profileImageUrl ?? ''} />

            <View>
              <CustomText
                forDriveMe
                textStyle={{textAlign: 'center'}}
                string={`${driverInfo?.nic ?? ''} | ${driverInfo?.carNumber}`}
                family={FONT_FAMILY.MEDIUM}
                lineHeight={heightScale1(20)}
              />

              <CustomText
                color={colors.lineInput}
                textStyle={{textAlign: 'center', marginBottom: heightScale1(18)}}
                string="드라이버님을 평가해주세요."
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                lineHeight={heightScale1(20)}
              />
            </View>
          </View>

          <Divider />

          <RatingStar
            star={eval1}
            text={'드라이버가 친절했나요?'}
            style={{marginTop: heightScale1(18), marginBottom: heightScale1(40)}}
            onPress={setEval1}
          />

          <RatingStar
            star={eval2}
            text={'차 안이 청결했나요?'}
            style={{marginBottom: heightScale1(40)}}
            onPress={setEval2}
          />

          <RatingStar
            star={eval3}
            text={'예상시간 내에 도착했나요?'}
            style={{marginBottom: heightScale1(18)}}
            onPress={setEval3}
          />

          <Divider
            style={{
              marginBottom: heightScale1(9),
            }}
          />

          <PaddingHorizontalWrapper forDriveMe>
            <CustomTextArea
              placeholder="드라이버님께 후기를 작성해주세요."
              value={review}
              onChangeText={setReview}
              title=""
            />

            <CustomText
              forDriveMe
              string="모든 평가는 익명으로 특정시간이후 기사님께 전달됩니다."
              color={colors.grayText}
              textStyle={{
                marginTop: PADDING1,
                marginBottom: heightScale1(40),
              }}
            />
          </PaddingHorizontalWrapper>
        </ScrollView>
      </KeyboardAwareScrollView>

      <PaddingHorizontalWrapper
        containerStyles={{marginTop: heightScale1(10), marginBottom: PADDING1 / 2}}
        forDriveMe>
        <CustomButton text="평가완료" buttonHeight={58} onPress={handleCreateRating} />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default Evaluation;
const styles = StyleSheet.create({
  view: {
    paddingTop: PADDING1,
  },
});
