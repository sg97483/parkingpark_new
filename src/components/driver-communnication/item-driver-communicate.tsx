import {StyleSheet, View, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import React, {memo} from 'react';

import HStack from '~components/h-stack';
import CustomText from '~components/custom-text';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import Park from '~/assets/svgs/Park';

interface Props {
  title: string;
  car_number: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPress: (value: string) => void;
  hideButton?: boolean;
}

const ItemDriverCommunicate: React.FC<Props> = memo(props => {
  const {title, car_number, containerStyle, onPress, hideButton} = props;

  return (
    <TouchableOpacity
      style={[
        {justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'},
        containerStyle,
      ]}
      disabled={!hideButton}
      onPress={() => onPress(title)}>
      <View>
        <HStack>
          <Park />
          <CustomText
            string={title}
            color={colors.menuTextColor}
            textStyle={{fontSize: widthScale(15), paddingLeft: widthScale(6)}}
          />
        </HStack>
        <CustomText
          string={car_number}
          color={colors.grayText}
          family={FONT_FAMILY.REGULAR}
          size={FONT.CAPTION_6}
          textStyle={{fontSize: widthScale(15), paddingTop: widthScale(4)}}
        />
      </View>

      {hideButton ? null : (
        <TouchableOpacity style={styles.button} onPress={() => onPress(title)}>
          <CustomText
            string={strings.driver_communication.go}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_6}
            color={colors.lineCancel}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
});

export default ItemDriverCommunicate;

const styles = StyleSheet.create({
  button: {
    paddingVertical: heightScale(9),
    paddingHorizontal: widthScale(10),
    borderWidth: 1,
    borderRadius: widthScale(8),
    borderColor: colors.disableButton,
  },
});
