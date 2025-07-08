import React, {useCallback} from 'react';
import {FlatList, Linking, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import {PADDING1, WIDTH} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

const INSURANCE_COMPANY_LIST: {
  name: string;
  image: React.ReactNode;
  phone: string;
}[] = [
  {
    name: '삼성화재',
    phone: '1588-5114',
    image: <Icons.SamsungInsurance />,
  },
  {
    name: '현대해상',
    phone: '1588-5656',
    image: <Icons.HyundaiInsurance />,
  },
  {
    name: 'DB손해보험',
    phone: '1588-0100',
    image: <Icons.DBInsurance />,
  },
  {
    name: 'KB손해보험',
    phone: '1588-0114',
    image: <Icons.KBInsurance />,
  },
  {
    name: '한화손해보험',
    phone: '1588-8000',
    image: <Icons.HanwhaInsurance />,
  },
  {
    name: '메리츠화재',
    phone: '1588-7711',
    image: <Icons.MeritzInsurance />,
  },
  {
    name: '롯데손해보험',
    phone: '1588-3344',
    image: <Icons.LotteInsurance />,
  },
  {
    name: 'MG손해보험',
    phone: '1588-5959',
    image: <Icons.MGInsurance />,
  },
  {
    name: 'AXA다이렉트',
    phone: '1588-1566',
    image: <Icons.AXAInsurance />,
  },
  {
    name: '캐롯퍼마일',
    phone: '1588-0300',
    image: <Icons.CarrotPermile />,
  },
  {
    name: '흥국손해보험',
    phone: '1588-1688',
    image: <Icons.HeungkukInsurance />,
  },
  {
    name: '신한생명',
    phone: '1588-5580',
    image: <Icons.ShinhanInsurance />,
  },
  {
    name: 'AIG 손해보험',
    phone: '1588-2792',
    image: <Icons.AIGInsurance />,
  },
  {
    name: '에이스손해보험',
    phone: '1588-5800',
    image: <Icons.AceInsurance />,
  },
  {
    name: 'The K 손해보험',
    phone: '1588-3000',
    image: <Icons.TheKInsurance />,
  },
];

const ITEM_WIDTH = (WIDTH - PADDING1 * 2 - widthScale1(11)) / 2;

const InsuranceClaimNumber = (props: RootStackScreenProps<'InsuranceClaimNumber'>) => {
  const {navigation} = props;

  const handleCallHotLine = useCallback(
    (phone: string) => () => {
      const insurancePhone = phone.replace('-', '');
      Linking.openURL(`tel:${insurancePhone}`);
    },
    [],
  );

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: {
        name: string;
        image: React.ReactNode;
        phone: string;
      };
      index: number;
    }) => {
      return (
        <View
          style={[
            styles.itemWrapperStyle,
            {
              marginRight: index % 2 === 0 ? widthScale1(10) : 0,
            },
          ]}>
          {item?.image}
          <CustomButton
            onPress={handleCallHotLine(item?.phone)}
            type="SECONDARY"
            buttonHeight={38}
            text={item?.phone}
            iconType="HEAD_PHONE"
            leftIconReload
            borderRadiusValue={6}
            textSize={FONT.CAPTION_6}
          />
        </View>
      );
    },
    [],
  );

  const headerList = useCallback(() => {
    return (
      <View>
        <CustomText
          string={'아래 차량 보험사 접수 번호 안내는\n단순 정보 제공임을 안내드립니다.'}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_8}
          forDriveMe
          color={colors.black}
          lineHeight={heightScale1(28)}
        />
        <CustomText
          string={'파킹박에서는 해당 사고 접수처리에 대한 책임을 지지 않는점 참고 부탁드립니다.'}
          color={colors.grayText}
          textStyle={{
            marginBottom: heightScale1(30),
            marginTop: heightScale1(6),
          }}
          forDriveMe
          lineHeight={heightScale1(20)}
        />
      </View>
    );
  }, []);

  return (
    <FixedContainer edges={['top']}>
      <CustomHeader text="차량 보험사 접수번호 안내" />

      <FlatList
        data={INSURANCE_COMPANY_LIST}
        keyExtractor={item => item?.phone}
        renderItem={renderItem}
        numColumns={2}
        ListHeaderComponent={headerList}
        contentContainerStyle={{
          paddingHorizontal: PADDING1,
          paddingVertical: heightScale1(20),
        }}
        showsVerticalScrollIndicator={false}
      />
    </FixedContainer>
  );
};

export default InsuranceClaimNumber;

const styles = StyleSheet.create({
  itemWrapperStyle: {
    width: ITEM_WIDTH,
    borderWidth: 1,
    borderRadius: scale1(8),
    justifyContent: 'center',
    alignItems: 'center',
    padding: widthScale1(14),
    marginBottom: widthScale1(10),
    borderColor: colors.borderDashed,
    minHeight: heightScale1(127),
  },
  phoneViewStyle: {
    backgroundColor: colors.heavyGray,
    width: ITEM_WIDTH - widthScale1(28),
    minHeight: heightScale1(38),
    justifyContent: 'center',
    borderRadius: scale1(8),
    marginTop: heightScale1(10),
    gap: widthScale1(2),
  },
});
