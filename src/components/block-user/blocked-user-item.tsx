import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import Avatar from '~components/commons/avatar';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import Divider from '~components/divider';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {BlockedUserModel} from '~model/driver-model';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  onUnlockPress: () => void;
  item: BlockedUserModel;
}

const BlockedUserItem: React.FC<Props> = memo(props => {
  const {onUnlockPress, item} = props;

  return (
    <View>
      <HStack style={styles.containerStyle}>
        {/* avatar */}
        <Avatar uri={item?.profileImageUrl ? item?.profileImageUrl : ''} size={40} />

        {/* Info */}
        <View style={styles.infoStyle}>
          <CustomText
            size={FONT.CAPTION_7}
            family={FONT_FAMILY.MEDIUM}
            forDriveMe
            string={item?.nic ?? ''}
            color={colors.black}
            lineHeight={heightScale1(22)}
            numberOfLines={1}
          />
          {item?.email ? (
            <CustomText
              family={FONT_FAMILY.MEDIUM}
              forDriveMe
              string={item?.email ?? ''}
              lineHeight={heightScale1(20)}
              color={colors.grayText}
              numberOfLines={1}
            />
          ) : null}
        </View>

        {/* Unblock button */}
        <CustomButton
          type="SECONDARY"
          text="차단중"
          textSize={FONT.CAPTION_6}
          buttonStyle={styles.unblockButtonStyle}
          onPress={onUnlockPress}
          buttonHeight={38}
          borderRadiusValue={6}
        />
      </HStack>
      <Divider />
    </View>
  );
});

export default BlockedUserItem;

const styles = StyleSheet.create({
  containerStyle: {
    padding: PADDING1,
    gap: widthScale1(10),
  },
  infoStyle: {
    flex: 1,
  },
  unblockButtonStyle: {
    minWidth: widthScale1(57),
    paddingHorizontal: widthScale1(10),
  },
});
