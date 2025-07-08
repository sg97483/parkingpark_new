import React, {memo} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface Props {
  number: string;
  onPressChange?: () => void;
  style?: StyleProp<ViewStyle>;
  bottomContent?: React.ReactElement;
  hideChangeCard?: boolean;
}
const ViewCard = (props: Props) => {
  const {number, onPressChange, style, bottomContent, hideChangeCard} = props;

  return (
    <>
      <View style={[styles.view, style]}>
        <View>
          <CustomText family={FONT_FAMILY.SEMI_BOLD} size={FONT.BODY} string="결제수단" />
          <View style={styles.viewIcon}>
            {/* Icons.Card  Icons.Coin  Icons.Wallet   */}
            <Icons.Card style={styles.icon} />
            <CustomText string={`국민 ${number}`} />
          </View>
        </View>
        {!hideChangeCard && (
          <TouchableOpacity onPress={onPressChange} style={styles.button}>
            <CustomText color={colors.lineCancel} string="변경" />
          </TouchableOpacity>
        )}
      </View>

      {bottomContent}
    </>
  );
};

export default memo(ViewCard);

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: widthScale(20),
    backgroundColor: colors.policy,
    borderRadius: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: colors.disableButton,
    width: widthScale(45),
    height: heightScale(38),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  icon: {
    marginRight: widthScale(12),
  },
  viewIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: heightScale(20),
  },
});
