import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {RootStackScreenProps} from '~navigators/stack';
import FixedContainer from '~components/fixed-container';
import CustomHeader from '~components/custom-header';
import {PADDING} from '~constants/constant';
import {IMAGES} from '~/assets/images-path';
import {heightScale} from '~styles/scaling-utils';
import {ROUTE_KEY} from '~navigators/router';

const Event = memo((props: RootStackScreenProps<'Event'>) => {
  const {navigation} = props;

  return (
    <FixedContainer>
      <CustomHeader
        text="파킹박 주차비 할인권 및 제휴혜택 서비스"
        contentHeaderStyle={styles.header}
      />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('http://cafe.wisemobile.kr/imobile/bbs/breaker_estimate_apply.php');
          }}
          style={styles.eventWrapper}>
          <Image source={IMAGES.event_banner_1} resizeMode="stretch" style={styles.bannerImage} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTE_KEY.ValetParkingAtIncheon)}
          style={styles.eventWrapper}>
          <Image source={IMAGES.event_banner_2} resizeMode="stretch" style={styles.bannerImage} />
        </TouchableOpacity>
      </View>
    </FixedContainer>
  );
});

export default Event;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: PADDING,
  },
  bannerImage: {
    width: '100%',
    height: heightScale(55),
  },
  eventWrapper: {
    marginBottom: PADDING / 2,
  },
  header: {
    paddingLeft: PADDING * 2,
  },
});
