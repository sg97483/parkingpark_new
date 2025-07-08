import React, {memo} from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import CustomCheckbox from '~components/commons/custom-checkbox';
import {colors} from '~styles/colors';
import {heightScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import {FONT_FAMILY} from './enum';
import {PADDING1} from './constant';

const TextBlack = ({text, style}: {text: string; style?: TextStyle}) => (
  <Text style={[{color: colors.black}, style]}>{text}</Text>
);

export const CarpoolInsuranceRiderPolicyText = memo(
  ({
    accept,
    onChangeAccept,
  }: {
    accept: {'1': boolean; '2': boolean; '3': boolean};
    onChangeAccept: (_: {'1': boolean; '2': boolean; '3': boolean}) => void;
  }) => {
    const allAccepted = accept['1'] && accept['2'] && accept['3'];

    return (
      <>
        <Text style={styles.text}>
          <Text style={styles.titleText}>◆드라이버 안심보험 이용약관 동의</Text>
          {`

▣ 이 동의서는 와이즈모바일(주)가 고객님을 피보험자로 하는 보험을 가입 혹은 해지하기 위하여 고객님의 동의를 필요로 하는 자료입니다.
▣ 이 보험은 (주)KB손해보험의 KB플러스사랑단체상해보험이며, 보험계약자는 와이즈모바일(주)입니다.
▣ 보험증권은 고객님께 별도로 발행하지 않으며 해당보험이 보장하는 담보는 아래와 같습니다.
▣ 와이즈모바일(주)와 (주)KB손해보험의 사정에 따라 보험조건이 변경되거나, 보험계약이 중단될 수 있습니다.
▣ 보험료는 와이즈모바일(주)에서 부담하며, 가입대상은 "태워줘" 서비스를 이용하는 고객(드라이버(운전자) 및 이용객(탑승객))입니다. (보험서비스 가입을 위해 신용정보 사전활용에 동의한 고객)
  ※ 신용정보활용동의는 2011년 9월 30일 개정 시행된 신용정보의 이용 및 보호에 관한 법률에 따른 필수 절차이며, 보험서비스 가입 이외 어떠한 마케팅용도로 사용되지 아니하며, 무료보험가입을 희망하지 않는 고객님은 동의하지 않으셔도 됩니다.
▣ 보험금 청구 : 보험에서 보장하는 사고 발생시 그 사실을 (주)KB손해보험에 통보하시고 해당서류를 구비하여 제출하시기 바랍니다.
▣ (주)KB손해보험 연락처 : 보상콜센터 ☎1544-1616(ARS 2번 누르고 상담원 연결), 영업담당자 (주)KB손해보험 법인영업5부 송현준 과장 ☎02-6900-3534

■ "태워줘" 카풀안심보험 가입 및 개인 신용정보의 제공 활용 동의

◆ 보장하는 담보

*상해사망
-보장내용: 급격하고 우연한 외래의 사고로 신체에 입은 상해의 직접결과로 사망한 경우 사망보험금 지급
-보장금액: 3천만원
-보장기간: 가입일로부터 1개월(회원탈퇴 시까지 1개월씩 자동연장)
-적용대상: "태워줘" 드라이버(운전자) 및 이용객(탑승객)

*상해 후유장애
-보장내용: 상해로 약관의 장해분류표에서 정한 장해지급률에 해당하는 장해상태가 되었을 때, 후유장애보험금(장해지급률을 보험가입금액에 곱하여 산출한 금액)을 지급
-보장금액: 3천만원
-보장기간: 가입일로부터 1개월(회원탈퇴 시까지 1개월씩 자동연장)
-적용대상: "태워줘" 드라이버(운전자) 및 이용객(탑승객)

*폭력피해위로금
-보장내용: 사망하거나 신체에 피해발생시 500만원 지급
 1. 형법 제25장에서 정하는 상해와 폭행의 죄
 2. 형법 제38장에서 정하는 강도죄
 3. 폭력행위 등 처벌에 관한 법률(이하 "폭처법"이라 합니다)에 정한 폭력 등의 죄
-보장금액: 500만원
-보장기간: 가입일로부터 1개월(회원탈퇴 시까지 1개월씩 자동연장)
-적용대상: "태워줘" 드라이버(운전자) 및 이용객(탑승객)

◆ 보험 가입 및 해지 동의\n 피보험자 본인은 와이즈모바일(주)에서 제공하는 "태워줘" 서비스 가입시 와이즈모바일(주)에서 보험료를 부담하는 KB플러스사랑단체상해보험에 가입함을 동의합니다.  또한 보험의 효력기간은 "태워줘" 서비스 가입일로부터 1개월이며 회원탈퇴시까지 1개월씩 자동연장됩니다. 이전 또는 이후 발생하는 사고에 대해서는 보상이 되지 않음에 동의합니다. 

◆ 보험금 수령자 및 보험조건 변경 가능성\n이 보험서비스는 와이즈모바일(주)에서 제공하는 "태워줘" 서비스에 가입하고 이용한 본인에 한하여 보상되며, "태워줘" 서비스 이용 중 발생한 사고에 한하여 보상합니다. 보험조건은 와이즈모바일(주)와 (주)KB손해보험의 사정에 따라 변경되거나 중단될 수 있습니다. 이에 동의 합니다.`}
        </Text>

        <CustomCheckbox
          isChecked={accept[1]}
          onPress={() => onChangeAccept({...accept, '1': !accept?.[1]})}
          text={'동의합니다.'}
          style={{marginVertical: PADDING1, alignSelf: 'baseline'}}
        />

        <Text
          style={[
            styles.text,
            {marginTop: 0, fontSize: fontSize1(13), fontFamily: FONT_FAMILY.MEDIUM},
          ]}>{`◆ 개인 신용정보의 제공 활용 동의\n 이 계약과 관련하여 귀사가 본인으로부터 취득한 개인신용정보를 타인에게 제공하거나 신용정보집중기관으로부터 본인의 개인신용정보를 조회하고자 하는 경우에는  "신용정보의 이용 및 보호에 관한 법률" 제32조에 따라 동의를 얻어야 합니다. 이에 피보험자 본인은 와이즈모바일(주)가 제공하는 KB손해보험㈜의 플러스사랑단체상해보험에 가입하는 것을 동의하며, 또한 "신용정보의 이용 및 보호에 관한 법률" 제32조에서 정하는 절차에 따라 개인신용정보의 제공·활용에 동의하고, 동의서에 기재하여 제공하는  신용정보의 내용에 아래의 사항이 포함됨을 확인합니다.

[개인신용정보의 제공에 관한 내용]
- 제공대상기관: 주식회사KB손해보험
'- 제공목적: (주)KB손해보험의 플러스사랑단체상해보험 가입
'- 제공받는자의 정보 보유, 이용기간:  본 계약의 체결시부터 위 법 제37조에 따라 개인신용정보 제공, 이용동의를 철회한 때까지
'- 제공할 개인신용정보의 내용
(1) 피보험자의 성명, 연락처 등 개인식별정보
(2) 피보험자의 "태워줘" 서비스 이용일/이용구간/해지일  등 보험관련 계약내용
        
※ 무료 보험 가입에 동의합니다.
        `}</Text>

        <CustomCheckbox
          isChecked={accept[2]}
          onPress={() => onChangeAccept({...accept, '2': !accept?.[2]})}
          text={'동의합니다.'}
          style={{marginVertical: PADDING1, alignSelf: 'baseline'}}
        />

        <Text
          style={[
            styles.text,
            {marginTop: 0, fontSize: fontSize1(13), fontFamily: FONT_FAMILY.MEDIUM},
          ]}>
          {
            '이에 대한 내용을 설명들었으며 이를 확인하였고, 와이즈모바일(주)에서 고객님을 피보험자로 계약하는 것에 동의합니다.'
          }
        </Text>

        <CustomCheckbox
          isChecked={accept[3]}
          onPress={() => onChangeAccept({...accept, '3': !accept?.[3]})}
          text={'동의합니다.'}
          style={{marginVertical: heightScale1(20), alignSelf: 'baseline'}}
        />

        <Text
          style={[
            styles.text,
            {marginTop: 0},
          ]}>{`상법 제731조에 의거하여 무료보험 보장내용 중 사망담보가 포함되어 있는 경우 동의를 해 주셔야만 계약이 유효하게 성립되며, 보장을 받으실 수 있습니다.
☞ 상법제731조 (타인의 생명의 보험)
①타인의 사망을 보험사고로 하는 보험계약에는 보험계약 체결시에 그 타인의 서면에 의한 동의를 얻어야 한다. 
②보험계약으로 인하여 생긴 권리를 피보험자가 아닌 자에게 양도하는 경우에도 제1항과같다.`}</Text>

        <CustomCheckbox
          isChecked={allAccepted} // Check if all agreements are accepted
          onPress={() =>
            onChangeAccept({
              '1': !allAccepted,
              '2': !allAccepted,
              '3': !allAccepted,
            })
          } // Update accept state for all agreements
          text={'위 내용에 전체 동의합니다.'} // Text for the new checkbox
          style={{marginVertical: heightScale1(20), alignSelf: 'baseline'}}
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  titleText: {
    lineHeight: heightScale1(18),
    fontFamily: FONT_FAMILY.SEMI_BOLD,
    fontSize: fontSize1(12),
    color: colors.grayText2,
  },
  text: {
    lineHeight: heightScale1(18),
    marginTop: PADDING1,
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: fontSize1(13),
    color: colors.grayText2,
    textAlign: 'justify',
  },
});
