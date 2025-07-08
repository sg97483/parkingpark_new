import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING_HEIGHT} from '~constants/constant';
import {FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {widthScale} from '~styles/scaling-utils';

interface IProps {
  title: string;
  disabled?: boolean;
  isSelected: boolean;
  onPress: () => void;
}

const ParkingInfoTabItem: React.FC<IProps> = memo(props => {
  const {onPress, disabled = false, title, isSelected} = props;
  return (
    <TouchableOpacity
      style={{marginVertical: PADDING_HEIGHT / 2}}
      disabled={disabled}
      onPress={onPress}>
      <HStack style={{justifyContent: 'space-between'}}>
        <CustomText
          string={title}
          family={FONT_FAMILY.SEMI_BOLD}
          color={isSelected ? colors.primary : colors.black}
        />
        <Icon
          name={isSelected ? 'chevron-down' : 'chevron-right'}
          size={widthScale(30)}
          color={isSelected ? colors.primary : colors.black}
        />
      </HStack>
    </TouchableOpacity>
  );
});

export default ParkingInfoTabItem;
