import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';

interface Props {
  isChecked: boolean;
  onPress?: () => void;
  checkedColor?: string;
  checkBackground?: string;
  borderColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const Checkbox: React.FC<Props> = memo(props => {
  const {
    isChecked,
    onPress,
    checkedColor = colors.green,
    checkBackground = colors.white,
    borderColor,
    containerStyle,
  } = props;
  return (
    <Pressable
      hitSlop={{
        bottom: 20,
        left: 20,
        right: 20,
        top: 20,
      }}
      onPress={onPress}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: checkBackground,
            borderColor: borderColor || colors.darkGray,
          },
          containerStyle,
        ]}>
        <Icon
          name="check"
          size={widthScale(18)}
          color={isChecked ? checkedColor : colors.transparent}
        />
      </View>
    </Pressable>
  );
});

export default Checkbox;

const styles = StyleSheet.create({
  container: {
    borderWidth: widthScale(1.5),
    width: widthScale(20),
    height: widthScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.grayCheckBox,
    borderRadius: widthScale(5),
  },
});
