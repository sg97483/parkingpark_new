import React, {memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import FixedContainer from '~components/fixed-container';
import {RootStackScreenProps} from '~navigators/stack';
import {colors} from '~styles/colors';

const RegisterParkingSharedImageDetail = memo(
  (props: RootStackScreenProps<'RegisterParkingSharedImageDetail'>) => {
    const {navigation, route} = props;
    const {imageUrl} = route?.params;
    return (
      <FixedContainer style={{backgroundColor: colors.black}}>
        <IconButton
          icon="close"
          size={30}
          style={styles.button}
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
    top: 0,
    right: 0,
    zIndex: 1,
  },
});

export default RegisterParkingSharedImageDetail;
