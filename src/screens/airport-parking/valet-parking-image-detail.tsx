import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Button from '~components/button';
import FixedContainer from '~components/fixed-container';
import {PADDING} from '~constants/constant';
import {strings} from '~constants/strings';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';
import {heightScale, widthScale} from '~styles/scaling-utils';

const ValetParkingImageDetail = memo((props: RootStackScreenProps<'ValetParkingImageDetail'>) => {
  const {navigation, route} = props;
  const {imageUrl, paymentHistoryId, number} = route?.params;
  return (
    <FixedContainer style={{backgroundColor: colors.black}}>
      <View style={styles.imageWrapper}>
        <Image source={{uri: imageUrl}} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          text={strings.valet_parking_image_detail.back}
          onPress={() => navigation.goBack()}
          borderColor={colors.transparent}
          color={colors.gray}
          style={styles.button}
          textColor={colors.black}
        />

        <Button
          text={strings.valet_parking_image_detail.delete}
          onPress={() => {}}
          borderColor={colors.transparent}
          color={colors.primary}
          style={styles.button}
          textColor={colors.black}
        />
      </View>
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  imageWrapper: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonWrapper: {
    height: heightScale(150),
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '95%',
    borderRadius: widthScale(5),
    marginTop: PADDING / 2,
    height: heightScale(40),
  },
});

export default ValetParkingImageDetail;
