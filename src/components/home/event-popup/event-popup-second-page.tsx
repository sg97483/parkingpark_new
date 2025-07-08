import {Image, StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {width} from '~constants/constant';

interface Props {
  image: string;
}

const EventPopupSecondPage: React.FC<Props> = memo(props => {
  const {image} = props;
  return (
    <View style={styles.container}>
      <Image source={{uri: image}} style={styles.image} resizeMode="contain" />
    </View>
  );
});

export default EventPopupSecondPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width * 0.8,
  },
  image: {
    flex: 1,
  },
});
