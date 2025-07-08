import React, {memo} from 'react';
import {ActivityIndicator, Image, Pressable, StyleSheet, View} from 'react-native';
import {ICONS} from '~/assets/images-path';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  title: string;
  subTitle: string;
  onPress: () => void;
  iconType?: 'CARD' | 'USER';
  disable?: boolean;
  isLoading?: boolean;
}

const ModeSelectionItem: React.FC<Props> = memo(props => {
  const {iconType = 'CARD', onPress, subTitle, title, disable, isLoading} = props;

  return (
    // 👇 이 부분이 수정되었습니다. (그림자를 담당하는 View로 감싸기)
    <View style={styles.shadowContainer}>
      <Pressable disabled={disable || isLoading} onPress={onPress} style={styles.pressableContent}>
        {isLoading ? (
          <ActivityIndicator
            color={colors.primary}
            style={{marginTop: 'auto', marginBottom: 'auto'}}
          />
        ) : (
          <HStack style={styles.contentContainerStyle}>
            <View style={styles.leftContentStyle}>
              <CustomText
                forDriveMe
                family={FONT_FAMILY.SEMI_BOLD}
                size={FONT.CAPTION_8}
                string={title}
                lineHeight={heightScale1(28)}
              />
              <CustomText
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                size={FONT.CAPTION}
                color={colors.grayText2}
                string={subTitle}
                lineHeight={heightScale1(18)}
              />
            </View>

            <Image
              style={styles.iconStyle}
              source={iconType === 'CARD' ? ICONS.item_card : ICONS.item_user}
            />
          </HStack>
        )}
      </Pressable>
    </View>
  );
});

export default ModeSelectionItem;

const styles = StyleSheet.create({
  // 그림자를 담당하는 외부 컨테이너
  shadowContainer: {
    width: '100%',
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 10,
  },
  // 실제 Pressable의 내용과 모양을 담당
  pressableContent: {
    backgroundColor: colors.white,
    minHeight: heightScale1(108),
    padding: widthScale1(18),
    borderRadius: scale1(16),
    overflow: 'hidden', // 그림자와 내용물이 겹치지 않도록
  },
  contentContainerStyle: {
    gap: widthScale1(8),
    flexGrow: 1,
    width: '100%',
    alignItems: 'flex-start',
  },
  leftContentStyle: {
    flexGrow: 1,
    gap: heightScale1(8),
  },
  iconStyle: {
    width: widthScale1(35),
    height: widthScale1(35),
  },
});
