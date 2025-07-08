import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import Pdf from 'react-native-pdf';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {IS_ANDROID, PADDING, width} from '~constants/constant';
import {RootStackScreenProps} from '~navigators/stack';

const ValetInfo = memo((props: RootStackScreenProps<'ValetInfo'>) => {
  return (
    <FixedContainer>
      <CustomHeader text="실내 /실외 안심주차서비스 이용안내" contentHeaderStyle={styles.header} />
      <Pdf
        source={
          IS_ANDROID
            ? {uri: 'bundle-assets://pdf/info_self.pdf'}
            : require('../../android/app/src/main/assets/pdf/info_self.pdf')
        }
        style={styles.pdf}
        trustAllCerts={false}
        fitPolicy={0}
      />
    </FixedContainer>
  );
});

export default ValetInfo;

const styles = StyleSheet.create({
  image: {
    width: width,
    height: '100%',
    flex: 1,
  },
  header: {
    paddingLeft: PADDING * 2,
  },
  pdf: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
