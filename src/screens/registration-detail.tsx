import {Image, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import CustomText from '~components/custom-text';
import {PADDING} from '~constants/constant';
import {heightScale, widthScale} from '~styles/scaling-utils';
import {FONT, FONT_FAMILY} from '~constants/enum';
import {colors} from '~styles/colors';
import {generateRandomId} from '~utils/encrypt';
import {Icons} from '~/assets/svgs';
import {RootStackScreenProps} from '~navigators/stack';

const RegistrationDetail = (props: RootStackScreenProps<'RegistrationDetail'>) => {
  const {navigation} = props;

  return (
    <FixedContainer>
      <CustomHeader text="상세신고내용" />

      <ScrollView>
        <View style={{paddingVertical: heightScale(20), paddingHorizontal: PADDING}}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: heightScale(6)}}>
            <CustomText
              family={FONT_FAMILY.SEMI_BOLD}
              size={FONT.BODY}
              string="차량사고가 발생했어요."
            />
            <CustomText family={FONT_FAMILY.SEMI_BOLD} size={FONT.CAPTION_6} string=" • 처리완료" />
          </View>
          <CustomText color={colors.grayText} size={FONT.CAPTION_6} string="23.09.28(월) 07:10" />
        </View>
        <View style={styles.line} />

        <View style={styles.viewAllImage}>
          <View style={styles.viewText}>
            <CustomText string="차량사고가 발생했어요." />
          </View>

          <CustomText string="첨부이미지" />
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{marginTop: heightScale(10)}}>
            {[
              'https://media.wired.com/photos/5d09594a62bcb0c9752779d9/1:1/w_1500,h_1500,c_limit/Transpo_G70_TA-518126.jpg',
              'https://img.freepik.com/free-photo/blue-black-muscle-car-with-license-plate-that-says-trans-front_1340-23399.jpg',
            ].map(item => (
              <Image key={generateRandomId()} source={{uri: item}} style={styles.image} />
            ))}
          </ScrollView>
        </View>
        <View style={styles.line} />

        <View style={styles.viewBottom}>
          <View style={styles.viewMessage}>
            <Icons.Message />
            <CustomText string="답변" />
            <CustomText string=" • " />
            <CustomText string="1시간전" color={colors.grayText} />
          </View>
          <View style={styles.viewText}>
            <CustomText string="차량사고가 발생했어요." />
          </View>
        </View>
      </ScrollView>
    </FixedContainer>
  );
};

export default RegistrationDetail;
const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 1,
    backgroundColor: colors.policy,
  },
  viewText: {
    padding: widthScale(16),
    backgroundColor: colors.policy,
    minHeight: heightScale(110),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.disableButton,
    marginBottom: heightScale(20),
  },
  image: {
    width: widthScale(80),
    height: widthScale(80),
    borderRadius: 10,
    marginRight: widthScale(10),
  },
  viewAllImage: {
    marginHorizontal: PADDING,
    paddingTop: heightScale(30),
    marginBottom: heightScale(20),
  },
  viewMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightScale(20),
  },
  viewBottom: {
    marginHorizontal: PADDING,
    marginTop: heightScale(30),
  },
});
