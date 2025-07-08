import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import React from 'react';
import CustomText from './custom-text';
import {colors} from '~styles/colors';
import {widthScale, heightScale} from '~styles/scaling-utils';

interface Props {
  Icon: React.ReactElement;
  title: string;
  value?: string;
  placeholder?: string;
  isShowIcon?: boolean;
  style?: ViewStyle;
}
const TextInputChoose = ({value, Icon, title, placeholder, isShowIcon, style}: Props) => {
  return (
    <View style={[styles.view, style]}>
      <CustomText style={styles.textTitle} string={title} color={colors.grayText} />
      <TouchableOpacity onPress={() => Icon.props.onPress()} style={styles.contentView}>
        <View style={styles.valueText}>
          {value ? (
            <CustomText string={value!} color={colors.black} />
          ) : (
            <CustomText string={placeholder!} color={colors.grayText} />
          )}
        </View>
        {isShowIcon && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {Icon}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TextInputChoose;

const styles = StyleSheet.create({
  textTitle: {
    width: widthScale(60),
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: heightScale(5),
  },
  valueText: {
    flex: 1,
    minHeight: heightScale(50),
    justifyContent: 'center',
  },
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: widthScale(7),
    borderWidth: widthScale(1.5),
    borderColor: colors.gray,
    width: widthScale(280),
    paddingHorizontal: widthScale(10),
    minHeight: heightScale(50),
  },
});
