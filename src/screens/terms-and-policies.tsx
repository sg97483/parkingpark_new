import React, {useRef, useState} from 'react';
import {Linking, ScrollView, StyleSheet, View} from 'react-native';
import CustomMenu from '~components/commons/custom-menu';
import CustomHeader from '~components/custom-header';
import Divider from '~components/divider';
import FixedContainer from '~components/fixed-container';
import TermModal, {TermModalRefs} from '~components/preferences/term-modal';
import {carpool_terms} from '~constants/carpool-terms';
import {PADDING1} from '~constants/constant';
import {RootStackScreenProps} from '~navigators/stack';
import {heightScale1} from '~styles/scaling-utils';
import CustomText from '~components/custom-text';

const businessInfoText = `상호 : 와이즈모바일(주)  |  대표 : 박흥록
주소 : 서울시 성동구 왕십리로 10길 6, 서울숲비즈포레 802호

사업자등록번호: 105-87-70914
통신판매업 신고번호 : 2020-서울성동-01264호
서비스 이용문의 : 02-707-3371  | 
서비스제휴문의 : parkingpark@wisemobile.co.kr
COPYRIGHT WISEMOBILE. All Rights Reserved.`;

const TERMS_AND_POLICIES: {title: string; onPress?: () => void}[] = [
  {
    title: '파킹박 이용약관',
    onPress() {
      Linking.openURL('https://wisemobile.notion.site/b3c3bb0d254c41ccb0cd810d2888b6ac?pvs=4');
    },
  },
  {
    title: '태워줘 이용약관',
    onPress() {
      Linking.openURL('https://wisemobile.notion.site/2333b7d0093541cd98f0b99b808b0039?pvs=4');
    },
  },
  {
    title: '개인(위치)정보 처리방침',
    onPress() {
      Linking.openURL('https://wisemobile.notion.site/c0d7df4d63e64e1db545f01b83f05e30?pvs=4');
    },
  },
  {
    title: '위치정보 이용약관',
    onPress() {
      Linking.openURL('https://wisemobile.notion.site/c451c8d33b4146eab6c0e76886b36452?pvs=4');
    },
  },
  {
    title: '와이즈모바일(주) 사업자 정보',
  },
];

const TermsAndPolicies = (props: RootStackScreenProps<'TermsAndPolicies'>) => {
  const termModalRef = useRef<TermModalRefs>(null);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);

  const handleMenuPress = (item: {title: string; onPress?: () => void}) => {
    if (item.title === '와이즈모바일(주) 사업자 정보') {
      // 해당 항목 클릭 시 추가 정보(사업자 정보)를 토글
      setShowBusinessInfo(prev => !prev);
    } else {
      if (item.onPress) {
        item.onPress();
      } else {
        termModalRef?.current?.show();
      }
    }
  };

  return (
    <FixedContainer>
      <CustomHeader text="약관 및 정책정보" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {TERMS_AND_POLICIES.map((item, index) => (
          <View key={index}>
            <CustomMenu text={item.title} onPress={() => handleMenuPress(item)} menuHeight={64} />
            {item.title === '와이즈모바일(주) 사업자 정보' && showBusinessInfo && (
              <View style={styles.businessInfoContainer}>
                {/* 요청하신 텍스트를 똑같은 형식으로 두 줄에 걸쳐 표출 */}
                <CustomText string={businessInfoText} />
              </View>
            )}
            <Divider />
          </View>
        ))}
      </ScrollView>

      {/* Term modal */}
      <TermModal ref={termModalRef} content={carpool_terms} />
    </FixedContainer>
  );
};

export default TermsAndPolicies;

const styles = StyleSheet.create({
  itemStyle: {
    paddingHorizontal: PADDING1,
    justifyContent: 'space-between',
    minHeight: heightScale1(64),
  },
  businessInfoContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});
