import React, {memo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Icons} from '~/assets/svgs';
import CustomButton from '~components/commons/custom-button';
import CustomText from '~components/custom-text';
import FixedContainer from '~components/fixed-container';
import HStack from '~components/h-stack';
import PaddingHorizontalWrapper from '~components/padding-horizontal-wrapper';
import {PADDING1} from '~constants/constant';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {ROUTE_KEY} from '~navigators/router';
import {RootStackScreenProps} from '~navigators/stack';
import {cacheIsFirstRun} from '~reducers/termAndContionReducer';
import {useAppDispatch} from '~store/storeHooks';
import {colors} from '~styles/colors';
import {heightScale1, scale1, widthScale1} from '~styles/scaling-utils';

const PermissionActivity = memo((props: RootStackScreenProps<'PermissionActivity'>) => {
  const {navigation} = props;
  const dispatch = useAppDispatch();

  const handleNextPage = () => {
    dispatch(cacheIsFirstRun(false));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: ROUTE_KEY.ParkingParkHome,
        },
      ],
    });
  };

  return (
    <FixedContainer>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.containerStyle}>
        <CustomText
          forDriveMe
          size={FONT.CAPTION_9}
          family={FONT_FAMILY.SEMI_BOLD}
          lineHeight={heightScale1(31)}
          string={'고객님의 편리한\n파킹박 서비스 이용을 위해 아래\n접근권한의 허용이 필요합니다.'}
        />

        <View style={styles.contentStyle}>
          <HStack style={styles.itemWrapperStyle}>
            <View style={styles.iconWrapperStyle}>
              <Icons.ArchiveBox />
            </View>
            <View style={{gap: heightScale1(2)}}>
              <CustomText
                forDriveMe
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.SEMI_BOLD}
                lineHeight={heightScale1(22)}
                string="저장공간(필수)"
              />
              <CustomText
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                lineHeight={heightScale1(20)}
                color={colors.lineInput}
                string="개인 프로필 및 지도 저장"
              />
            </View>
          </HStack>

          <HStack style={styles.itemWrapperStyle}>
            <View style={styles.iconWrapperStyle}>
              <Icons.Phone />
            </View>
            <View style={{gap: heightScale1(2)}}>
              <CustomText
                forDriveMe
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.SEMI_BOLD}
                lineHeight={heightScale1(22)}
                string="통화상태관리(필수)"
              />
              <CustomText
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                lineHeight={heightScale1(20)}
                color={colors.lineInput}
                string="개인정보 암호화 및 관리"
              />
            </View>
          </HStack>

          <HStack style={styles.itemWrapperStyle}>
            <View style={styles.iconWrapperStyle}>
              <Icons.Camera />
            </View>
            <View style={{gap: heightScale1(2)}}>
              <CustomText
                forDriveMe
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.SEMI_BOLD}
                lineHeight={heightScale1(22)}
                string="카메라(선택)"
              />
              <CustomText
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                lineHeight={heightScale1(20)}
                color={colors.lineInput}
                string="사진찍기 및 게시판 사진 첨부"
              />
            </View>
          </HStack>

          <HStack style={styles.itemWrapperStyle}>
            <View style={styles.iconWrapperStyle}>
              <Icons.Marker />
            </View>
            <View style={{gap: heightScale1(2)}}>
              <CustomText
                forDriveMe
                size={FONT.CAPTION_7}
                family={FONT_FAMILY.SEMI_BOLD}
                lineHeight={heightScale1(22)}
                string="위치(선택)"
              />
              <CustomText
                forDriveMe
                family={FONT_FAMILY.MEDIUM}
                lineHeight={heightScale1(20)}
                color={colors.lineInput}
                string="현위치에서 주차장 조회 및 검색에 사용"
              />
            </View>
          </HStack>
        </View>

        <View>
          <HStack style={styles.warningTextWrapperStyle}>
            <Icons.Dot
              style={{
                top: heightScale1(9),
              }}
              fill={colors.lineInput}
            />
            <CustomText
              forDriveMe
              lineHeight={heightScale1(20)}
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION}
              color={colors.lineInput}
              string="접근 권한 변경시 [기기설정]-[어플리케이션]-[파킹박]-[권한]"
            />
          </HStack>
          <HStack style={styles.warningTextWrapperStyle}>
            <Icons.Dot
              style={{
                top: heightScale1(9),
              }}
              fill={colors.lineInput}
            />
            <CustomText
              forDriveMe
              lineHeight={heightScale1(20)}
              family={FONT_FAMILY.MEDIUM}
              size={FONT.CAPTION}
              color={colors.lineInput}
              string="선택 권한은 서비스 사용 중 필요한 시점에 동의를 받고 있습니다. 허용하지 않을 경우에도 해당 기능 외 서비스는 이용 가능합니다."
            />
          </HStack>
        </View>
      </ScrollView>

      <PaddingHorizontalWrapper forDriveMe>
        <CustomButton
          text="확인"
          buttonHeight={58}
          buttonStyle={styles.buttonStyle}
          onPress={handleNextPage}
        />
      </PaddingHorizontalWrapper>
    </FixedContainer>
  );
});
export default PermissionActivity;

const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: heightScale1(10),
    marginBottom: PADDING1 / 2,
  },
  containerStyle: {
    paddingTop: heightScale1(70),
    paddingHorizontal: PADDING1,
  },
  contentStyle: {
    marginTop: PADDING1,
    marginBottom: heightScale1(40),
    gap: heightScale1(30),
  },
  warningTextWrapperStyle: {
    gap: widthScale1(6),
    alignItems: 'flex-start',
  },
  iconWrapperStyle: {
    width: widthScale1(48),
    height: widthScale1(48),
    backgroundColor: colors.policy,
    borderRadius: scale1(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrapperStyle: {
    gap: widthScale1(10),
  },
});
