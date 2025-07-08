import {Pressable, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {SettlementModel} from '~model/settlement-model';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import HStack from '~components/h-stack';
import {Icons} from '~/assets/svgs';
import CustomText from '~components/custom-text';
import {getNumberWithCommas} from '~utils/numberUtils';
import {colors} from '~styles/colors';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {useNavigation} from '@react-navigation/native';
import {UseRootStackNavigation} from '~navigators/stack';
import {ROUTE_KEY} from '~navigators/router';

interface Props {
  item: SettlementModel;
}

const SettlementItem = memo((props: Props) => {
  const {item} = props;
  const navigation = useNavigation<UseRootStackNavigation>();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate(ROUTE_KEY.AccountSettlementDetails, {
          item,
        })
      }>
      <PaddingHorizontalWrapper forDriveMe>
        <HStack style={styles.containerStyle}>
          <HStack style={{flex: 1, gap: widthScale1(2)}}>
            {item?.calYN === 'M' ? (
              <Icons.Wallet width={widthScale1(16)} height={widthScale1(16)} />
            ) : (
              <Icons.Coin width={widthScale1(16)} height={widthScale1(16)} />
            )}

            <HStack style={{gap: widthScale1(6)}}>
              <CustomText
                string={item?.selectDay}
                forDriveMe
                color={colors.black}
                family={FONT_FAMILY.MEDIUM}
                size={FONT.CAPTION_7}
              />
              <Icons.Dot />
              <CustomText
                string={Number(item?.incomePrice) > 0 ? '정산완료' : '정산예정'}
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                color={item?.payStatus === 'Y' ? colors.heavyGray : colors.disableButton}
              />
            </HStack>
          </HStack>

          <HStack style={{gap: widthScale1(6)}}>
            <CustomText
              string={`${getNumberWithCommas(
                Number(item?.incomePrice) > 0 ? item?.incomePrice : item?.estPrice,
              )}원`}
              forDriveMe
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.BODY}
            />
            <Icons.ChevronRight width={widthScale1(16)} height={widthScale1(16)} />
          </HStack>
        </HStack>
      </PaddingHorizontalWrapper>
    </Pressable>
  );
});

export default SettlementItem;

const styles = StyleSheet.create({
  containerStyle: {
    minHeight: heightScale1(65),
  },
});
