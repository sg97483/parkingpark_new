import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {PADDING, width} from '~constants/constant';
import CustomText, {getFontSize} from '~components/custom-text';
import {ICONS, IMAGES} from '~/assets/images-path';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import Checkbox from '~components/checkbox';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage} from 'react-native-flash-message';
import Mailer from 'react-native-mail';
import Logger from '~utils/logger';

const MOCKING_DATA: ModifyProps[] = [
  {
    icon: ICONS.icon_modify1,
    text: '요금정보가 다릅니다.',
  },
  {
    icon: ICONS.icon_modify2,
    text: '무료 할인정보가 달라졌습니다.',
  },
  {
    icon: ICONS.icon_modify3,
    text: '시간이 잘못되었습니다.',
  },
  {
    icon: ICONS.icon_modify4,
    text: '위치가 잘못되었습니다.',
  },
];

interface ModifyProps {
  icon: number;
  text: string;
}

const RequestEditParking = memo((props: RootStackScreenProps<'RequestEditParking'>) => {
  const {navigation, route} = props;

  const parkingID = route?.params?.id;
  const garageName = route?.params?.garageName;
  console.log('🚀 ~ file: request-edit-parking.tsx:59 ~ garageName', garageName);

  const [seletcedItem, setSeletcedItem] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [details, setDetails] = useState<string>('');

  const handlePressItem = (value: string) => {
    if (seletcedItem?.includes(value)) {
      const temp = [...seletcedItem]?.filter(item => item !== value);
      setSeletcedItem(temp);
    } else {
      setSeletcedItem([...seletcedItem, value]);
    }
  };

  const renderItem = useCallback(
    ({item}: {item: ModifyProps}) => {
      return (
        <View>
          <HStack style={styles.checkItemWrapper}>
            <Checkbox
              isChecked={seletcedItem.includes(item?.text)}
              onPress={() => handlePressItem(item?.text)}
            />
            <Image source={item?.icon} resizeMode="contain" style={styles.icon} />
            <View style={{flex: 1}}>
              <CustomText
                size={FONT.CAPTION_2}
                color={colors.blue}
                string={item?.text}
                numberOfLines={1}
              />
            </View>
          </HStack>
        </View>
      );
    },
    [seletcedItem],
  );

  const handleSubmit = () => {
    if (!details) {
      showMessage({
        message: '내용을 입력해 주세요.',
      });
      return;
    }
    Mailer.mail(
      {
        subject: '[파킹박] 정보수정요청',
        recipients: ['wisemobile@naver.com'],
        body: `제보자 연락처: ${title}\n\n주차장 번호: ${parkingID} (${garageName})\n\n${
          seletcedItem?.length >= 1
            ? seletcedItem.map((item, index) => {
                if (index === seletcedItem?.length - 1) {
                  return `[${item.replace('.', '')}]\n\n`;
                } else {
                  return `[${item.replace('.', '')}]\n`;
                }
              })
            : ''
        }정수정요청 내용: ${details}`.replace(/,/g, ''),
      },
      (error, event) => {
        Logger('error', error);
        Alert.alert(
          error,
          event,
          [
            {
              text: 'Ok',
              onPress: () => console.log('OK: Email Error Response'),
            },
            {
              text: 'Cancel',
              onPress: () => console.log('CANCEL: Email Error Response'),
            },
          ],
          {cancelable: true},
        );
      },
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <FixedContainer>
        <CustomHeader text="정보수정요청" />
        <KeyboardAvoidingView style={styles.container}>
          <Image source={IMAGES.title_modify} resizeMode="contain" style={styles.image} />

          <HStack style={styles.optionsWrapper}>
            <FlatList
              numColumns={2}
              data={MOCKING_DATA}
              renderItem={renderItem}
              keyExtractor={(_, index) => `${index}`}
              scrollEnabled={false}
            />
          </HStack>

          {/* Title */}
          <TextInput
            style={styles.titleInput}
            placeholder="(선택입력) 제보자의 이메일 혹은 전화번호"
            placeholderTextColor={`${colors.darkGray}50`}
            value={title}
            onChangeText={setTitle}
          />

          {/* Details */}
          <TextInput
            style={styles.detailsInput}
            multiline={true}
            placeholder={
              '가능한 상세히 적어주세요.\n예) 이 주차장은 무료주차시간이 30분에서 40분으로 변경되었습니 다.'
            }
            placeholderTextColor={`${colors.darkGray}50`}
            value={details}
            onChangeText={setDetails}
          />
        </KeyboardAvoidingView>

        {/* Sunmit button */}
        <TouchableOpacity onPress={handleSubmit}>
          <HStack style={styles.buttonWrapper}>
            <Icon name="file-send-outline" color={colors.white} size={widthScale(20)} />
            <CustomText
              string="발송하기"
              color={colors.white}
              family={FONT_FAMILY.SEMI_BOLD}
              textStyle={{
                marginLeft: widthScale(5),
              }}
            />
          </HStack>
        </TouchableOpacity>
      </FixedContainer>
    </TouchableWithoutFeedback>
  );
});

export default RequestEditParking;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    paddingTop: PADDING * 2,
    flex: 1,
  },
  image: {
    width: width * 0.65,
    alignSelf: 'center',
  },
  optionsWrapper: {
    flexWrap: 'wrap',
  },
  icon: {
    width: widthScale(15),
    height: widthScale(15),
    marginHorizontal: PADDING / 2,
  },
  checkItemWrapper: {
    marginBottom: PADDING,
    width: (width - PADDING * 2) / 2,
  },
  titleInput: {
    backgroundColor: `${colors.gray}70`,
    padding: PADDING / 2,
    marginBottom: PADDING / 2,
    marginTop: PADDING / 2,
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: getFontSize(FONT.SUB_HEAD),
  },
  detailsInput: {
    flex: 1,
    backgroundColor: `${colors.gray}70`,
    textAlignVertical: 'top',
    padding: PADDING / 2,
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: getFontSize(FONT.SUB_HEAD),
    lineHeight: getFontSize(FONT.SUB_HEAD) * 1.5,
  },
  buttonWrapper: {
    height: heightScale(45),
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
