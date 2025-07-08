import React, {memo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import {FavoriteUserModel} from '~/model/driver-model';
import Avatar from '~components/commons/avatar';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {widthScale1} from '~styles/scaling-utils';

interface Props {
  item: FavoriteUserModel;
  isFavoritePassenger?: boolean;
  onPress: () => void;
  onRemoveFavoritePress: () => void;
}

const FavoriteUserItem: React.FC<Props> = memo(props => {
  const {item, isFavoritePassenger, onPress, onRemoveFavoritePress} = props;

  return (
    <Pressable onPress={onPress}>
      <HStack style={styles.containerStyle}>
        <Avatar uri={item?.profileImageUrl ?? ''} size={40} />

        <View style={styles.infoWrapperStyle}>
          <HStack style={{gap: widthScale1(4)}}>
            <CustomText
              numberOfLines={1}
              string={`${item?.nic ?? ''} `}
              size={FONT.SUB_HEAD}
              family={FONT_FAMILY.MEDIUM}
              forDriveMe
              textStyle={{
                maxWidth: widthScale1(110),
              }}
            />
            <CustomText
              numberOfLines={1}
              string={`${isFavoritePassenger ? '탑승객님' : '드라이버님'}`}
              size={FONT.SUB_HEAD}
              family={FONT_FAMILY.MEDIUM}
              forDriveMe
              textStyle={{
                maxWidth: widthScale1(110),
              }}
            />
            {item?.authYN === 'Y' && <Icons.VerifivationMarkText />}
          </HStack>

          <CustomText
            size={FONT.CAPTION}
            numberOfLines={1}
            string={`총 카풀횟수 ${item?.driverCnt ?? 0}회`}
            color={colors.lineCancel}
            family={FONT_FAMILY.MEDIUM}
            forDriveMe
          />
        </View>

        <Pressable hitSlop={40} onPress={onRemoveFavoritePress}>
          <Icons.StarFillBlack />
        </Pressable>
      </HStack>
    </Pressable>
  );
});

export default FavoriteUserItem;

const styles = StyleSheet.create({
  containerStyle: {
    paddingVertical: PADDING1,
    paddingHorizontal: PADDING1,
    gap: widthScale1(6),
  },
  infoWrapperStyle: {
    flex: 1,
  },
});
