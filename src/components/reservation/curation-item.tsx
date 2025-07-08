import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import React, {memo} from 'react';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {PADDING, width} from '~constants/constant';
import {heightScale, widthScale} from '~styles/scaling-utils';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';

interface Props {
  parkingName: string;
  parkingExp: string;
  parkingMoney: string;
  onItemPress: () => void;
}

const CurationItem: React.FC<Props> = memo(props => {
  const {parkingExp, parkingMoney, parkingName, onItemPress} = props;

  return (
    <TouchableWithoutFeedback onPress={onItemPress}>
      {/* 👇 이 부분이 수정되었습니다. (그림자를 담당하는 View로 감싸기) */}
      <View style={styles.shadowContainer}>
        <View style={styles.contentWrapper}>
          <HStack
            style={{
              alignItems: 'flex-start',
            }}>
            <View style={{flex: 1, marginRight: widthScale(5)}}>
              <CustomText string={parkingName} family={FONT_FAMILY.BOLD} />
            </View>
            <CustomText string={parkingMoney} />
          </HStack>
          <CustomText
            string={parkingExp}
            textStyle={{
              marginTop: heightScale(5),
            }}
            size={FONT.CAPTION}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default CurationItem;

const styles = StyleSheet.create({
  // 그림자를 담당하는 외부 컨테이너
  shadowContainer: {
    marginBottom: PADDING / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: width * 0.7, // 너비는 그림자 컨테이너가 가지도록 설정
  },
  // 실제 내용을 담는 내부 컨테이너
  contentWrapper: {
    backgroundColor: colors.white,
    padding: widthScale(10),
    borderRadius: widthScale(10),
    overflow: 'hidden', // 그림자 모양을 위해 추가
  },
});
