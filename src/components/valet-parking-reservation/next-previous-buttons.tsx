import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import HStack from '~components/h-stack';
import {UseRootStackNavigation} from '~navigators/stack';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthScale} from '~styles/scaling-utils';
import {colors} from '~styles/colors';
import {strings} from '~constants/strings';
import CustomText from '~components/custom-text';
import {PADDING} from '~constants/constant';

interface Props {
  onPreviousPress?: () => void;
  onNextPress: () => void;
}

const NextPreviousButtons: React.FC<Props> = memo(props => {
  const {onNextPress, onPreviousPress} = props;

  const navigation: UseRootStackNavigation = useNavigation();
  return (
    <HStack style={styles.navigateViewWrapper}>
      <TouchableOpacity
        onPress={() => {
          if (onPreviousPress) {
            onPreviousPress();
          } else {
            navigation.goBack();
          }
        }}>
        <HStack>
          <Icon name="chevron-left-circle-outline" size={widthScale(30)} color={colors.darkGray} />
          <CustomText string={strings?.general_text?.before} color={colors.darkGray} />
        </HStack>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onNextPress}
        style={{
          marginLeft: PADDING,
        }}>
        <HStack>
          <CustomText string={strings?.general_text?.next} color={colors.darkGray} />
          <Icon name="chevron-right-circle-outline" size={widthScale(30)} color={colors.darkGray} />
        </HStack>
      </TouchableOpacity>
    </HStack>
  );
});
export default NextPreviousButtons;

const styles = StyleSheet.create({
  navigateViewWrapper: {
    alignSelf: 'center',
    marginVertical: PADDING / 2,
  },
});
