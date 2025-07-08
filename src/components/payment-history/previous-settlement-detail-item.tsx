import React, {FC, memo} from 'react';
import {TouchableHighlight, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

interface Props {
  item: any;
}

const PreviousSettlementDetailItem: FC<Props> = memo(props => {
  const {item} = props;
  return (
    <View>
      <TouchableHighlight underlayColor={colors.policy} onPress={() => {}}>
        <HStack
          style={{
            justifyContent: 'space-between',
            minHeight: heightScale1(56),
            padding: PADDING1,
          }}>
          <HStack style={{gap: widthScale1(6)}}>
            <CustomText
              string="10월 2주"
              color={colors.black}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION_7}
            />
            <Icons.Dot width={2} height={2} />
            <CustomText
              color={item?.status === 'DONE' ? colors.disableButton : colors.heavyGray}
              string={item?.status === 'DONE' ? '정산완료' : '정산예정'}
              forDriveMe
              family={FONT_FAMILY.MEDIUM}
            />
          </HStack>

          <HStack>
            <CustomText
              string={`${item?.amount || '116,000'}원`}
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.BODY}
              lineHeight={heightScale1(25)}
              textStyle={{marginRight: widthScale1(6)}}
              color={colors.black}
              forDriveMe
            />
            <Icons.ChevronRight width={widthScale1(16)} height={widthScale1(16)} />
          </HStack>
        </HStack>
      </TouchableHighlight>
    </View>
  );
});

export default PreviousSettlementDetailItem;
