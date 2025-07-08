import React, {memo} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface Props {
  title: string;
  subTitle?: string;
  onPress: () => void;
}

const MenuItem: React.FC<Props> = memo(props => {
  const {onPress, title, subTitle = ''} = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <HStack style={styles.container}>
        <View style={{flex: 1}}>
          <CustomText string={title} family={FONT_FAMILY.SEMI_BOLD} />
        </View>
        <View style={{flexShrink: 1}}>
          <HStack>
            <CustomText string={subTitle} color={colors.darkGray} />
            <Icon name="chevron-right" size={widthScale(30)} color={colors.red} />
          </HStack>
        </View>
      </HStack>
    </TouchableWithoutFeedback>
  );
});

export default MenuItem;

const styles = StyleSheet.create({
  container: {
    minHeight: heightScale(50),
    marginLeft: PADDING,
  },
});
