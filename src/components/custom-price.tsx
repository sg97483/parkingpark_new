import React, {FC, memo} from 'react';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {widthScale1} from '~styles/scaling-utils';
import CustomText from './custom-text';
import HStack from './h-stack';

interface Props {
  price: string;
}

const CustomPrice: FC<Props> = memo(props => {
  const {price} = props;
  return (
    <HStack>
      <CustomText
        string={price}
        family={FONT_FAMILY.SEMI_BOLD}
        size={FONT.CAPTION_8}
        color={colors.menuTextColor}
        textStyle={{marginRight: widthScale1(2)}}
      />
      <CustomText
        string="원"
        family={FONT_FAMILY.SEMI_BOLD}
        size={FONT.CAPTION_8}
        color={colors.menuTextColor}
      />
    </HStack>
  );
});

export default CustomPrice;
