import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import CustomButton from '~components/commons/custom-button';
import CustomCheckbox from '~components/commons/custom-checkbox';
import CustomHeader from '~components/custom-header';
import FixedContainer from '~components/fixed-container';
import {PADDING1} from '~constants/constant';
import {RootStackScreenProps} from '~navigators/stack';
import {heightScale1} from '~styles/scaling-utils';

const CarpoolTermsDetail = (props: RootStackScreenProps<'CarpoolTermsDetail'>) => {
  const {navigation, route} = props;

  const {acceptCarpool, disagreeCarpool, isChecked} = route.params;

  const isFocused = useIsFocused();

  const [disableButon, setDisableButton] = useState(!isChecked);

  useEffect(() => {
    if (!isFocused) {
      disableButon && disagreeCarpool?.();
    }
  }, [isFocused]);

  const onPressButton = () => {
    acceptCarpool?.();
    navigation.goBack();
  };

  return (
    <FixedContainer>
      <CustomHeader text="태워줘 서비스 이용약관" headerTextStyle={styles.textHeader} />

      <WebView
        style={styles.contentView}
        source={{
          uri: 'https://wisemobile.notion.site/wisemobile/2333b7d0093541cd98f0b99b808b0039',
        }}
        startInLoadingState={true}
        originWhitelist={['*']}
      />

      <View style={{marginHorizontal: PADDING1}}>
        <CustomCheckbox
          style={{marginVertical: heightScale1(10), alignSelf: 'baseline'}}
          isChecked={!disableButon}
          onPress={() => setDisableButton(!disableButon)}
          text="위 내용에 동의합니다."
        />

        <CustomButton
          onPress={onPressButton}
          text={'확인'}
          type="PRIMARY"
          disabled={disableButon}
          buttonHeight={58}
        />
      </View>
    </FixedContainer>
  );
};

export default CarpoolTermsDetail;

const styles = StyleSheet.create({
  text: {
    lineHeight: heightScale1(18),
    marginTop: heightScale1(25),
  },
  textHeader: {
    textAlign: 'center',
  },
  contentView: {
    paddingHorizontal: PADDING1,
  },
  checkBox: {
    marginVertical: heightScale1(10),
  },
});
