import React, {ReactNode, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import PageButton from '~components/commons/page-button';
import CustomText from '~components/custom-text';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {DRIVER_STATUS_REGISTRATION, FONT, FONT_FAMILY} from '~constants/enum';
import {strings} from '~constants/strings';
import {CarInsuranceInfo} from '~constants/types';
import {colors} from '~styles/colors';
import {heightScale1, widthScale1} from '~styles/scaling-utils';
import {fontSize1} from '~styles/typography';
import UploadImage from './upload-image';

interface Props {
  onPress: () => void;
  statusText: ReactNode;
  status: DRIVER_STATUS_REGISTRATION;
  isPending?: boolean;
  driverInfo: CarInsuranceInfo | undefined;
}

const CarImageRegister: React.FC<Props> = memo(props => {
  const text = strings.driver_register;

  const {onPress, statusText, status, isPending, driverInfo} = props;

  const isApproved = status === DRIVER_STATUS_REGISTRATION.APPROVED;

  return (
    <PaddingHorizontalWrapper containerStyles={styles.container} forDriveMe>
      <View>
        <HStack style={{gap: widthScale1(4)}}>
          <CustomText
            string={text.car_image}
            family={FONT_FAMILY.SEMI_BOLD}
            size={FONT.BODY}
            color={colors.menuTextColor}
            lineHeight={fontSize1(25)}
            forDriveMe
          />
          {isPending ? (
            <HStack style={{gap: widthScale1(4)}}>
              <Icons.Dot width={widthScale1(2)} height={widthScale1(2)} />
              {statusText}
            </HStack>
          ) : null}
        </HStack>

        {isPending ? (
          <View>
            {/* car images */}
            <HStack style={styles.boxImages}>
              <UploadImage
                containerStyle={{width: widthScale1(66)}}
                boxStyle={{height: heightScale1(66)}}
                title={'앞면'}
                onPress={() => console.log(123)}
                image={driverInfo?.carImageUrl as string}
              />
              <UploadImage
                containerStyle={{width: widthScale1(66)}}
                boxStyle={{height: heightScale1(66)}}
                title={'뒷면'}
                onPress={() => console.log(123)}
                image={driverInfo?.carImageUrl2 as string}
              />
              <UploadImage
                containerStyle={{width: widthScale1(66)}}
                boxStyle={{height: heightScale1(66)}}
                title={'측면'}
                onPress={() => console.log(123)}
                image={driverInfo?.carImageUrl3 as string}
              />
              <UploadImage
                containerStyle={{width: widthScale1(66)}}
                boxStyle={{height: heightScale1(66)}}
                title={'내부'}
                onPress={() => console.log(123)}
                image={driverInfo?.carImageUrl4 as string}
              />
            </HStack>

            {status === DRIVER_STATUS_REGISTRATION.REJECTED ? (
              <PageButton text="정확한 차량을 업로드 바랍니다." hideChevron />
            ) : null}
          </View>
        ) : (
          <CustomText
            string={text.please_register_photos_of_the_front_back_sides_and_interior_of_the_car}
            color={colors.grayText2}
            textStyle={{paddingTop: heightScale1(10)}}
            lineHeight={heightScale1(20)}
            forDriveMe
          />
        )}
      </View>

      {!isApproved && (
        <CustomButton
          type={isPending ? 'TERTIARY' : 'SECONDARY'}
          outLine={isPending}
          buttonStyle={[isPending ? {backgroundColor: colors.white} : {}]}
          text={isPending ? '수정하기' : text.register}
          onPress={onPress}
          disabled={isApproved}
          buttonHeight={48}
        />
      )}
    </PaddingHorizontalWrapper>
  );
});

export default CarImageRegister;

const styles = StyleSheet.create({
  container: {
    marginTop: PADDING1,
    backgroundColor: colors.white,
    paddingVertical: heightScale1(16),
    borderRadius: widthScale1(8),
    gap: PADDING1,
  },
  boxImages: {
    marginTop: heightScale1(20),
    justifyContent: 'space-between',
  },
});
