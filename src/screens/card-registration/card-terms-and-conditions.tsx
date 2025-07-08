import React, {memo, useRef} from 'react';
import {View} from 'react-native';
import CustomMenu from '~components/commons/custom-menu';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import ViewTermsPopup, {
  ViewTermsRefs,
} from '~components/valet-parking-reservation/view-terms-popup';
import {RootStackScreenProps} from '~navigators/stack';
import {heightScale1} from '~styles/scaling-utils';

const TERMS_AND_CONDITIONS = [
  '정기과금 이용약관',
  '전자금융거래 이용약관',
  '개인정보 수집 및 이용안내',
  '고유식별정보 수집 및 이용안내',
  '개인정보제공 및 위탁안내',
];

const CardTermsAndConditions = memo((props: RootStackScreenProps<'CardTermsAndConditions'>) => {
  const termsRef = useRef<ViewTermsRefs>(null);
  return (
    <FixedContainer>
      <CustomHeader text="결제카드 등록 약관" />

      <View>
        {TERMS_AND_CONDITIONS?.flatMap((item, index) => {
          return (
            <View
              style={{
                minHeight: heightScale1(64),
              }}>
              <CustomMenu key={index} text={item} onPress={() => termsRef?.current?.show()} />
              <Divider />
            </View>
          );
        })}
      </View>

      <ViewTermsPopup ref={termsRef} />
    </FixedContainer>
  );
});

export default CardTermsAndConditions;
