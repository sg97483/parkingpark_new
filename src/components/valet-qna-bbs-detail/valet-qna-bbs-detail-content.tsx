import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';
import {ICONS} from '~/assets/images-path';
import Button from '~components/button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {FONT} from '~constants/enum';
import {strings} from '~constants/strings';
import {ValetQnaBbsProps} from '~constants/types';
import {useAppSelector} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface Props {
  data: ValetQnaBbsProps;
  replyCount: number;
  onPressDelete: () => void;
}

const ValetQnaBbsDetailContent: React.FC<Props> = ({data, replyCount, onPressDelete}: Props) => {
  const navigation = useNavigation();
  const userToken = useAppSelector(state => state.userReducer.userToken);

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.inputStyle}
          value={data?.text?.trim() || ''}
          textAlignVertical="top"
          multiline
          editable={false}
        />

        <HStack style={styles.comment}>
          <Image source={ICONS.icon__comment} style={styles.icon} />
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
        {data?.memberId === userToken?.id ? (
          <Button
            text={strings.parking_request_notice_board_detail.delete}
            borderColor={colors.gray}
            color={colors.transparent}
            style={styles.button}
            textColor={colors.black}
            onPress={onPressDelete}
          />
        ) : null}
      </HStack>
    </View>
  );
};

export default memo(ValetQnaBbsDetailContent);

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
});
