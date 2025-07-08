import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {IMAGES} from '~/assets/images-path';
import CustomButton from '~components/commons/custom-button';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING, PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {userHook} from '~hooks/userHook';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {useReadMyCarpoolInfoQuery} from '~services/carpoolServices';
import {colors} from '~styles/colors';
import {heightScale, scale, widthScale} from '~styles/scaling-utils';

const BusinessCardAndVaccineCertification = (
  props: RootStackScreenProps<'BusinessCardAndVaccineCertification'>,
) => {
  const {navigation} = props;
  const {userID, userToken} = userHook();

  const {data: dataCarpool} = useReadMyCarpoolInfoQuery({memberId: userID as number});

  const isRegisteredBC =
    !!dataCarpool?.coAddress &&
    !!dataCarpool?.coName &&
    !!dataCarpool?.job &&
    !!dataCarpool?.jobType;

  const onPressButton = () => {
    navigation.navigate(ROUTE_KEY.BusinessCardAndVaccineRegistration, {
      isEdit: isRegisteredBC,
      isFromPsgProfile: true,
    });
  };

  const businessCardInfo = [
    {
      id: 1,
      title: '직종',
      value: dataCarpool?.job?.trim(),
    },
    {
      id: 2,
      title: '상세직업',
      value: dataCarpool?.jobType?.trim(),
    },
    {
      id: 3,
      title: '회사명',
      value: dataCarpool?.coName?.trim(),
    },
    {
      id: 4,
      title: '회사주소',
      value: dataCarpool?.coAddress?.trim(),
    },
    {
      id: 5,
      title: '명함인증',
      value: '인증완료',
    },
  ];

  return (
    <FixedContainer>
      <CustomHeader text="인증관리" />
      <View style={styles.container}>
        <PaddingHorizontalWrapper>
          <CustomText
            textStyle={styles.content}
            string={
              isRegisteredBC
                ? '명함 및 백신이 아래의 정보로\n인증 완료되었습니다.'
                : '명함 및 백신 인증받고\n카풀 매칭률을 높여보세요!'
            }
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.CAPTION_8}
            lineHeight={28}
            forDriveMe
          />
          <Image
            source={isRegisteredBC ? IMAGES.confirmation : IMAGES.register_business_card}
            height={heightScale(130)}
            width={widthScale(230)}
            style={styles.image}
          />
        </PaddingHorizontalWrapper>
        {isRegisteredBC && (
          <PaddingHorizontalWrapper containerStyles={styles.infoContainer}>
            {businessCardInfo.map(i => (
              <HStack key={i.id} style={styles.infoItem}>
                <CustomText
                  forDriveMe
                  textStyle={styles.title}
                  string={i.title}
                  color="#8B8B8B"
                  family={FONT_FAMILY.MEDIUM}
                  size={FONT.CAPTION_6}
                />
                <CustomText
                  forDriveMe
                  textStyle={styles.value}
                  string={i?.value || ''}
                  family={FONT_FAMILY.MEDIUM}
                  size={FONT.CAPTION_6}
                />
              </HStack>
            ))}
          </PaddingHorizontalWrapper>
        )}
      </View>
      <PaddingHorizontalWrapper forDriveMe>
        <CustomButton
          type={isRegisteredBC ? 'TERTIARY' : 'PRIMARY'}
          outLine={isRegisteredBC}
          text={isRegisteredBC ? '인증내용 변경요청' : '명함 및 백신 인증하기'}
          buttonHeight={58}
          buttonStyle={{
            marginVertical: PADDING1 / 2,
          }}
          onPress={onPressButton}
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
};

export default BusinessCardAndVaccineCertification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: colors.white,
    borderColor: colors.disableButton,
    borderRadius: widthScale(8),
    paddingVertical: heightScale(18),
    marginVertical: PADDING / 2,
  },
  content: {
    paddingTop: scale(20),
  },
  image: {
    alignSelf: 'center',
    marginTop: heightScale(50),
  },
  infoContainer: {
    paddingTop: heightScale(60),
  },
  infoItem: {
    gap: widthScale(12),
    paddingBottom: heightScale(6),
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
  },
  value: {
    flex: 4,
  },
});
