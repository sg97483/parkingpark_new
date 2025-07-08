import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {ICONS} from '~/assets/images-path';
import HStack from '~components/h-stack';
import {ROUTE_KEY} from '~navigators/router';
import {UseRootStackNavigation} from '~navigators/stack';
import {heightScale, widthScale} from '~styles/scaling-utils';

interface Props {
  style?: ViewStyle;
}

const RegisterParkingSharedFooter: React.FC<Props> = props => {
  const {style} = props;
  const navigation: UseRootStackNavigation = useNavigation();
  return (
    <View style={style}>
      <HStack>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate(ROUTE_KEY.ContactUs)}>
          <Image source={ICONS.btn_bottom_02} style={styles.buttonIcon} resizeMode="contain" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate(ROUTE_KEY.RegisterParkingSharedDetail)}>
          <Image source={ICONS.btn_bottom_10} style={styles.buttonIcon} resizeMode="contain" />
        </TouchableOpacity>
      </HStack>
    </View>
  );
};

export default memo(RegisterParkingSharedFooter);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    width: widthScale(70),
    height: heightScale(70),
  },
});
