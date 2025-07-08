import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {colors} from '~styles/colors';
import {height, PADDING, width} from '~constants/constant';
import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ParkingLimitProps} from '~constants/types';

interface Props {}

export interface LimitPopupRefs {
  show: (value: ParkingLimitProps) => void;
  hide: () => void;
}

const LimitPopup = forwardRef((props: Props, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [data, setData] = useState<ParkingLimitProps | null>(null);
  const [parkingLimits, setParkingLimits] = useState<string[]>([]);

  const show = (value: ParkingLimitProps) => {
    let limits: string[] = [];
    if (value?.small) {
      limits.push('경차');
    }
    if (value?.little) {
      limits.push('소형');
    }
    if (value?.semiMedium) {
      limits.push('준중형');
    }
    if (value?.medium) {
      limits.push('중형');
    }
    if (value?.large) {
      console.log('abc');
      limits.push('대형');
    }
    if (value?.suv) {
      limits.push('SUV');
    }
    if (value?.sports) {
      limits.push('스포츠카');
    }

    setData(value);
    setParkingLimits(limits);
    setIsVisible(true);
  };

  const hide = () => {
    setData(null);
    setIsVisible(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [],
  );

  return (
    <ReactNativeModal
      isVisible={isVisible}
      useNativeDriver={true}
      onBackButtonPress={hide}
      onBackdropPress={hide}
      style={styles.container}>
      <View style={styles.content}>
        <HStack style={styles.headerWrapper}>
          <CustomText string="유의사항" family={FONT_FAMILY.SEMI_BOLD} color={colors.white} />
          <TouchableOpacity onPress={hide}>
            <Icon name="close-circle" size={widthScale(22)} color={colors.white} />
          </TouchableOpacity>
        </HStack>
        {/* Content */}
        <ScrollView style={styles.contentWrapper}>
          {parkingLimits?.map((item, index) => {
            return (
              <HStack
                key={index}
                style={{
                  marginBottom: index === parkingLimits?.length - 1 ? PADDING * 3 : PADDING / 2,
                }}>
                <CustomText string={item} color={colors.red} family={FONT_FAMILY.SEMI_BOLD} />
                <CustomText string=" 제한" />
              </HStack>
            );
          })}

          <CustomText string={data?.textField || ''} textStyle={styles.text} color={colors.red} />
        </ScrollView>

        {/* Description */}
        <CustomText
          string="* 위 차종들은 해당 주차장 이용에 제한이 있습니다 *"
          size={FONT.CAPTION_2}
          textStyle={styles.description}
        />

        {/* Search vehicle type */}
        <View style={styles.searchWrapper}>
          {/*<TouchableOpacity
            onPress={() => {
              Linking.openURL(
                'https://know.search.naver.com/knowrender.naver?where=m&pkid=128&tab=search'
              );
            }}>
            <CustomText string="차종 검색하기" color={colors.white} />
          </TouchableOpacity>*/}
        </View>
      </View>
    </ReactNativeModal>
  );
});

export default LimitPopup;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: colors.white,
    width: width * 0.7,
    height: height * 0.5,
    borderRadius: PADDING,
    overflow: 'hidden',
  },
  headerWrapper: {
    height: heightScale(45),
    backgroundColor: colors.pink,
    paddingHorizontal: PADDING,
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    padding: PADDING / 2,
  },
  description: {
    textAlign: 'center',
    marginVertical: PADDING / 2,
  },
  searchWrapper: {
    height: heightScale(45),
    backgroundColor: colors.pink,
    paddingHorizontal: PADDING,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  text: {
    textAlign: 'center',
  },
});
