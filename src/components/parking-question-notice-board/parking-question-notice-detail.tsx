import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import {ICONS} from '~/assets/images-path';
import Button from '~components/button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING, PADDING_HEIGHT} from '~constants/constant';
import {FONT} from '~constants/enum';
import {strings} from '~constants/strings';
import {ValetQnaBbsProps} from '~constants/types';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {getImageURL} from '~utils/getImageURL';
interface Props {
  data: ValetQnaBbsProps;
  replyCount: number;
  onPressDelete: () => void;
}

const ParkingQuestionNoticeDetail = ({data, replyCount, onPressDelete}: Props) => {
  const navigation: UseRootStackNavigation = useNavigation();

  const photoId = data?.photoId;
  return (
    <View style={styles.container}>
      <View>
        {photoId ? (
          <TouchableWithoutFeedback
            style={styles.imageWrapper}
            onPress={() =>
              navigation.navigate(ROUTE_KEY.ParkingRequestNoticeImageDetail, {
                imageUrl: getImageURL(photoId, true),
              })
            }>
            <Image
              source={{uri: getImageURL(photoId, true)}}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableWithoutFeedback>
        ) : null}

        <TextInput
          style={styles.inputStyle}
          value={data?.text?.trim() || ''}
          textAlignVertical="top"
          multiline
          editable={false}
        />

        <HStack style={styles.comment}>
          <Image source={ICONS.icon__comment} style={styles.icon} resizeMode="contain" />
          <CustomText
            string={replyCount + ''}
            color={colors.darkGray}
            size={FONT.CAPTION_2}
            textStyle={{marginLeft: widthScale(2)}}
          />
        </HStack>
      </View>

      <HStack style={styles.buttonWrapper}>
        <Button
          text={strings.parking_request_notice_board_detail.list}
          onPress={navigation.goBack}
          borderColor={colors.gray}
          color={colors.transparent}
          style={styles.button}
          textColor={colors.black}
        />
        <Button
          text={strings.parking_request_notice_board_detail.delete}
          borderColor={colors.gray}
          color={colors.transparent}
          style={styles.button}
          textColor={colors.black}
          onPress={onPressDelete}
        />
      </HStack>
    </View>
  );
};

export default ParkingQuestionNoticeDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  inputStyle: {
    minHeight: heightScale(100),
    padding: PADDING / 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  icon: {
    width: widthScale(12),
    height: heightScale(12),
    resizeMode: 'contain',
    tintColor: colors.darkGray,
  },
  comment: {
    position: 'absolute',
    bottom: PADDING / 2,
    right: PADDING / 2,
  },
  button: {
    width: widthScale(80),
    borderRadius: widthScale(5),
    minHeight: heightScale(40),
  },
  buttonWrapper: {
    justifyContent: 'space-between',
    marginTop: PADDING / 2,
    paddingHorizontal: PADDING / 2,
    marginBottom: PADDING,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PADDING_HEIGHT / 2,
  },
});
