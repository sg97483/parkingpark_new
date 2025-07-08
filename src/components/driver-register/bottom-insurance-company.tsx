import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {FlashList} from '@shopify/flash-list';
import React, {Ref, forwardRef, useCallback, useImperativeHandle, useMemo, useRef} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Icons} from '~/assets/svgs';
import CustomBackdrop from '~components/custom-backdrop';
import CustomText from '~components/custom-text';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import InsuranceCompanyCard from './insurance-company-card';
import {PanGestureHandler, ScrollView} from 'react-native-gesture-handler';

export interface ModalInsuranceCompanyRefs {
  show: () => void;
  hide: () => void;
}

export interface InsuranceCompanyModel {
  id: string;
  name: string;
  image: React.ReactNode;
}

const INSURANCE_COMPANY: InsuranceCompanyModel[] = [
  {
    id: '1',
    name: '삼성화재',
    image: <Icons.SamsungInsurance />,
  },
  {
    id: '2',
    name: 'H 현대해상',
    image: <Icons.HyundaiInsurance />,
  },
  {
    id: '3',
    name: 'DB손해보험',
    image: <Icons.DBInsurance />,
  },
  {
    id: '4',
    name: 'KB 손해보험',
    image: <Icons.KBInsurance />,
  },
  {
    id: '5',
    name: '한화손해보험',
    image: <Icons.HanwhaInsurance />,
  },
  {
    id: '6',
    name: 'MERITZ',
    image: <Icons.MeritzInsurance />,
  },
  {
    id: '7',
    name: '롯데손해보험',
    image: <Icons.LotteInsurance />,
  },
  {
    id: '8',
    name: 'MG손해보험',
    image: <Icons.MGInsurance />,
  },
  {
    id: '9',
    name: 'AXA다이렉트',
    image: <Icons.AXAInsurance />,
  },
  {
    id: '10',
    name: 'Carrot',
    image: <Icons.CarrotPermile />,
  },
  {
    id: '11',
    name: 'Heungkuk Finance Group',
    image: <Icons.HeungkukInsurance />,
  },
  {
    id: '12',
    name: '신한생명',
    image: <Icons.ShinhanInsurance />,
  },
  {
    id: '13',
    name: 'AIG',
    image: <Icons.AIGInsurance />,
  },
  {
    id: '14',
    name: 'CHUBB 에이스손해보험',
    image: <Icons.AceInsurance />,
  },
  {
    id: '15',
    name: 'The-K손해보험',
    image: <Icons.TheKInsurance />,
  },
];

interface Props {
  onSelected: (name: string) => void;
}

const BottomInsuranceCompany = forwardRef((props: Props, ref: Ref<any>) => {
  const {onSelected} = props;

  const modalBottomRefs = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['100%'], []);
  const insets = useSafeAreaInsets();

  const show = () => {
    modalBottomRefs.current?.present();
  };

  const hide = () => {
    modalBottomRefs.current?.close();
  };

  useImperativeHandle(ref, () => ({show, hide}), []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={'none'}
        onPressBackdrop={() => modalBottomRefs.current?.close()}
      />
    ),
    [],
  );

  const renderItems = useCallback(({item, index}: {item: InsuranceCompanyModel; index: number}) => {
    return (
      <InsuranceCompanyCard
        image={item.image}
        onPress={() => {
          onSelected(item.name);
          hide();
        }}
        containerStyle={{
          marginRight: index % 2 === 0 ? heightScale1(5) : 0,
          marginLeft: index % 2 === 0 ? 0 : heightScale1(5),
        }}
      />
    );
  }, []);

  return (
    <BottomSheetModal
      ref={modalBottomRefs}
      snapPoints={snapPoints}
      index={0}
      handleComponent={() => null}
      backdropComponent={renderBackdrop}
      topInset={insets.top + heightScale1(48)}
      enablePanDownToClose>
      <BottomSheetView style={{flex: 1}}>
        <CustomText
          string={strings.register_car_insurance_information.car_insurance_company}
          family={FONT_FAMILY.SEMI_BOLD}
          size={FONT.CAPTION_7}
          color={colors.menuTextColor}
          textStyle={{alignSelf: 'center', marginVertical: PADDING1}}
          lineHeight={fontSize1(22)}
          forDriveMe
        />

        <PaddingHorizontalWrapper
          forDriveMe
          containerStyles={{
            flex: 1,
          }}>
          <PanGestureHandler>
            <FlashList
              data={INSURANCE_COMPANY}
              renderItem={renderItems}
              numColumns={2}
              estimatedItemSize={139}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: heightScale1(42)}}
              renderScrollComponent={ScrollView}
            />
          </PanGestureHandler>
        </PaddingHorizontalWrapper>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default BottomInsuranceCompany;
