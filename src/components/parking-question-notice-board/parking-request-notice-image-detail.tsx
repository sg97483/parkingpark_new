import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FixedContainer from '~components/fixed-container';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';

const ParkingRequestNoticeImageDetail = memo(
  (props: RootStackScreenProps<'ParkingRequestNoticeImageDetail'>) => {
    const {navigation, route} = props;

    const {imageUrl} = route?.params;

    const inset = useSafeAreaInsets();

    return (
      <FixedContainer style={{backgroundColor: colors.black}}>
        <IconButton
          icon="close"
          size={30}
          style={[styles.button, {top: inset.top}]}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.imageWrapper}>
          <Image source={{uri: imageUrl}} style={styles.image} resizeMode="contain" />
        </View>
      </FixedContainer>
    );
  },
);

const styles = StyleSheet.create({
  imageWrapper: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
});

export default ParkingRequestNoticeImageDetail;
