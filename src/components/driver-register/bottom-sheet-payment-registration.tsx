import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import React, {Ref, forwardRef, useCallback, useImperativeHandle, useMemo, useRef} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icons} from '~/assets/svgs';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {PaymentBank} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';

export interface ModalBottomPaymentRefs {
  show: () => void;
  hide: () => void;
}

interface Props {
  onSelectBankName: (name: string) => void;
}

const PAYMENT_BANK_DATA: PaymentBank[] = [
  {
    id: '1',
    name: 'KB국민',
    image: <Icons.KBBank />,
  },
  {
    id: '2',
    name: '기업',
    image: <Icons.EnterpriseBank />,
  },
  {
    id: '3',
    name: '농협',
    image: <Icons.NHBank />,
  },
  {
    id: '4',
    name: '산업',
    image: <Icons.IndustryBank />,
  },
  {
    id: '5',
    name: '수협',
    image: <Icons.SuhyupBank />,
  },
  {
    id: '6',
    name: '신한',
    image: <Icons.ShihanBank />,
  },
  {
    id: '7',
    name: '우리',
    image: <Icons.WeBank />,
  },
  {
    id: '8',
    name: '우체국',
    image: <Icons.PostOfficeBank />,
  },
  {
    id: '9',
    name: '하나',
    image: <Icons.OneBank />,
  },
  {
    id: '10',
    name: '한국씨티',
    image: <Icons.KoreanCityBank />,
  },
  {
    id: '11',
    name: 'SC제일',
    image: <Icons.SCBank />,
  },
  {
    id: '12',
    name: '카카오뱅크',
    image: <Icons.KakaoBank />,
  },
  {
    id: '13',
    name: '케이뱅크',
    image: <Icons.KBank />,
  },
  {
    id: '14',
    name: '토스뱅크',
    image: <Icons.TossBank />,
  },
  {
    id: '15',
    name: '경남',
    image: <Icons.KoreanBank />,
  },
  {
    id: '16',
    name: '광주',
    image: <Icons.GwangjuBank />,
  },
  {
    id: '17',
    name: '대구',
    image: <Icons.DaeguBank />,
  },
  {
    id: '18',
    name: '부산',
    image: <Icons.BusanBank />,
  },
  {
    id: '19',
    name: '전북',
    image: <Icons.JeonbukBank />,
  },
  {
    id: '20',
    name: '제주',
    image: <Icons.JejuBank />,
  },

  {
    id: '21',
    name: '저축',
    image: <Icons.SavingBank />,
  },
  {
    id: '22',
    name: '산림조합',
    image: <Icons.ForestryAssociationBank />,
  },
  {
    id: '23',
    name: '새마을',
    image: <Icons.SaemaeulBank />,
  },
  {
    id: '24',
    name: '신협',
    image: <Icons.CreditUnionBank />,
  },
  {
    id: '25',
    name: '도이치',
    image: <Icons.GermanyBank />,
  },
  {
    id: '26',
    name: '뱅크오브아메리카',
    image: <Icons.AmericaBank />,
  },
  {
    id: '27',
    name: '중국건설',
    image: <Icons.ChineseConstructionBank />,
  },
  {
    id: '28',
    name: '중국공상',
    image: <Icons.ChineseTradeBank />,
  },
  {
    id: '29',
    name: '중국',
    image: <Icons.ChineseBank />,
  },
  {
    id: '30',
    name: 'HSBC',
    image: <Icons.HSBCBank />,
  },
  {
    id: '31',
    name: 'BNP파리바',
    image: <Icons.BNPBank />,
  },
  {
    id: '32',
    name: 'JP모간체이스',
    image: <Icons.JPBank />,
  },
];

const BottomSheetPaymentRegistration = forwardRef((props: Props, ref: Ref<any>) => {
  const bottomModalRefs = useRef<BottomSheetModal>(null);
  const {onSelectBankName} = props;
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => ['100%'], []);

  const show = () => {
    bottomModalRefs.current?.present();
  };

  const hide = () => {
    bottomModalRefs.current?.close();
  };

  useImperativeHandle(ref, () => ({show, hide}), []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={'none'}
        onPressBackdrop={() => bottomModalRefs.current?.close()}
      />
    ),
    [],
  );

  const renderItems = useCallback(({item}: {item: PaymentBank}) => {
    return (
      <Pressable
        onPress={() => {
          onSelectBankName(item?.name as string);
          hide();
        }}>
        {item.image}
      </Pressable>
    );
  }, []);

  return (
    <BottomSheetModal
      ref={bottomModalRefs}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleComponent={() => null}
      topInset={heightScale1(48) + insets.top}
      enablePanDownToClose>
      <CustomText
        string={strings.driver_register.choose_bank}
        family={FONT_FAMILY.SEMI_BOLD}
        size={FONT.CAPTION_7}
        color={colors.menuTextColor}
        textStyle={{alignSelf: 'center', marginVertical: heightScale1(20)}}
        lineHeight={heightScale1(22)}
      />

      <BottomSheetFlatList
        data={PAYMENT_BANK_DATA}
        renderItem={renderItems}
        keyExtractor={item => item.id}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={{
          gap: PADDING1,
          paddingHorizontal: PADDING1,
          paddingBottom: heightScale1(52),
        }}
      />
    </BottomSheetModal>
  );
});

export default BottomSheetPaymentRegistration;

const styles = StyleSheet.create({
  indicatorStyle: {
    height: heightScale1(6),
    width: widthScale1(83),
    borderRadius: 999,
    backgroundColor: colors.grayCheckBox,
    alignSelf: 'center',
    marginTop: PADDING1,
  },
});
